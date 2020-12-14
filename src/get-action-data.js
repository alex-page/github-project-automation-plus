/**
 * Fetch the relevant data from GitHub
 *
 * @param {object} githubContext - The current issue or pull request data
 */
const getActionData = githubContext => {
	const {eventName, payload} = githubContext;
	if (eventName !== 'pull_request' && eventName !== 'pull_request_target' && eventName !== 'issues' && eventName !== 'issue_comment') {
		throw new Error(`Only pull requests, issues or comments allowed, received:\n${eventName}`);
	}

	const githubData = eventName === 'issues' || eventName === 'issue_comment' ?
		payload.issue :
		payload.pull_request;

	return {
		eventName,
		action: payload.action,
		nodeId: githubData.node_id,
		url: githubData.html_url
	};
};

module.exports = getActionData;
