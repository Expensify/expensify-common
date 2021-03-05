import {Octokit} from '@octokit/rest';
import GithubUtils from '../lib/GithubUtils';

const issue = {
    url: 'https://api.github.com/repos/Andrew-Test-Org/Public-Test-Repo/issues/29',
    title: 'Andrew Test Issue',
    labels: [
        {
            id: 2783847782,
            node_id: 'MDU6TGFiZWwyNzgzODQ3Nzgy',
            url: 'https://api.github.com/repos/Andrew-Test-Org/Public-Test-Repo/labels/StagingDeployCash',
            name: 'StagingDeployCash',
            color: '6FC269',
            default: false,
            description: ''
        }
    ],
    // eslint-disable-next-line max-len
    body: '**Release Version:** `1.0.1-472`\r\n**Compare Changes:** https://github.com/Expensify/Expensify.cash/compare/1.0.1-400...1.0.1-401\r\n**This release contains changes from the following PRs:**\r\n- [ ] https://github.com/Expensify/Expensify.cash/pull/21\r\n- [ ] https://github.com/Expensify/Expensify.cash/pull/22\r\n- [ ] https://github.com/Expensify/Expensify.cash/pull/23\r\n\r\n**Deploy blockers:**\r\n- [ ] https://github.com/Expensify/Expensify.cash/issues/1',
};

const expectedResponse = {
    PRList: [
        'https://github.com/Expensify/Expensify.cash/pull/21',
        'https://github.com/Expensify/Expensify.cash/pull/22',
        'https://github.com/Expensify/Expensify.cash/pull/23'
    ],
    comparisonURL: 'https://github.com/Expensify/Expensify.cash/compare/1.0.1-400...1.0.1-401',
    labels: [
        {
            color: '6FC269',
            default: false,
            description: '',
            id: 2783847782,
            name: 'StagingDeployCash',
            node_id: 'MDU6TGFiZWwyNzgzODQ3Nzgy',
            url: 'https://api.github.com/repos/Andrew-Test-Org/Public-Test-Repo/labels/StagingDeployCash'
        }
    ],
    tag: '1.0.1-472',
    title: 'Andrew Test Issue',
    url: 'https://api.github.com/repos/Andrew-Test-Org/Public-Test-Repo/issues/29'
};

describe('GithubUtils', () => {
    describe('getStagingDeployCash', () => {
        test('Test finding an open issue successfully', () => {
            const octokit = new Octokit();
            const github = new GithubUtils(octokit);
            octokit.issues.listForRepo = jest.fn().mockResolvedValue({data: [issue]});
            return github.getStagingDeployCash().then(data => expect(data).toStrictEqual(expectedResponse));
        });

        test('Test finding an open issue without a body', () => {
            const octokit = new Octokit();
            const github = new GithubUtils(octokit);

            const noBodyIssue = issue;
            noBodyIssue.body = '';

            octokit.issues.listForRepo = jest.fn().mockResolvedValue({data: [noBodyIssue]});
            return github.getStagingDeployCash()
                .catch(e => expect(e).toEqual(new Error('Unable to find StagingDeployCash issue with correct data.')));
        });

        test('Test finding more than one issue', () => {
            const octokit = new Octokit();
            const github = new GithubUtils(octokit);
            octokit.issues.listForRepo = jest.fn().mockResolvedValue({data: [{a: 1}, {b: 2}]});
            return github.getStagingDeployCash()
                .catch(e => expect(e).toEqual(new Error('Found more than one StagingDeployCash issue.')));
        });

        test('Test finding no issues', () => {
            const octokit = new Octokit();
            const github = new GithubUtils(octokit);
            octokit.issues.listForRepo = jest.fn().mockResolvedValue({data: []});
            return github.getStagingDeployCash()
                .catch(e => expect(e).toEqual(new Error('Unable to find StagingDeployCash issue.')));
        });
    });

    describe('generateVersionComparisonURL', () => {
        const REPO_SLUG = 'test-owner/test-repo';
        const MOCK_TAGS = [{name: '2.2.2'},{name: '2.2.1'},{name: '2.1.0-1'},{name: '2.1.0'},{name: '2.0.0-1'},{name: '2.0.0'},{name: '1.2.2-2'},{name: '1.2.2-1'},{name: '1.2.2'},{name: '1.2.1'},{name: '1.2.0'},{name: '1.1.0'},{name: '1.0.4'},{name: '1.0.3'},{name: '1.0.2'},{name: '1.0.1'},{name: '1.0.0'},{name: '0.0.1'}];

        const mockGithub = jest.fn(() => ({
            getOctokit: () => ({
                repos: {
                    listTags: jest.fn().mockResolvedValue({data: MOCK_TAGS}),
                },
            }),
        }));

        const octokit = mockGithub().getOctokit();
        const githubUtils = new GithubUtils(octokit);

        describe('MAJOR comparison', () => {
            test('should return a comparison url between 2.2.2 and 1.2.2', () => {
                return githubUtils
                    .generateVersionComparisonURL(REPO_SLUG, '2.2.2', 'MAJOR').then((url) =>
                        expect(url).toBe('https://github.com/Expensify/Expensify.cash/compare/1.2.2...2.2.2')
                    );

            });

            test('should return a comparison url between 1.2.0 and 0.0.1', () => {
                return githubUtils
                    .generateVersionComparisonURL(REPO_SLUG, '1.2.0', 'MAJOR').then((url) =>
                        expect(url).toBe('https://github.com/Expensify/Expensify.cash/compare/0.0.1...1.2.0')
                    );
            });
        });

        describe('MINOR comparison', () => {
            test('should return a comparison url between 2.2.2 and 2.1.0', () => {
                return githubUtils
                    .generateVersionComparisonURL(REPO_SLUG, '2.2.2', 'MINOR').then((url) =>
                        expect(url).toBe('https://github.com/Expensify/Expensify.cash/compare/2.1.0...2.2.2')
                    );
            });

            test('should return a comparison url between 1.1.0 and 1.0.4', () => {
                return githubUtils
                    .generateVersionComparisonURL(REPO_SLUG, '1.1.0', 'MINOR').then((url) =>
                        expect(url).toBe('https://github.com/Expensify/Expensify.cash/compare/1.0.4...1.1.0')
                    );
            });
        });

        describe('PATCH comparison', () => {
            test('should return a comparison url between 2.2.2 and 2.2.1', () => {
                return githubUtils
                    .generateVersionComparisonURL(REPO_SLUG, '2.2.2', 'PATCH').then((url) =>
                        expect(url).toBe('https://github.com/Expensify/Expensify.cash/compare/2.2.1...2.2.2')
                    );
            });

            test('should return a comparison url between 1.0.0 and 0.0.1', () => {
                return githubUtils
                    .generateVersionComparisonURL(REPO_SLUG, '1.0.0', 'PATCH').then((url) =>
                        expect(url).toBe('https://github.com/Expensify/Expensify.cash/compare/0.0.1...1.0.0')
                    );
            });
        });

        describe('BUILD comparison', () => {
            test('should return a comparison url between 2.1.0-1 and 2.1.0', () => {
                return githubUtils
                    .generateVersionComparisonURL(REPO_SLUG, '2.1.0-1', 'BUILD').then((url) =>
                        expect(url).toBe('https://github.com/Expensify/Expensify.cash/compare/2.1.0...2.1.0-1')
                    );
            });

            test('should return a comparison url between 1.2.2-2 and 1.2.2', () => {
                return githubUtils
                    .generateVersionComparisonURL(REPO_SLUG, '1.2.2-2', 'BUILD').then((url) =>
                        expect(url).toBe('https://github.com/Expensify/Expensify.cash/compare/1.2.2...1.2.2-2')
                    );
            });
        });
    });
});
