export default class GithubUtils {
    /**
     * @param {Octokit} octokit - Authenticated Octokit object https://octokit.github.io/rest.js
     */
    constructor(octokit) {
        this.octokit = octokit;
    }

    /**
     * Finds one open `StagingDeployCash` issue via GitHub octokit library
     * @returns {Promise}
     */
    getStagingDeployCash() {
        return this.octokit.issues.listForRepo({
            owner: 'Expensify',
            repo: 'Expensify',
            labels: 'StagingDeployCash',
            state: 'open'
        })
            .then(({data}) => {
                if (!data.length) {
                    throw new Error('Unable to find StagingDeployCash issue.');
                }

                if (data.length > 1) {
                    throw new Error('Found more than one StagingDeployCash issue.');
                }

                const issue = data[0];
                return {title: issue.title, url: issue.url, labels: issue.labels};
            });
    }
}
