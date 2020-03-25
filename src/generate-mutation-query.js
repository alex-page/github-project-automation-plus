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

	// Flatten the org and repo projects that match the user provided projectName
	const matchingNewProjects = [...repoProjects, ...orgProjects]
		.filter(project => project.name === projectName)
		.flatMap(project =>
			project.columns.nodes.length === 0 ? [] : project.columns.nodes
		);

	if (matchingNewProjects.length === 0) {
		throw new Error(`Could not find the project "${projectName}"`);
	}

	// Columns that match the column inputted
	const newColumnIds = matchingNewProjects
		.filter(column => column.name === columnName)
		.map(column => column.id);

	if (newColumnIds.length === 0) {
		throw new Error(`Could not find the column "${columnName}" in project "${projectName}"`);
	}

	// Get an array of cards that are assigned to the correct project
	const assingedProjects = data.projectCards.nodes
		.filter(card => card.project.name === projectName);

	// Get cards in the right project that are not in the correct column
	const currentCards = assingedProjects
		.filter(card => !newColumnIds.includes(card.column.id));

	// Create an array of queries to move the card
	const moveProjectCard = currentCards.map(card =>
		`mutation {
			moveProjectCard( input: {
				cardId: "${card.id}",
				columnId: "${card.column.id}"
		}) { clientMutationId } }`
	);

	// Get column ids where the card does not exist
	const currentColumnIds = currentCards.map(card => card.column.id);
	const emptyColumns = newColumnIds
		.filter(columnId => !currentColumnIds.includes(columnId));

	// Create an an array of queries to add the card
	const addProjectCard = emptyColumns.map(columnId =>
		`mutation {
			addProjectCard( input: {
				contentId: "${contentId}",
				projectColumnId: "${columnId}"
		}) { clientMutationId } }`
	);

	return [...addProjectCard, ...moveProjectCard];
};

module.exports = generateMutationQuery;
