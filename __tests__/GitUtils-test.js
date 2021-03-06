import GitUtils from '../lib/GitUtils';

describe('GitUtils', () => {
    describe('getPullRequestNumberFromCommitMessage', () => {
        test('Test matching PR number from commit message', () => {
            const gitUtils = new GitUtils();
            const pullRequestNumber = gitUtils.getPullRequestNumberFromCommitMessage("Merge pull request #337 from Expensify/francoisUpdateQbdSyncManager");
            expect(pullRequestNumber).toStrictEqual('337');
        });

        test('Test non-matching PR number from commit message', () => {
            const gitUtils = new GitUtils();
            const pullRequestNumber = gitUtils.getPullRequestNumberFromCommitMessage("Update QBD Sync Manager version");
            expect(pullRequestNumber).toBeNull();
        });
    });
});
