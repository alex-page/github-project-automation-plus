/**
 * Create the GraphQl mutation queries
 *
 * @param {array} columns - Array of found columns
 * @param {string} nodeId - The nodeId of the pull request or issue
 */
const generateMutationQueries = (columns, nodeId) => {
	return {columns, nodeId};
};

module.exports = generateMutationQueries;
