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

	// Get the data where the project ID and column ID match the user input
	const foundProjects = [...repoProjects, ...orgProjects]
		.filter(project => project.name === projectName)
		.flatMap(project => project)
		.filter(project => {
			const matchingColumns = project.columns.nodes
				.filter(column => column.name === columnName);
			return matchingColumns.length !== 0;
		});

	// Searching for the project and column returned no results
	if (foundProjects.length === 0) {
		throw new Error(`Could not find the column "${columnName}" or project "${projectName}"`);
	}

	// Get the id's that match the user input
	const foundIds = foundProjects.map(project => ({
		projectId: project.id,
		columnId: project.columns.nodes
			.filter(column => column.name === columnName)
			.map(column => column.id)[0]
	}));

	// Get the current cards for the issue of pull request if they match the user input
	const currentCards = data.projectCards.nodes
		.filter(card => card.project.name === projectName);

	const currentIds = currentCards.map(card => ({
		projectId: card.project.id,
		columnId: card.column.id,
		cardId: card.id
	}));

	// Get cards when they do not have a matching existing project
	const currentCardProjectIds = currentIds.map(ids => ids.projectId);
	const newCards = foundIds.filter(ids => !currentCardProjectIds.includes(ids.projectId));

	// Create an an array of queries to add the card
	const addProjectCardQueries = newCards.map(card =>
		`mutation {
			addProjectCard( input: {
				contentId: "${contentId}",
				projectColumnId: "${card.columnId}"
		}) { clientMutationId } }`
	);

	// Get cards when they have a matching project
	const foundCardProjectIds = foundIds.map(ids => ids.projectId);
	const moveCards = currentIds.filter(ids => foundCardProjectIds.includes(ids.projectId));

	// Create an array of queries to move the card
	const moveProjectCardQueries = moveCards.map(card =>
		`mutation {
			moveProjectCard( input: {
				cardId: "${card.cardId}",
				columnId: "${card.columnId}"
		}) { clientMutationId } }`
	);

	return [...addProjectCardQueries, ...moveProjectCardQueries];
};

module.exports = generateMutationQuery;
