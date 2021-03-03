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
    isDeployedToProduction: true,
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

describe('GithubUtils.getStagingDeployCash', () => {
    test('Test finding an open issue successfully', () => {
        const octokit = new Octokit();
        const github = new GithubUtils(octokit);
        octokit.issues.listForRepo = jest.fn().mockResolvedValue({data: [issue]});
        octokit.git.getRef = jest.fn().mockResolvedValue({data: []});
        return github.getStagingDeployCash().then(data => expect(data).toStrictEqual(expectedResponse));
    });

    test('Test finding an open issue successfully not released', () => {
        const octokit = new Octokit();
        const github = new GithubUtils(octokit);
        octokit.issues.listForRepo = jest.fn().mockResolvedValue({data: [issue]});
        octokit.git.getRef = jest.fn().mockRejectedValue(new Error());

        const notReleasedExpectedResponse = expectedResponse;
        notReleasedExpectedResponse.isDeployedToProduction = false;
        return github.getStagingDeployCash().then(data => expect(data).toStrictEqual(notReleasedExpectedResponse));
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

    // test('Test finding an issue', () => {
    //     const octokit = new Octokit({
    //         auth: process.env.GITHUB_TOKEN
    //     });
    //     const github = new GithubUtils(octokit);
    //     return github.getStagingDeployCash().then(data => expect(data).toStrictEqual(expectedResponse));
    // });
});
