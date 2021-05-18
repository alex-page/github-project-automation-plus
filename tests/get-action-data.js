const test = require('ava');

const getActionData = require('../src/get-action-data');

/* eslint-disable camelcase */
const mockGithubContext = {
	payload: {
		action: 'opened',
		issue: {
			assignee: null,
			assignees: [{
				avatar_url: 'https://avatars1.githubusercontent.com/u/19199063?v=4',
				events_url: 'https://api.github.com/users/alex-page/events{/privacy}',
				followers_url: 'https://api.github.com/users/alex-page/followers',
				following_url: 'https://api.github.com/users/alex-page/following{/other_user}',
				gists_url: 'https://api.github.com/users/alex-page/gists{/gist_id}',
				gravatar_id: '',
				html_url: 'https://github.com/alex-page',
				id: 19199063,
				login: 'alex-page',
				node_id: 'MDQ6VXNlcjE5MTk5MDYz',
				organizations_url: 'https://api.github.com/users/alex-page/orgs',
				received_events_url: 'https://api.github.com/users/alex-page/received_events',
				repos_url: 'https://api.github.com/users/alex-page/repos',
				site_admin: false,
				starred_url: 'https://api.github.com/users/alex-page/starred{/owner}{/repo}',
				subscriptions_url: 'https://api.github.com/users/alex-page/subscriptions',
				type: 'User',
				url: 'https://api.github.com/users/alex-page'
			}],
			author_association: 'OWNER',
			body: '',
			closed_at: null,
			comments: 0,
			comments_url: 'https://api.github.com/repos/alex-page/test-actions/issues/52/comments',
			created_at: '2020-03-25T17:45:13Z',
			events_url: 'https://api.github.com/repos/alex-page/test-actions/issues/52/events',
			html_url: 'https://github.com/alex-page/test-actions/issues/52',
			id: 587875529,
			labels: [],
			labels_url: 'https://api.github.com/repos/alex-page/test-actions/issues/52/labels{/name}',
			locked: false,
			milestone: null,
			node_id: 'MDU6SXNzdWU1ODc4NzU1Mjk=',
			number: 52,
			repository_url: 'https://api.github.com/repos/alex-page/test-actions',
			state: 'open',
			title: '52',
			updated_at: '2020-03-25T17:45:13Z',
			url: 'https://api.github.com/repos/alex-page/test-actions/issues/52',
			user: {
				avatar_url: 'https://avatars1.githubusercontent.com/u/19199063?v=4',
				events_url: 'https://api.github.com/users/alex-page/events{/privacy}',
				followers_url: 'https://api.github.com/users/alex-page/followers',
				following_url: 'https://api.github.com/users/alex-page/following{/other_user}',
				gists_url: 'https://api.github.com/users/alex-page/gists{/gist_id}',
				gravatar_id: '',
				html_url: 'https://github.com/alex-page',
				id: 19199063,
				login: 'alex-page',
				node_id: 'MDQ6VXNlcjE5MTk5MDYz',
				organizations_url: 'https://api.github.com/users/alex-page/orgs',
				received_events_url: 'https://api.github.com/users/alex-page/received_events',
				repos_url: 'https://api.github.com/users/alex-page/repos',
				site_admin: false,
				starred_url: 'https://api.github.com/users/alex-page/starred{/owner}{/repo}',
				subscriptions_url: 'https://api.github.com/users/alex-page/subscriptions',
				type: 'User',
				url: 'https://api.github.com/users/alex-page'
			}
		},
		repository: {
			archive_url: 'https://api.github.com/repos/alex-page/test-actions/{archive_format}{/ref}',
			archived: false,
			assignees_url: 'https://api.github.com/repos/alex-page/test-actions/assignees{/user}',
			blobs_url: 'https://api.github.com/repos/alex-page/test-actions/git/blobs{/sha}',
			branches_url: 'https://api.github.com/repos/alex-page/test-actions/branches{/branch}',
			clone_url: 'https://github.com/alex-page/test-actions.git',
			collaborators_url: 'https://api.github.com/repos/alex-page/test-actions/collaborators{/collaborator}',
			comments_url: 'https://api.github.com/repos/alex-page/test-actions/comments{/number}',
			commits_url: 'https://api.github.com/repos/alex-page/test-actions/commits{/sha}',
			compare_url: 'https://api.github.com/repos/alex-page/test-actions/compare/{base}...{head}',
			contents_url: 'https://api.github.com/repos/alex-page/test-actions/contents/{+path}',
			contributors_url: 'https://api.github.com/repos/alex-page/test-actions/contributors',
			created_at: '2020-03-08T00:03:14Z',
			default_branch: 'main',
			deployments_url: 'https://api.github.com/repos/alex-page/test-actions/deployments',
			description: 'Repo to test actions',
			disabled: false,
			downloads_url: 'https://api.github.com/repos/alex-page/test-actions/downloads',
			events_url: 'https://api.github.com/repos/alex-page/test-actions/events',
			fork: false,
			forks: 0,
			forks_count: 0,
			forks_url: 'https://api.github.com/repos/alex-page/test-actions/forks',
			full_name: 'alex-page/test-actions',
			git_commits_url: 'https://api.github.com/repos/alex-page/test-actions/git/commits{/sha}',
			git_refs_url: 'https://api.github.com/repos/alex-page/test-actions/git/refs{/sha}',
			git_tags_url: 'https://api.github.com/repos/alex-page/test-actions/git/tags{/sha}',
			git_url: 'git://github.com/alex-page/test-actions.git',
			has_downloads: true,
			has_issues: true,
			has_pages: false,
			has_projects: true,
			has_wiki: true,
			homepage: null,
			hooks_url: 'https://api.github.com/repos/alex-page/test-actions/hooks',
			html_url: 'https://github.com/alex-page/test-actions',
			id: 245724936,
			issue_comment_url: 'https://api.github.com/repos/alex-page/test-actions/	issues/comments{/number}',
			issue_events_url: 'https://api.github.com/repos/alex-page/test-actions/issues/events{/number}',
			issues_url: 'https://api.github.com/repos/alex-page/test-actions/issues{/number}',
			keys_url: 'https://api.github.com/repos/alex-page/test-actions/keys{/key_id}',
			labels_url: 'https://api.github.com/repos/alex-page/test-actions/labels{/name}',
			language: null,
			languages_url: 'https://api.github.com/repos/alex-page/test-actions/languages',
			license: null,
			merges_url: 'https://api.github.com/repos/alex-page/test-actions/merges',
			milestones_url: 'https://api.github.com/repos/alex-page/test-actions/milestones{/number}',
			mirror_url: null,
			name: 'test-actions',
			node_id: 'MDEwOlJlcG9zaXRvcnkyNDU3MjQ5MzY=',
			notifications_url: 'https://api.github.com/repos/alex-page/test-actions/notifications{?since,all,participating}',
			open_issues: 12,
			open_issues_count: 12,
			owner: {
				avatar_url: 'https://avatars1.githubusercontent.com/u/19199063?v=4',
				events_url: 'https://api.github.com/users/alex-page/events{/privacy}',
				followers_url: 'https://api.github.com/users/alex-page/followers',
				following_url: 'https://api.github.com/users/alex-page/following{/other_user}',
				gists_url: 'https://api.github.com/users/alex-page/gists{/gist_id}',
				gravatar_id: '',
				html_url: 'https://github.com/alex-page',
				id: 19199063,
				login: 'alex-page',
				node_id: 'MDQ6VXNlcjE5MTk5MDYz',
				organizations_url: 'https://api.github.com/users/alex-page/orgs',
				received_events_url: 'https://api.github.com/users/alex-page/received_events',
				repos_url: 'https://api.github.com/users/alex-page/repos',
				site_admin: false,
				starred_url: 'https://api.github.com/users/alex-page/starred{/owner}{/repo}',
				subscriptions_url: 'https://api.github.com/users/alex-page/subscriptions',
				type: 'User',
				url: 'https://api.github.com/users/alex-page'
			},
			private: false,
			pulls_url: 'https://api.github.com/repos/alex-page/test-actions/pulls{/number}',
			pushed_at: '2020-03-25T14:52:00Z',
			releases_url: 'https://api.github.com/repos/alex-page/test-actions/releases{/id}',
			size: 18,
			ssh_url: 'git@github.com:alex-page/test-actions.git',
			stargazers_count: 0,
			stargazers_url: 'https://api.github.com/repos/alex-page/test-actions/stargazers',
			statuses_url: 'https://api.github.com/repos/alex-page/test-actions/statuses/{sha}',
			subscribers_url: 'https://api.github.com/repos/alex-page/test-actions/subscribers',
			subscription_url: 'https://api.github.com/repos/alex-page/test-actions/subscription',
			svn_url: 'https://github.com/alex-page/test-actions',
			tags_url: 'https://api.github.com/repos/alex-page/test-actions/tags',
			teams_url: 'https://api.github.com/repos/alex-page/test-actions/teams',
			trees_url: 'https://api.github.com/repos/alex-page/test-actions/git/trees{/sha}',
			updated_at: '2020-03-25T14:52:02Z',
			url: 'https://api.github.com/repos/alex-page/test-actions',
			watchers: 0,
			watchers_count: 0
		},
		sender: {
			avatar_url: 'https://avatars1.githubusercontent.com/u/19199063?v=4',
			events_url: 'https://api.github.com/users/alex-page/events{/privacy}',
			followers_url: 'https://api.github.com/users/alex-page/followers',
			following_url: 'https://api.github.com/users/alex-page/following{/other_user}',
			gists_url: 'https://api.github.com/users/alex-page/gists{/gist_id}',
			gravatar_id: '',
			html_url: 'https://github.com/alex-page',
			id: 19199063,
			login: 'alex-page',
			node_id: 'MDQ6VXNlcjE5MTk5MDYz',
			organizations_url: 'https://api.github.com/users/alex-page/orgs',
			received_events_url: 'https://api.github.com/users/alex-page/received_events',
			repos_url: 'https://api.github.com/users/alex-page/repos',
			site_admin: false,
			starred_url: 'https://api.github.com/users/alex-page/starred{/owner}{/repo}',
			subscriptions_url: 'https://api.github.com/users/alex-page/subscriptions',
			type: 'User',
			url: 'https://api.github.com/users/alex-page'
		}
	},
	eventName: 'issues',
	sha: '526d81e24203000f49d90eb530707b141ae64c89',
	ref: 'refs/heads/main',
	workflow: 'Move new issues into "Triage"',
	action: 'alex-pagegithub-project-automation-plus',
	actor: 'alex-page'
};

/* eslint-enable camelcase */
test('getActionData should return a formatted object from issue', t => {
	t.deepEqual(getActionData(mockGithubContext), {
		action: 'opened',
		eventName: 'issues',
		nodeId: 'MDU6SXNzdWU1ODc4NzU1Mjk=',
		url: 'https://github.com/alex-page/test-actions/issues/52',
		eventAssignees: [{
			avatar_url: 'https://avatars1.githubusercontent.com/u/19199063?v=4',
			events_url: 'https://api.github.com/users/alex-page/events{/privacy}',
			followers_url: 'https://api.github.com/users/alex-page/followers',
			following_url: 'https://api.github.com/users/alex-page/following{/other_user}',
			gists_url: 'https://api.github.com/users/alex-page/gists{/gist_id}',
			gravatar_id: '',
			html_url: 'https://github.com/alex-page',
			id: 19199063,
			login: 'alex-page',
			node_id: 'MDQ6VXNlcjE5MTk5MDYz',
			organizations_url: 'https://api.github.com/users/alex-page/orgs',
			received_events_url: 'https://api.github.com/users/alex-page/received_events',
			repos_url: 'https://api.github.com/users/alex-page/repos',
			site_admin: false,
			starred_url: 'https://api.github.com/users/alex-page/starred{/owner}{/repo}',
			subscriptions_url: 'https://api.github.com/users/alex-page/subscriptions',
			type: 'User',
			url: 'https://api.github.com/users/alex-page'
		}]
	});
});

test('getActionData should return a formatted object from comment', t => {
	/* eslint-disable camelcase */
	const context = {
		eventName: 'issue_comment',
		payload: {
			action: 'created',
			issue: {
				node_id: 'MDFooBar45',
				html_url: 'https://github.com/alex-page/test-actions/issues/52',
				assignees: [{
					avatar_url: 'https://avatars1.githubusercontent.com/u/19199063?v=4',
					events_url: 'https://api.github.com/users/alex-page/events{/privacy}',
					followers_url: 'https://api.github.com/users/alex-page/followers',
					following_url: 'https://api.github.com/users/alex-page/following{/other_user}',
					gists_url: 'https://api.github.com/users/alex-page/gists{/gist_id}',
					gravatar_id: '',
					html_url: 'https://github.com/alex-page',
					id: 19199063,
					login: 'alex-page',
					node_id: 'MDQ6VXNlcjE5MTk5MDYz',
					organizations_url: 'https://api.github.com/users/alex-page/orgs',
					received_events_url: 'https://api.github.com/users/alex-page/received_events',
					repos_url: 'https://api.github.com/users/alex-page/repos',
					site_admin: false,
					starred_url: 'https://api.github.com/users/alex-page/starred{/owner}{/repo}',
					subscriptions_url: 'https://api.github.com/users/alex-page/subscriptions',
					type: 'User',
					url: 'https://api.github.com/users/alex-page'
				}]
			}
		}
	};

	/* eslint-enable camelcase */
	t.deepEqual(getActionData(context), {
		action: 'created',
		eventName: 'issue_comment',
		nodeId: 'MDFooBar45',
		url: 'https://github.com/alex-page/test-actions/issues/52',
		eventAssignees: [{
			avatar_url: 'https://avatars1.githubusercontent.com/u/19199063?v=4',
			events_url: 'https://api.github.com/users/alex-page/events{/privacy}',
			followers_url: 'https://api.github.com/users/alex-page/followers',
			following_url: 'https://api.github.com/users/alex-page/following{/other_user}',
			gists_url: 'https://api.github.com/users/alex-page/gists{/gist_id}',
			gravatar_id: '',
			html_url: 'https://github.com/alex-page',
			id: 19199063,
			login: 'alex-page',
			node_id: 'MDQ6VXNlcjE5MTk5MDYz',
			organizations_url: 'https://api.github.com/users/alex-page/orgs',
			received_events_url: 'https://api.github.com/users/alex-page/received_events',
			repos_url: 'https://api.github.com/users/alex-page/repos',
			site_admin: false,
			starred_url: 'https://api.github.com/users/alex-page/starred{/owner}{/repo}',
			subscriptions_url: 'https://api.github.com/users/alex-page/subscriptions',
			type: 'User',
			url: 'https://api.github.com/users/alex-page'
		}]
	});
});

test('getActionData should fail when eventName is not covered by action', t => {
	const failingMockGithubContext = Object.assign({}, mockGithubContext);
	const eventName = 'label';
	failingMockGithubContext.eventName = eventName;

	const error = t.throws(() => getActionData(failingMockGithubContext));

	t.is(error.message, `Only pull requests, reviews, issues, or comments allowed. Received:\n${eventName}`);
});
