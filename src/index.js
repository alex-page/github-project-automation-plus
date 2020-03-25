const core = require('@actions/core');
const github = require('@actions/github');

const getActionData = require('./get-action-data');
const projectQuery = require('./project-query');
const findColumns = require('./find-columns');
const generateMutationQueries = require('./generate-mutation-queries');

(async () => {
	try {
		const token = core.getInput('repo-token');
		const project = core.getInput('project');
		const column = core.getInput('column');

		// Get data from the current action
		console.log(JSON.stringify(github.context));
		const {eventName, action, nodeId, url} = getActionData(github.context);

		// // Create a method to query GitHub
		// const octokit = new github.GitHub(token);

		// // Get the column ID from searching for the project and card Id if it exists
		// const {resource} = await octokit.graphql(projectQuery(url, eventName, project));

		// // A list of columns that line up with the user entered project and column
		// const columns = findColumns(resource);

		// if (columns.length === 0) {
		// 	throw new Error(`Could not find the column "${column}" in project "${project}"`);
		// }

		// const mutationQueries = generateMutationQueries(columns, nodeId);

		// console.log(mutationQueries);

		// Check if the issue alread has a project associated to it
		// const projectCards = resource.projectCards.nodes.filter(card => card.project.name === project);

		console.log(`✅ ${action === 'opened' ? 'Added' : 'Moved'} card to ${column} in ${project}`);
	} catch (error) {
		core.setFailed(error.message);
	}
})();
