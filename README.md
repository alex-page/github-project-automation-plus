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
      - uses: alex-page/github-project-automation-plus@v0.2.3
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
      - uses: alex-page/github-project-automation-plus@v0.2.3
        with:
          project: Backlog
          column: To do
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

## Workflow options

Change these options in the workflow `.yml` file to meet your GitHub project needs.

| Setting | Description | Values |
| --- | --- | --- |
| `on` | When the automation is ran | `issues` `pull_request` |
| `types` | The types of activity that will trigger a workflow run. | `opened`, `assigned` |
| `project` | The name of the project | `Backlog` |
| `column` | The column to create or move the card to | `Triage` |
| `repo-token` | The personal access token | `${{ secrets.GITHUB_TOKEN }}` |

## Personal access token (secrets.GITHUB_TOKEN)

Depending on your project set up you may be able to use [`GITHUB_TOKEN`](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) which requires no set up. This is only possible when the project and repository are owned by your account.

For forked and private repositories this error occurs:

```shell
GraphqlError: Resource not accessible by integration
```

This error happens on forked repositories because [`GITHUB_TOKEN` only has read permissions](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#permissions-for-the-github_token). On private repositories you may be lacking admin permissions in the repository or project.

When this happens you will need to:
1. Create a [personal access token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line). See the below guide on how to [configure the permissions](#Permissions-for-personal-access-tokens).
2. [Create a secret](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets) containing the personal access token, call it `GH_TOKEN`
3. Change the `repo-token` in the workflow `.yml`  to reference your new token name:
```yaml
repo-token: ${{ secrets.GH_TOKEN }}
```

### Permissions for personal access tokens

| Repo and project board | Permission |
| --- | --- |
| Public repository and project board | [`GITHUB_TOKEN`](https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token) |
| Private repository and project board | `Full control of private repositories` |
| Organisation public or private project board and repository | `Read and write org and team membership, read and write org projects` |

## Troubleshooting

**SAML enforcement**

With certain organisations there may be SAML enforcement. This means you will need to `Enable SSO` when you create the personal access token.
```
GraphqlError: Resource protected by organization SAML enforcement. You must grant your personal token access to this organization
```

**Can't read repository null**

Make sure your permissions for your personal access token are correctly configured. Follow the above [guide on permissions](#Permissions-for-personal-access-tokens).


## Local development

To set up the action for local development and testing:

1. Create a fork of the github-project-automation-plus
2. Create a new repository with a project
3. Add a workflow file that changes the `uses` to your forked repository: `uses: my-fork/github-project-automation-plus@master`
3. Make changes to your action and deploy them to GitHub


## Release History

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
