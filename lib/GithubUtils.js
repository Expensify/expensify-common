import _ from 'underscore';

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

    generateVersionComparisonURL() {
        // TODO: fill in with correct function after it's completed by contributor
        return '';
    }

    /**
     * Parse the pull request number from a URL.
     *
     * @param {String} URL
     * @returns {String}
     * @throws {Error} If the URL is not a valid Github Pull Request.
     */
    getPullRequestNumberFromURL(URL) {
        const matches = URL.match(/https:\/\/github\.com\/.*\/.*\/pull\/([0-9]+).*/);
        if (!_.isArray(matches) || matches.length !== 2) {
            throw new Error(`Provided URL ${URL} is not a Github Pull Request!`);
        }

        return matches[1];
    }

    /**
     * Generate the issue body for a StagingDeployCash.
     *
     * @param {String} tag
     * @param {Array} PRList - The list of PR URLs which are included in this StagingDeployCash
     * @param {Array} [verifiedPRList] - The list of PR URLs which have passed QA.
     * @param {Array} [deployBlockers] - The list of DeployBlocker URLs.
     * @param {Array} [resolvedDeployBlockers] - The list of DeployBlockers URLs which have been resolved.
     * @returns {String}
     */
    generateStagingDeployCashBody(
        tag,
        PRList,
        verifiedPRList = [],
        deployBlockers = [],
        resolvedDeployBlockers = []
    ) {
        const sortedPRList = _.sortBy(_.unique(PRList), URL => this.getPullRequestNumberFromURL(URL));
        // TODO: Create utility for getting an issue number
        const sortedDeployBlockers = _.sortBy(_.unique(deployBlockers), URL => this.getPullRequestNumberFromURL(URL));

        // Tag version and comparison URL
        let issueBody = `**Release Version:** ${tag}\r\n`;
        issueBody += `**Compare Changes:** ${this.generateVersionComparisonURL()}\r\n`;

        // PR list
        if (!_.isEmpty(PRList)) {
            issueBody += `**This release contains changes from the following PRs:**\r\n`;
            _.each(sortedPRList, (URL) => {
                issueBody += _.contains(verifiedPRList, URL) ? '- [x]' : '- [ ]';
                issueBody += ` ${URL}\r\n`;
            })
        }

        // Deploy blockers
        if (!_.isEmpty(deployBlockers)) {
            issueBody += '\r\n**Deploy Blockers:**\r\n';
            _.each(sortedDeployBlockers, (URL) => {
                issueBody += _.contains(resolvedDeployBlockers, URL) ? '- [x]' : '- [ ]';
                issueBody += ` ${URL}\r\n`;
            })
        }

        return issueBody;
    }

    /**
     * Creates a new StagingDeployCash issue.
     *
     * @param {String} title
     * @param {String} tag
     * @param {Array} PRList
     * @returns {Promise}
     */
    createNewStagingDeployCash(title, tag, PRList) {
        return this.octokit.issues.create({
            owner: GITHUB_OWNER,
            repo: EXPENSIFY_ISSUE_REPO,
            labels: 'StagingDeployCash',
            assignee: 'applausebot',
            title,
            body: this.generateStagingDeployCashBody(tag, PRList),
        })
    }
}
