# `expensify-common`
This is a collection of JS libraries and components which are used across various Expensify projects. These libraries are provided as-is, and the repos which use them will need to do their own bundling, minifying, and uglifying.

# Installation
1. Clone this repo to a directory of your choosing
2. Run `npm install` to install all the dependencies

# Development
* Write all code as ES6.
* Always lint your code with `npm run grunt watch`
* Make sure you're using http://editorconfig.org/

## Testing your code while you are developing
The best way to test your code while you are developing changes is via `npm link`

1. Run `npm link` in the project root
1. `cd` into the project directory that has a dependency on `expensify-common`
1. Run `npm link expensify-common`

Alternatively, you can edit files directly in a project's `node_modules` then apply those changes to this repository.

# Proposing a Change (Non-Expensify Contributors)
1. Fork this repository and create a new branch
1. Open a PR to merge your changes
1. An Expensify engineer will be automatically assigned to your PR
1. They will review and accept your changes, merge them, then deploy a new version

# Deploying a Change (Expensify Only)
1. Create a new branch from master and run `npm run patch`
2. Push up the changes, create a PR, and get it reviewed and merged
3. Publish a new version by following the instructions [here](https://stackoverflow.com/c/expensify/questions/7216)
