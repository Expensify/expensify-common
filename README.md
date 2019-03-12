# JavaScript Libraries
This is a collection of JavaScript libraries which are used across multiple repositories.

These libraries are provided as-is, and the repos which use them will need to do their own bundling, minifying, and uglifying.

# Installation

1. Clone this repo to a directory of your choosing
2. Run `npm install` to install all the dependencies
3. Run `npm install grunt-cli -g` to install the Grunt CLI tool globally
4. Send Florent a message on slack and thank him for getting these instructions added

# Deploying a Change

1. Create a PR for your branch
2. Push up your changes
3. Once the PR has been merged, get newest commit SHA for `master` from [here](https://github.com/Expensify/JS-Libs/commits/master), and update the entry in `package.json` for Web-Expensify and Web-Secure to point to that hash, and run `npm update js-libs && npm install`.

# Development
* Write all code as ES6.
* Always lint your code with `npm run build`
* Make sure you're using http://editorconfig.org/

## Testing your code while you are developing
The best way to test your code while you are developing changes is to modify the source files in the `node_modules` directory of the project that includes this lib. When you are done, copy those changes to this repo and commit them.

If you are the PR reviewer and want to test it out, you'll need to modify `package.json` in either web-expensify or web-secure to point to the last commit SHA in the PR.

Once your JS-Libs PR is merged, you'll have to run `npm update js-libs && npm install` in Web-Expensify and Web-Secure to get the new version to install (`npm i` won't pull the latest update)
