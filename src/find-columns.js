
/**
 * Get a list of columns that match the project and column input
 *
 * @param {object} data - The graphQl data returned
 * @param {string} project - The user provided project
 * @param {string} column - The user provided column
 */
const filterProjectColumns = (data, project, column) => {
	// All the projects found
	const repoProjects = data.repository.projects.nodes || [];
	const orgProjects = (data.repository.owner &&
		data.repository.owner.projects &&
		data.repository.owner.projects.nodes) ||
		[];

	// Get the column data of projects and columns that match input
	return [...repoProjects, ...orgProjects]
		.filter(project => project.name === project)
		.flatMap(project => project.columns.nodes ?
			project.columns.nodes.filter(projectColumn => projectColumn.name === column) :
			[]
		);
};

module.exports = filterProjectColumns;
