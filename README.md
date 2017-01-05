# JavaScript Libraries
This is a collection of JavaScript libraries which are used across multiple repositories.

These libraries are provided as-is, and the repos which use them will need to do their own bundling, minifying, and uglifying.

# Installation

1. Clone this repo to a directory of your choosing
2. Run `npm install` to install all the dependencies
3. Run `npm install grunt-cli -g` to install the Grunt CLI tool globally
4. Send Florent a message on slack and thank him for getting these instructions added

# Deploying a New Version

1. Run `npm run package` to increment the version in `package.json`
1. Create a PR for your branch
2. Once the PR has been merged, get the commit SHA for the merge commit, and update the entry in `package.json` for web-expensify and web-secure to point to that hash

## Versioning
We use `<major>.<minor>.<patch>` versioning scheme.

When choosing a version, keep other open PRs in mind and the order that they might get merged.

# Development
* Write all code as ES6.
* Always lint your code with `npm run build`
* Make sure you're using http://editorconfig.org/

## Testing your code while you are developing
The best way to test your code while you are developing changes is to modify the source files in the `node_modules` directory of the project that includes this lib. When you are done, copy those changes to this repo and commit them.

If you are the PR reviewer and want to test it out, you'll need to modify `package.json` in either web-expensify or web-secure to point to the last commit SHA in the PR.
