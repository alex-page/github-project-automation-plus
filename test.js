const test = require('ava');

const getActionData = require('./src/get-action-data');
const projectQuery = require('./src/project-query');
const findColumns = require('./src/find-columns');
const generateMutationQueries = require('./src/generate-mutation-queries');

test('getActionData should return a formatted object', t => {
	const mockGithubContext = {};
	t.is(getActionData(mockGithubContext), {});
});
