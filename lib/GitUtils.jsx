const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

export default class GitUtils {

    /**
     * Takes in two git refs and returns a list of PR numbers of all PRs merged between those two refs
     *
     * @param {String} fromRef
     * @param {String} toRef
     * @returns {Promise}
     */
    getPullRequestsMergedBetween(fromRef, toRef) {
        return new Promise((resolve, reject) => {
            exec(`git log --format="%s" ${fromRef}...${toRef}`)
                .then(({ stdout, stderr }) => {
                    const commitMessages = stdout.split('\n');
                    const pullRequestNumbers = commitMessages
                        .map(commitMessage => this.getPullRequestNumberFromCommitMessage(commitMessage))
                        .filter(prNumber => prNumber != null);
                    resolve(pullRequestNumbers);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Takes in a git commit message and returns pull request number 
     * if it is merge commit or null
     * 
     * @param {String} commitMessage
     * @returns {String}
     */
    getPullRequestNumberFromCommitMessage(commitMessage) {
        const regExp = new RegExp(/Merge pull request #(\d{1,6})/);
        const match = commitMessage.match(regExp);
        if (match == null) {
            return null;
        }
        return match[1];
    }
}
