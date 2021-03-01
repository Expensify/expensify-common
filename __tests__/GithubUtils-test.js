import {Octokit} from '@octokit/rest';
import GithubUtils from '../lib/GithubUtils';

const expectedResponse = {
    title: 'Andrew Test Issue',
    url: 'https://api.github.com/repos/Andrew-Test-Org/Public-Test-Repo/issues/29',
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
};

describe('GithubUtils.getStagingDeployCash', () => {
    test('Test finding an open issue successfully', () => {
        const octokit = new Octokit();
        const github = new GithubUtils(octokit);
        octokit.issues.listForRepo = jest.fn().mockResolvedValue({data: [expectedResponse]});
        return github.getStagingDeployCash().then(data => expect(data).toStrictEqual(expectedResponse));
    });

    test('Test finding more than one issue', () => {
        const octokit = new Octokit();
        const github = new GithubUtils(octokit);
        octokit.issues.listForRepo = jest.fn().mockResolvedValue({data: [{a: 1}, {b: 2}]});
        return github.getStagingDeployCash().catch(e =>
            expect(e).toEqual(new Error('Found more than one StagingDeployCash issue.')));
    });

    test('Test finding no issues', () => {
        const octokit = new Octokit();
        const github = new GithubUtils(octokit);
        octokit.issues.listForRepo = jest.fn().mockResolvedValue({data: []});
        return github.getStagingDeployCash().catch(e =>
            expect(e).toEqual(new Error('Unable to find StagingDeployCash issue.')));
    });
});
