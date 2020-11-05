# JavaScript Libraries
This is a collection of JavaScript libraries which are used across multiple repositories.

These libraries are provided as-is, and the repos which use them will need to do their own bundling, minifying, and uglifying.

# Installation
1. Clone this repo to a directory of your choosing
2. Run `npm install` to install all the dependencies
4. Send Florent a message on slack and thank him for getting these instructions added

# Deploying a Change
1. Create a PR for your branch
2. Push up your changes
3. Once the PR has been merged, get newest commit SHA for `master` from [here](https://github.com/Expensify/JS-Libs/commits/master), and update the entry in `package.json` for Web-Expensify, Web-Secure, Mobile-Expensify, and ReactNativeChat to point to that hash, and run `npm update js-libs && npm install`. Even if your change is only required in one repo, it is important to update `package.json` in all repos to prevent somebody from deploying changes they don't know about.

# Development
* Write all code as ES6.
* Always lint your code with `npm run grunt watch`
* Make sure you're using http://editorconfig.org/

## Testing your code while you are developing
The best way to test your code while you are developing changes is to link this directory to your local copies of the Web-Expensify and Web-Secure repositories.
`npm run grunt link` and `npm run grunt unlink` are your friends to automatically do so. 
