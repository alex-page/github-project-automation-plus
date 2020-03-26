/**
 * Get a list of columns for the matching project and columns names
 *
 * @param {object} data - The graphQL data
 * @param {string} projectName - The user inputted project name
 * @param {string} columnName - The user inputted column name
 * @param {string} contentId - The id of the issue or pull request
 */
const generateMutationQuery = (data, projectName, columnName, contentId) => {
	// All the projects found in organisation and repositories
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

	const cardLocations = {};

	// Get the ids of the end card location
	endLocation.forEach(project => {
		cardLocations[project.id] = {
			columnId: project.columns.nodes
				.filter(column => column.name === columnName)
				.map(column => column.id)[0]
		};
	});

	// See if the card exists in the provided project
	const currentLocation = data.projectCards.nodes
		.filter(card => card.project.name === projectName);

	currentLocation.forEach(card => {
		cardLocations[card.project.id].cardId = card.id;
	});

	// If the card already exists in the project move it otherwise add a new card
	const mutations = Object.keys(cardLocations).map(mutation => cardLocations[mutation].cardId ?
		`mutation {
			moveProjectCard( input: {
				cardId: "${cardLocations[mutation].cardId}",
				columnId: "${cardLocations[mutation].columnId}"
		}) { clientMutationId } }` :

		`mutation {
			addProjectCard( input: {
				contentId: "${contentId}",
				projectColumnId: "${cardLocations[mutation].columnId}"
		}) { clientMutationId } }`
	);

	return mutations;
};

module.exports = generateMutationQuery;
