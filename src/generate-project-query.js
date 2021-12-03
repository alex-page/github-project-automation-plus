/**
 * GraphQl query to get project and column information
 *
 * @param {string} url - Issue or Pull request url
 * @param {string} payload - The event payload
 * @param {string} project - The project to find
 */
const projectQuery = (url, payload, project) =>
	`query {
		resource( url: "${url}" ) {
			... on ${!payload.pull_request && !payload.issue.pull_request ? 'Issue' : 'PullRequest'} {
				projectCards {
					nodes {
						id
						isArchived
						project {
							name
							id
						}
					}
				}
				repository {
					projects( search: "${project}", first: 10, states: [OPEN] ) {
						nodes {
							name
							id
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
							projects( search: "${project}", first: 10, states: [OPEN] ) {
								nodes {
									name
									id
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

module.exports = projectQuery;
