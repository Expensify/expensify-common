# `expensify-common`
This is a collection of JS libraries and components which are used across various Expensify projects. These libraries are provided as-is, and the repos which use them will need to do their own bundling, minifying, and uglifying.

# Installation
1. Clone this repo to a directory of your choosing
2. Run `npm install` to install all the dependencies

# Deploying a Change
1. Create a PR for your branch
2. Push up your changes
3. Once the PR has been merged the changes will be deployed the next time the package is published

# Publishing a Change
Follow the instructions [here]().
`@todo` link to internal SO document...

# Development
* Write all code as ES6.
* Always lint your code with `npm run grunt watch`
* Make sure you're using http://editorconfig.org/

## Testing your code while you are developing
The best way to test your code while you are developing changes is via `npm link`.

1. Run `npm link` in the project root
1. `cd` into the project directory that has a dependency on `expensify-common`
1. Run `npm link expensify-common`

Alternatively, you can edit files directly in a project's `node_modules` then apply those changes to this repository.
