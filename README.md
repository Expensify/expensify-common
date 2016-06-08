# JavaScript Libraries
This is a collection of JavaScript libraries which are used across multiple repositories.

These libraries are provided as-is, and the repos which use them will need to do their own bundling, minifying, and uglifying.

# Installation

1. Clone this repo to a directory of your choosing
2. Run `npm install` to install all the dependencies
3. Run `npm install grunt-cli -g` to install the Grunt CLI tool globally
4. Send Florent a message on slack and thank him for getting these instructions added

# Deploying a New Version

```
npm run package
```

This will:

1. Increment the version in `package.json`
1. Create a tag on the branch and commit the version change

Then you need to create a PR. Be sure to push the tags with your branch when you publish it. Example: `git push origin --tags`

## Versioning
We use semantic versioning which you can read about at http://semver.org/.

# Development
* Write all code as ES6.
* Always lint your code with `npm run build`
* Make sure you're using http://editorconfig.org/

## Testing your code while you are developing
The best way to test your code while you are developing changes is to modify the source files in the `node_modules` directory of the project that includes this lib. When you are done, copy those changes to this repo and commit them.
