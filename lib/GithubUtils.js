export const GithubOwner = 'Expensify';
export const ExpensifyIssueRepo = 'Expensify';
export const ExpensifyCashRepo = 'Expensify.cash';

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
            owner: GithubOwner,
            repo: ExpensifyIssueRepo,
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
        const versionRegex = /`([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9]*))?`/g;
        const tag = issue.body.match(versionRegex)[0].replace(/`/g, '');

        // eslint-disable-next-line max-len
        const compareURLRegex = /https:\/\/github\.com\/Expensify\/Expensify.cash\/compare\/([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9]*))?...([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9]*))?/g;
        const comparisonURL = issue.body.match(compareURLRegex)[0];

        const PRListRegex = /https:\/\/github\.com\/Expensify\/Expensify.cash\/pull\/([0-9]+)/g;
        const PRList = issue.body.match(PRListRegex);

        const data = {
            title: issue.title, url: issue.url, labels: issue.labels, tag, comparisonURL, PRList
        };

        return this.octokit.git.getRef({
            owner: GithubOwner,
            repo: ExpensifyCashRepo,
            ref: `tags/${tag}`,
        }).then(() => ({
            // If we are able to find a tag, octokit does not throw
            ...data,
            isDeployedToProduction: true
        })).catch(() => ({
            // If we are unable to find the tag, octokit throws a 404
            ...data,
            isDeployedToProduction: false
        }));
    }
}
