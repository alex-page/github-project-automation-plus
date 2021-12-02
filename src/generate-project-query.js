/**
 * GraphQl query to get project and column information
 *
 * @param {string} url - Issue or Pull request url
 * @param {string} is_pr - Whether the event is a Pull Request (false if it's an Issue)
 * @param {string} project - The project to find
 */
const projectQuery = (url, is_pr, project) =>
	`query {
		resource( url: "${url}" ) {
			... on ${!is_pr ? 'Issue' : 'PullRequest'} {
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
