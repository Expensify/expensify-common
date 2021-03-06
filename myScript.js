import GitUtils from './lib/GitUtils.jsx';

// Then hard-code your test usages here and console.log the results
const fromRef = '9254b614399175a6a85745a99a6fb5bb9789915d';
const toRef = '07bc78b5932dd94e2576227d5dc89b6017877186';
const gitUtils = new GitUtils()
gitUtils.getPullRequestsMergedBetween(fromRef, toRef)
    .then(pullRequestNumbers => console.log(pullRequestNumbers))
    .catch(err => console.log(err));
