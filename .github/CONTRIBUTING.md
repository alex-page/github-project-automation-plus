# Contributing

## Local development

To set up the action for local development and testing:

1. Create a fork of the github-project-automation-plus
2. Create a new repository with a project
3. Add a workflow file that changes the `uses` to your forked repository: `uses: my-fork/github-project-automation-plus@main`
3. Make changes to your action and deploy them to GitHub

## Release a new version

1. Run `yarn build`
2. Push the changes to the `main` branch
3. Create a [new release](https://github.com/alex-page/github-project-automation-plus/releases/new)
