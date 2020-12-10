/**
 * Get a list of columns for the matching project and columns names
 *
 * @param {object} data - The graphQL data
 * @param {string} projectName - The user inputted project name
 * @param {string} columnName - The user inputted column name
 * @param {string} contentId - The id of the issue or pull request
 * @param {"delete"|"archive"|"update"} action - the action to be performed on the card
 */
// if this is important, we will need to refactor the function
// eslint-disable-next-line max-params
const generateMutationQuery = (data, projectName, columnName, contentId, action) => {
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
		cardLocations[card.project.id].isArchived = card.isArchived;
	});

	// If the card already exists in the project move it otherwise add a new card
	const mutations = Object.keys(cardLocations).map(mutation => {
		if (action === 'update') {
			// Othervise keep default procedure
			return cardLocations[mutation].cardId ?
				`mutation {
					moveProjectCard( input: {
						cardId: "${cardLocations[mutation].cardId}",
						columnId: "${cardLocations[mutation].columnId}"
				}) { clientMutationId } }` :

				`mutation {
					addProjectCard( input: {
						contentId: "${contentId}",
						projectColumnId: "${cardLocations[mutation].columnId}"
				}) { clientMutationId } }`;
		}

		if (action === 'delete' && cardLocations[mutation].cardId) {
			// Delete issue from all boards, this if block
			// prevents adding issue in case it has no card yet
			return `mutation {
						deleteProjectCard( input: {
							cardId: "${cardLocations[mutation].cardId}"
					}) { clientMutationId } }`;
		}

		if (action === 'archive' && !cardLocations[mutation].isArchived) {
			// Archive issue  if not already archived
			return `mutation {
						updateProjectCard(input: { 
							projectCardId: "${cardLocations[mutation].cardId}", 
							isArchived: true 
					}) { clientMutationId } }`;
		}

		return undefined;
	});

	return mutations.filter(m => m !== undefined);
};

module.exports = generateMutationQuery;
