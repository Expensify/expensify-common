export const GITHUB_OWNER = 'Expensify';
export const EXPENSIFY_ISSUE_REPO = 'Expensify';
export const EXPENSIFY_CASH_REPO = 'Expensify.cash';

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
            owner: GITHUB_OWNER,
            repo: EXPENSIFY_ISSUE_REPO,
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

                return this.getStagingDeployCashData(data[0]);
            });
    }

    /**
     * Takes in a GitHub issue object and returns the data we want
     *
     * @param {Object} issue
     * @returns {Promise}
     */
    getStagingDeployCashData(issue) {
        try {
            const versionRegex = new RegExp('([0-9]+).([0-9]+).([0-9]+)(?:-([0-9]+))?', 'g');
            const tag = issue.body.match(versionRegex)[0].replace(/`/g, '');

            const expensifyCashURL = 'https://github.com/Expensify/Expensify.cash';
            // eslint-disable-next-line max-len
            const compareURLRegex = new RegExp(`${expensifyCashURL}/compare/${versionRegex.source}...${versionRegex.source}`, 'g');
            const comparisonURL = issue.body.match(compareURLRegex)[0];

            const PRListRegex = new RegExp(`${expensifyCashURL}/pull/([0-9]+)`, 'g');
            const PRList = issue.body.match(PRListRegex);

            return {
                title: issue.title, url: issue.url, labels: issue.labels, tag, comparisonURL, PRList
            };
        } catch (exception) {
            throw new Error('Unable to find StagingDeployCash issue with correct data.');
        }
    }
}
