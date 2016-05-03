# JavaScript Libraries
This is a collection of JavaScript libraries which are used across multiple repositories.

These libraries are provided as-is, and the repos which use them will need to do their own bundling, minifying, and uglifying.

# Package a New Version

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
