# GitHub Project Automation+

> 🤖 Automate GitHub Project cards with any webhook event

This action allows you to use any of the [pull_request](https://help.github.com/en/articles/events-that-trigger-workflows#pull-request-event-pull_request) and [issue](https://help.github.com/en/articles/events-that-trigger-workflows#issues-event-issues) webhook events to automate your project cards. For example when an `issue` is `opened` create a card in the Backlog project, Triage column.

If the `pull_request` or `issue` card already exists it will be moved to the column provided. Otherwise the card will be created in the column.


## Usage

Create a [project](https://help.github.com/en/articles/about-project-boards) with columns in your repository, user profile or organisation.

Create a new workflow `.yml` file in the `.github/workflows/` directory. In the `.yml`file you have to decide what webhook events going move or create a card in a column. For more detailed explanation of the workflow file, check out the [GitHub documentation](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file). See the examples below to get started quickly.


### .github/workflows/opened-issues-triage.yml

Move opened issues into the Triage column of the Backlog project

```yml
name: Move new issues into Triage

on:
  issues:
    types: [opened]

jobs:
  automate-project-columns:
    runs-on: ubuntu-latest
    steps:
      - uses: alex-page/github-project-automation-plus@v0.7.1
        with:
          project: Backlog
          column: Triage
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

### .github/workflows/assigned-pulls-todo.yml

Add assigned pull requests into the To Do column of the Backlog project

```yml
name: Move assigned pull requests into To do

on:
  pull_request:
    types: [assigned]

jobs:
  automate-project-columns:
    runs-on: ubuntu-latest
    steps:
      - uses: alex-page/github-project-automation-plus@v0.7.1
        with:
          project: Backlog
          column: To do
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

## Workflow options

Change these options in the workflow `.yml` file to meet your GitHub project needs.

| Inputs | Description | Values |
| --- | --- | --- |
| `on` | When the automation is ran | `issues` `pull_request` `issue_comment` `pull_request_target` `pull_request_review` |
| `types` | The types of activity that will trigger a workflow run. | `opened`, `assigned`, `edited`: [See GitHub docs](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request) for more |
| `project` | The name of the project | `Backlog` |
| `column` | The column to create or move the card to | `Triage` |
| `repo-token` | The personal access token | `${{ secrets.GITHUB_TOKEN }}` |
| `action` | This determines the type of the action to be performed on the card, Default: `update` | `update`, `delete`, `archive` |
| `assignee` | This will only cause the workflow to execute on issues/PRs where the assignee matches the specified workflow input assignee. Be sure to configure your `on` workflow kickoff to `types:[assigned]`. Default: None | `GitHub Username`

## Personal access token

Most of the time [`GITHUB_TOKEN`](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) will work as your `repo-token`. This requires no set up. If you have a public project board and public repository this is the option for you.

**Private repository or organisation projects**

You will need a personal access token to send events from your issues and pull requests.

1. Create a personal access token
    1. [Private repository or private project](https://github.com/settings/tokens/new?scopes=repo&description=GHPROJECT_TOKEN)
    1. [Organisation project board or organisation repository](https://github.com/settings/tokens/new?scopes=repo,write:org&description=GHPROJECT_TOKEN)

1. [Add a secret](https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository) `GHPROJECT_TOKEN` with the personal access token.
1. Update the `repo-token` in the workflow `.yml`  to reference your new token name:
```yaml
repo-token: ${{ secrets.GHPROJECT_TOKEN }}
```

## Troubleshooting

**GraphqlError: Resource not accessible by integration** and **Secrets are not currently available to forks.** This error happens on forked repositories because [`GITHUB_TOKEN` only has read permissions](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#permissions-for-the-github_token).

**SAML enforcement**

With certain organisations there may be SAML enforcement. This means you will need to `Enable SSO` when you create the personal access token.
```
GraphqlError: Resource protected by organization SAML enforcement. You must grant your personal token access to this organization
```

**Can't read repository null**

Make sure your permissions for your personal access token are correctly configured. Follow the above [guide on permissions](#permissions-for-personal-access-tokens).

**Private repositories**

You may need to enable policy settings to allow running workflows from forks. Please refer to GitHub's documentation to learn about enabling these settings at [enterprise](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-enterprise-account/enforcing-github-actions-policies-in-your-enterprise-account#enabling-workflows-for-private-repository-forks), [organization](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/disabling-or-limiting-github-actions-for-your-organization?algolia-query=private+repositor#enabling-workflows-for-private-repository-forks), or [repository](https://docs.github.com/en/free-pro-team@latest/github/administering-a-repository/disabling-or-limiting-github-actions-for-a-repository#enabling-workflows-for-private-repository-forks) level.


## Release History

- v0.7.1 - Move Node.js version back to v12
- v0.7.0 - Update documentation and dependencies
- v0.6.0 - Add support for `pull_request_target` and `pull_request_review` 
- v0.5.1 - Fix get event data from issue_coment
- v0.5.0 - Add option to `delete` card
- v0.4.0 - Add `issue_comment` event
- v0.3.0 - Add `pull_request_target` event
- v0.2.4 - Update dependencies
- v0.2.3 - Replace reserved secret `GITHUB_TOKEN` with `GITHUB_TOKEN` in documentation
- v0.2.2 - Refactor add and move card logic ✨
- v0.2.1 - Fix bug with move logic when card is already in project
- v0.2.0 - Restructure project, add tests, change add and move logic
- v0.1.3 - Exact match for project names
- v0.1.2 - Fix action not running for a card that exists in multiple projects
- v0.1.1 - Document type filter so action runs once
- v0.1.0 - Add support for user projects
- v0.0.3 - Automatic build before commit
- v0.0.2 - Error handling using GitHub actions
- v0.0.1 - Update icon and color for GitHub actions
- v0.0.0 - Initial release
