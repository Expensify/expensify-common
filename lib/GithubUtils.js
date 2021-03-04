const core = require('@actions/core');
const semverParse = require('semver/functions/parse');
const semverSatisfies = require('semver/functions/satisfies');

export const GITHUB_OWNER = 'Expensify';
export const EXPENSIFY_ISSUE_REPO = 'Expensify';
export const EXPENSIFY_CASH_REPO = 'Expensify.cash';

const EXPENSIFY_CASH_URL = 'https://github.com/Expensify/Expensify.cash';

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

            // eslint-disable-next-line max-len
            const compareURLRegex = new RegExp(`${EXPENSIFY_CASH_URL}/compare/${versionRegex.source}...${versionRegex.source}`, 'g');
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

    /**
     * Generate a comparison URL between two versions following the semverLevel passed
     *
     * @param {String} repoSlug - The slug of the repository: <owner>/<repository_name>
     * @param {String} tag - The tag to compare first the previous semverLevel
     * @param {String} semverLevel - The semantic versioning MAJOR, MINOR, PATCH and BUILD
     * @return {Promise} the url generated
     */
    generateVersionComparisonURL(repoSlug, tag, semverLevel) {
        return new Promise((resolve, reject) => {
            const getComparisonURL = (previousTag, currentTag) => (
                `${EXPENSIFY_CASH_URL}/compare/${previousTag}...${currentTag}`
            );

            const [repoOwner, repoName] = repoSlug.split('/');
            const tagSemver = semverParse(tag);

            return this.octokit.repos.listTags({
                owner: repoOwner,
                repo: repoName,
            })
                .then(githubResponse => githubResponse.data.some(({name: repoTag}) => {
                    if (semverLevel === 'MAJOR'
                        && semverSatisfies(repoTag, `<${tagSemver.major}.x.x`)
                    ) {
                        resolve(getComparisonURL(repoTag, tagSemver));
                        return true;
                    }

                    if (semverLevel === 'MINOR'
                        && semverSatisfies(repoTag, `<${tagSemver.major}.${tagSemver.minor}.x`)
                    ) {
                        resolve(getComparisonURL(repoTag, tagSemver));
                        return true;
                    }

                    if (semverLevel === 'PATCH'
                        && semverSatisfies(repoTag, `<${tagSemver}`)
                    ) {
                        resolve(getComparisonURL(repoTag, tagSemver));
                        return true;
                    }

                    if (semverLevel === 'BUILD'
                        && semverSatisfies(repoTag, `<=${tagSemver.major}.${tagSemver.minor}.${tagSemver.patch}`)
                    ) {
                        resolve(getComparisonURL(repoTag, tagSemver));
                        return true;
                    }
                    return false;
                }))
                .catch(githubError => reject(core.setFailed(githubError)));
        });
    }
}
