/**
 * Get a list of columns for the matching project and columns names
 *
 * @param {object} data - The graphQL data
 * @param {string} projectName - The user inputted project name
 * @param {string} columnName - The user inputted column name
 * @param {string} contentId - The id of the issue or pull request
 */
const generateMutationQuery = (data, projectName, columnName, contentId) => {
	// All the projects found
	const repoProjects = data.repository.projects.nodes || [];
	const orgProjects = (data.repository.owner &&
		data.repository.owner.projects &&
		data.repository.owner.projects.nodes) ||
		[];

	// Find matching projects and columns for the card to move to
	const endLocation = [...repoProjects, ...orgProjects]
		.filter(project => project.name === projectName)
		.flatMap(project => project)
		.filter(project => {
			const matchingColumns = project.columns.nodes
				.filter(column => column.name === columnName);
			return matchingColumns.length !== 0;
		});

	// There are no locations for the card to move to
	if (endLocation.length === 0) {
		throw new Error(`Could not find the column "${columnName}" or project "${projectName}"`);
	}

	// Get the ids of the end card location
	const endLocationIds = endLocation.map(project => ({
		projectId: project.id,
		columnId: project.columns.nodes
			.filter(column => column.name === columnName)
			.map(column => column.id)[0]
	}));

	// See if the card has a current location
	const currentLocation = data.projectCards.nodes
		.filter(card => card.project.name === projectName);

	const currentLocationIds = currentLocation.map(card => ({
		projectId: card.project.id,
		columnId: card.column.id,
		cardId: card.id
	}));

	// Get cards to create when they do not have a matching existing project
	const currentCardProjectIds = currentLocationIds.map(ids => ids.projectId);
	const newCards = endLocationIds.filter(ids => !currentCardProjectIds.includes(ids.projectId));

	// Create an an array of queries to add the card
	const addProjectCardQueries = newCards.map(card =>
		`mutation {
			addProjectCard( input: {
				contentId: "${contentId}",
				projectColumnId: "${card.columnId}"
		}) { clientMutationId } }`
	);

	// Get cards to move when they exist in a project
	const endLocationProjectIds = endLocationIds.map(ids => ids.projectId);
	const moveCards = currentLocationIds.filter(ids => endLocationProjectIds.includes(ids.projectId));

	// Create an array of queries to move the card
	const moveProjectCardQueries = moveCards.map(card => {
		const endLocation = endLocationIds.filter(ids => ids.projectId === card.projectId)[0];

		return `mutation {
			moveProjectCard( input: {
				cardId: "${card.cardId}",
				columnId: "${endLocation.columnId}"
		}) { clientMutationId } }`;
	});

	return [...addProjectCardQueries, ...moveProjectCardQueries];
};

module.exports = generateMutationQuery;
