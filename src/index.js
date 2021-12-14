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

		// Get data from the current action
		const {eventName, nodeId, url} = getActionData(github.context);

		// Create a method to query GitHub
		const octokit = new github.GitHub(token);

		// Get the column ID from searching for the project and card Id if it exists
		const projectQuery = generateProjectQuery(url, eventName, project);

		core.debug(projectQuery);

		const {resource} = await octokit.graphql(projectQuery);

		core.debug(JSON.stringify(resource));

		// Error if no project specified and issue belongs to no projects
		if (!project && resource.projectCards.nodes.length === 0) {
			throw new Error('The issue belongs to no projects and no project has been specified');
		}

		// If no project was specified, attempt action on all projects the issue is part of
		const projectList = project ? [project] : resource.projectCards.nodes.map(card => card.project.name);

		var mutationQueries = []
		var validProjectList = []
		for (proj of projectList) {
			try {
				// A list of columns that line up with the user entered project and column
				const queries = generateMutationQuery(resource, proj, column, nodeId, action);
				if ((action === 'delete' || action === 'archive' || action === 'add') && queries.length === 0) {
					console.log(`✅ There is nothing to do with card in project ${proj}`);
				}
				mutationQueries.push(...queries);
				validProjectList.push(proj);
			} catch (error) {
				console.log(error.message);
			}
		}

		core.debug(mutationQueries.join('\n'));

		// Run the graphql queries
		await Promise.all(mutationQueries.map(query => octokit.graphql(query)));

		if (mutationQueries.length) {
			console.log(`✅ Card materialised into ${column} in ${mutationQueries.length} project(s): ${validProjectList.join(', ')}`);
		}
	} catch (error) {
		core.setFailed(error.message);
	}
})();
