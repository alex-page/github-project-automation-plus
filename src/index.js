const core = require('@actions/core');
const github = require('@actions/github');

const getActionData = require('./get-action-data');
const generateProjectQuery = require('./generate-project-query');
const generateMutationQuery = require('./generate-mutation-query');

(async () => {
	try {
		const token = core.getInput('repo-token');
		const project = core.getInput('project');
		const column = core.getInput('column');
		const action = core.getInput('action') || 'update';
		const assignee = core.getInput('assignee');
		
		// Get data from the current action
		const {eventName, nodeId, url, eventAssignee} = getActionData(github.context);

		if (!assignee || assignee === eventAssignee) {

			// Create a method to query GitHub
			const octokit = new github.GitHub(token);

			// Get the column ID from searching for the project and card Id if it exists
			const projectQuery = generateProjectQuery(url, eventName, project);

			core.debug(projectQuery);

			const {resource} = await octokit.graphql(projectQuery);

			core.debug(JSON.stringify(resource));

			// A list of columns that line up with the user entered project and column
			const mutationQueries = generateMutationQuery(resource, project, column, nodeId, action);
			if ((action === 'delete' || action === 'archive') && mutationQueries.length === 0) {
				console.log('✅ There is nothing to do with card');
				return;
			}

			core.debug(mutationQueries.join('\n'));

			// Run the graphql queries
			await Promise.all(mutationQueries.map(query => octokit.graphql(query)));

			if (mutationQueries.length > 1) {
				console.log(`✅ Card materialised into to ${column} in ${mutationQueries.length} projects called ${project}`);
			} else {
				console.log(`✅ Card materialised into ${column} in ${project}`);
			}
		}
		else {
			console.log ("Event assignee did not match action specified event assignee")
		}
	} catch (error) {
		core.setFailed(error.message);
	}
})();
