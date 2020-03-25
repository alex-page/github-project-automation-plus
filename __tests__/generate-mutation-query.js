const test = require('ava');

const generateMutationQuery = require('../src/generate-mutation-query');

const project = 'Backlog';
const column = 'To do';
const nodeId = 'MDU6SXNzdWU1ODc4NzU1Mjk=';
const data = {
	projectCards: {
		nodes: [
			{
				id: 'MDExOlByb2plY3RDYXJkMzUxNzI2MjM=',
				column: {
					id: 'MDEzOlByb2plY3RDb2x1bW44MjUxODk4'
				},
				project: {
					name: project
				}
			},
			{
				id: 'MDExOlByb2plY3RDYXJkMzUxNzI2Mj2=',
				column: {
					id: 'MDEzOlByb2plY3RDb2x1bW44NDU0MzQ5'
				},
				project: {
					name: 'Backlogg'
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
								id: 'MDEzOlByb2plY3RDb2x1bW44NDU0MzQ5',
								name: column
							},
							{
								id: 'MDEzOlByb2plY3RDb2x1bW44NDU0MzQ6',
								name: 'To doo'
							}
						]
					}
				},
				{
					id: 'MDc6UHJvamVjdDQwNzU5MDE=',
					name: 'Backlogg',
					columns: {
						nodes: [
							{
								id: 'MDEzOlByb2plY3RDb2x1bW44MjUxODk7',
								name: 'To do'
							}
						]
					}
				}
			]
		},
		owner: {
			projects: {
				nodes: [
					{
						id: 'MDc6UHJvamVjdDQwNzU5MDI=',
						name: project,
						columns: {
							nodes: [
								{
									id: 'MDEzOlByb2plY3RDb2x1bW44NDU0MzQ8',
									name: column
								},
								{
									id: 'MDEzOlByb2plY3RDb2x1bW44NDU0MzQ9',
									name: 'In progress'
								}
							]
						}
					},
					{
						id: 'MDc6UHJvamVjdDQwNzU5MDE=',
						name: 'Backlogg',
						columns: {
							nodes: [
								{
									id: 'MDEzOlByb2plY3RDb2x1bW44MjUxOD10',
									name: 'To do'
								}
							]
						}
					}
				]
			}
		}
	}
};

test('findColumns should return column Ids for exact matches', t => {
	t.deepEqual(generateMutationQuery(data, project, column, nodeId), [
		`mutation {
			addProjectCard( input: {
				contentId: "MDU6SXNzdWU1ODc4NzU1Mjk=",
				projectColumnId: "MDEzOlByb2plY3RDb2x1bW44NDU0MzQ5"
		}) { clientMutationId } }`,
		`mutation {
			addProjectCard( input: {
				contentId: "MDU6SXNzdWU1ODc4NzU1Mjk=",
				projectColumnId: "MDEzOlByb2plY3RDb2x1bW44NDU0MzQ8"
		}) { clientMutationId } }`,
		`mutation {
			moveProjectCard( input: {
				cardId: "MDExOlByb2plY3RDYXJkMzUxNzI2MjM=",
				columnId: "MDEzOlByb2plY3RDb2x1bW44MjUxODk4"
		}) { clientMutationId } }`
	]);
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

test('findColumns should fail if it cannot find a matching column', t => {
	const error = t.throws(() => generateMutationQuery(dataNoColumn, project, column, nodeId));

	t.is(error.message, 'Could not find the column "To do" in project "Backlog"');
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

test('findColumns should fail if it cannot find a matching project', t => {
	const error = t.throws(() => generateMutationQuery(dataNoProject, project, column, nodeId));

	t.is(error.message, 'Could not find the project "Backlog"');
});
