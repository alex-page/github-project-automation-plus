const test = require('ava');

const generateMutationQuery = require('../src/generate-mutation-query');

const project = 'Backlog';
const column = 'To do';
const nodeId = 'MDU6SXNzdWU1ODc4NzU1Mjk=';

const moveData = {
	projectCards: {
		nodes: [
			{
				id: 'MDExOlByb2plY3RDYXJkMzUxNzI2MjM=',
				project: {
					name: project,
					id: 'MDc6UHJvamVjdDQwNzU5MDI='
				}
			}
		]
	},
	repository: {
		projects: {
			nodes: [
				{
					id: 'MDc6UHJvamVjdDQwNzU5MDI=',
					name: project,
					columns: {
						nodes: [
							{
								id: 'MDEzOlByb2plY3RDb2x1bW44NDU0MzQ6',
								name: 'Icebox'
							},
							{
								id: 'MDEzOlByb2plY3RDb2x1bW44NDU0MzQ5',
								name: column
							}
						]
					}
				}
			]
		},
		owner: {
			projects: {
				nodes: []
			}
		}
	}
};

test('generateMutationQuery move the card when in the correct project and wrong column', t => {
	t.deepEqual(generateMutationQuery(moveData, project, column, nodeId), [
		`mutation {
				moveProjectCard( input: {
					cardId: "MDExOlByb2plY3RDYXJkMzUxNzI2MjM=",
					columnId: "MDEzOlByb2plY3RDb2x1bW44NDU0MzQ5"
			}) { clientMutationId } }`
	]);
});

test('generateMutationQuery delete the card when it is in the project already', t => {
	t.deepEqual(generateMutationQuery(moveData, project, column, nodeId, true), [
		`mutation {
					deleteProjectCard( input: {
						cardId: "MDExOlByb2plY3RDYXJkMzUxNzI2MjM="
				}) { clientMutationId } }`
	]);
});

const addData = {
	projectCards: {
		nodes: []
	},
	repository: {
		projects: {
			nodes: [
				{
					name: project,
					id: 'MDc6UHJvamVjdDQwNzU5MDI=',
					columns: {
						nodes: [
							{
								id: 'MDEzOlByb2plY3RDb2x1bW44NDU0MzQ5',
								name: column
							},
							{
								id: 'MDEzOlByb2plY3RDb2x1bW44MjUxOTAz',
								name: 'In progress'
							}
						]
					}
				}
			]
		},
		owner: {
			projects: {
				nodes: []
			}
		}
	}
};

test('generateMutationQuery add the card when the card does not exist in the project', t => {
	t.deepEqual(generateMutationQuery(addData, project, column, nodeId), [
		`mutation {
				addProjectCard( input: {
					contentId: "MDU6SXNzdWU1ODc4NzU1Mjk=",
					projectColumnId: "MDEzOlByb2plY3RDb2x1bW44NDU0MzQ5"
			}) { clientMutationId } }`
	]);
});

test('generateMutationQuery skip issue deletion when the card does not exist in the project', t => {
	t.deepEqual(generateMutationQuery(addData, project, column, nodeId, true), []);
});

const dataNoColumn = {
	projectCards: {
		nodes: []
	},
	repository: {
		projects: {
			nodes: [
				{
					id: 'MDc6UHJvamVjdDQwNzU5MDI=',
					name: project,
					columns: {
						nodes: [
							{
								id: 'MDEzOlByb2plY3RDb2x1bW44NDU0MzQ5',
								name: 'No project column'
							}
						]
					}
				}
			]
		},
		owner: {
			projects: {
				nodes: []
			}
		}
	}
};

test('generateMutationQuery should fail if it cannot find a matching column', t => {
	const error = t.throws(() => generateMutationQuery(dataNoColumn, project, column, nodeId));

	t.is(error.message, `Could not find the column "${column}" or project "${project}"`);
});

const dataNoProject = {
	projectCards: {
		nodes: []
	},
	repository: {
		projects: {
			nodes: [
				{
					id: 'MDc6UHJvamVjdDQwNzU5MDI=',
					name: 'No project name',
					columns: {
						nodes: [
							{
								id: 'MDEzOlByb2plY3RDb2x1bW44NDU0MzQ5',
								name: column
							}
						]
					}
				}
			]
		},
		owner: {
			projects: {
				nodes: []
			}
		}
	}
};

test('generateMutationQuery should fail if it cannot find a matching project', t => {
	const error = t.throws(() => generateMutationQuery(dataNoProject, project, column, nodeId));

	t.is(error.message, `Could not find the column "${column}" or project "${project}"`);
});
