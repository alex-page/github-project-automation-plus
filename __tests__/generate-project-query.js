const test = require('ava');

const generateProjectQuery = require('../src/generate-project-query');

const issueQuery = `query {
		resource( url: "https://github.com/alex-page/test-actions/issues/52" ) {
			... on Issue {
				projectCards {
					nodes {
						id
						column {
							id
						}
						project {
							name
						}
					}
				}
				repository {
					projects( search: "Backlog", first: 10, states: [OPEN] ) {
						nodes {
							name
							columns( first: 100 ) {
								nodes {
									id
									name
								}
							}
						}
					}
					owner {
						... on ProjectOwner {
							projects( search: "Backlog", first: 10, states: [OPEN] ) {
								nodes {
									name
									columns( first: 100 ) {
										nodes {
											id
											name
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}`;

const pullrequestQuery = `query {
		resource( url: "https://github.com/alex-page/test-actions/pulls/1" ) {
			... on PullRequest {
				projectCards {
					nodes {
						id
						column {
							id
						}
						project {
							name
						}
					}
				}
				repository {
					projects( search: "Backlogg", first: 10, states: [OPEN] ) {
						nodes {
							name
							columns( first: 100 ) {
								nodes {
									id
									name
								}
							}
						}
					}
					owner {
						... on ProjectOwner {
							projects( search: "Backlogg", first: 10, states: [OPEN] ) {
								nodes {
									name
									columns( first: 100 ) {
										nodes {
											id
											name
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}`;

test('generateProjectQuery should create a query for issues', t => {
	const url = 'https://github.com/alex-page/test-actions/issues/52';
	const eventName = 'issues';
	const project = 'Backlog';

	t.is(generateProjectQuery(url, eventName, project), issueQuery);
});

test('generateProjectQuery should create a query for pull requests', t => {
	const url = 'https://github.com/alex-page/test-actions/pulls/1';
	const eventName = 'pull_request';
	const project = 'Backlogg';

	t.is(generateProjectQuery(url, eventName, project), pullrequestQuery);
});
