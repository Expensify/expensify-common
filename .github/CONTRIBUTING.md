# Pull Requests

Pull requests are at the core of our process. They help us maintain quality, share knowledge, detect bugs/regression and experiment.

We are using this set of rules while creating pull requests.

## Title
The title needs to explain the changes being made.
Things like "fix bug on policy" aren't descriptive enough.
"Prevent double binding on the add user button" is better.

### Title tags
We use a set of tags to change the meaning of the PR. Tags are prefixed to the PR title.

- ```[HOLD]``` means that the PR should not be merged, but can be reviewed.
- ```[HOLD 1234]``` means that the PR should not be merged until PR 1234 has been merged.
- ```[HOLD 26 March]``` means that the PR can be merged on the date provided.
- ```[HOLD Auth]``` means that the PR can be merged after a specific Auth PR has been deployed.
- ```[WIP]``` means Work In Progress is the PR open to show progress, help work, and should not be considered as production ready code ( aka review can be done around algorithm, logic and style/comments/name can be ignored ).
- ```[BLOCK]``` Code that we want to save, but is not accurate anymore.
- ```{=> branch}``` for PR not being merged to master.

## Tagging / assiging
1 or multiple engineers can be called on reviewing the code and anybody can "jump in" and ask questions or push back.

When assigning someone to a PR, please mention them on the first line of the description and by assigning the pull request to one.

## Description
The pull request description needs to be informative without being fluffy.

1 line containing who is tagged for review.

Then a block of explanation (if necessary). If something fishy is going on, it is the place to explain it, or the choice you made.

Then the list of tickets being fixed by the PR, one per line, all prefixed by "Fixed". This allow github to automatically close the tickets. Tickets linked like should have the label "Reviewing" apply to them.

Then the list of tests.  There are two types of tests that should be listed:

##### 1. Development Tests
 - These include the tests that the engineer performed on the PR to validate that their change worked and that the mainline cases for the area of code touched continues to work.  For example: A PR to ensure we "handle if a user account is deleted" should have tests that confirm that the proper error message is shown when the account is deleted, but also a few tests that show that the code continues to work even if there are no deleted accounts (the "mainline" case).

##### 2. QA Tests
 - These include reproducible steps that the QA team can do manually or program to happen automatically to validate the above development tests, when appropriate.



## Merging
The last reviewer agreeing with the code and satisfied with the tests performed should merge the code and then delete the branch.

If you are not the last one reviewing, clearly indicate that you have no further push back. The "ship it" or "thumbs up" emojis are acceptable.

## Commenting
Pull request can spend a long time in the review process. For large piece of code it is appreciated if the reviewer clearly indicates when he or she is done reviewing.
Keeping comments straight to the point is also very frequent: it saves time to type and to read.
Try to keep the comments on the line that will be modified so they "diseapear" when the code is fixed.
The creator of the pull request can decide to not fix some comments, but he or she needs to clearly indicate their intentions.


## Updating
Every time you are pushing code that is requiring a new review, you need to add a comment in the pull request. discussion thread. The comment needs to be clear, such as "code update", "please review again".
If you are not doing that, your pull request is not going be reviewed again and might be closed.

## Bumping
Pull request can be bumped in both direction: from the reviewer to the creator, but also from the creator to the reviewer.
Bumping should not happen in less than 2 working days, as people are busy and have different workflow.
If you need a quicker review, please indicate it or ping people by email or chat.

## Committing
See <http://chris.beams.io/posts/git-commit/> for more details.

#### 1. Commit often, perfect later
- Commit often to make sure you don't lose your changes.
- If you realize your commit messages are not good, you can change them or squash your commits together later using `git rebase -i {revisionNumber}`.
- Once your commits look clean, push your changes.

#### 2. What is a good commit message?
- The subject should be clear and concise
- If the commit needs more explanation, do it in the body, separated from the subject with a blank line

**Examples of bad commit messages:**

... Found from our git tree ...

- "English is hard", "Who let mike code?!", "Fuck WAF validation", "shit comments"
- "stop using this", "dolla dolla bills yall", "use isset, who knows why"
- "copypasta", "Whoops", "eek", "anything", "DRY", "USER_ID_CEO"
- "Cache null", "Resort a use", "Forgot a piar of parens", "fix my mindFart", "hack around all Gets"
- "Move some things around", "Small refactoring", "everything worked", "removed more stuff"
- Multiple "Fix travis" commits in a row

**Examples of good commit messages:**

... Not found from our git tree ...

- If the fix can easily be explained in one sentence:
```
Transform NVPs into distinct mysql tables, so it's easier to query
```

- If the fix needs more explanation:

```
Fix bug with megaedit asking to discard our changes 

When closing megaedit dialog, the user was prompted if he wanted to discard his change, even if he didn't make any change.
This was caused by ...
I fixed it by ...

[Fixes #12345]
```

#### 3. What is a clean git history?
- Commit with clear messages.
- Keep only useful commits when submitting a PR: the reviewer doesn't need to know that you changed your mind, or that you messed up at some point and then fixed your mistakes.
- As long as the review hasn't started, always try to rebase rather than merging, so you don't pollute your git history with unnecessary merge commits.

A good example of a clean commit history is:

```
* Added the models and forms for potatoes.
* Added the API for interacting with potatoes, along with unit tests.
* Added the comment dialog for reviewing potatoes.
```

An example of an unclean commit history is:

```
* Added the models and forms for potatoes.
* Decided the is_spud field wasn't necessary and removed it.
* Forgot forms.py.
* Added the API for interacting with potatoes, along with unit tests.
* Merged my own remote branch to my local branch
* One of the tests failed, fixed it.
* Added the comment dialog for reviewing potatoes.
* Fixed a typo.
* Another typo.
```

More details on how to keep a clean git history [here](https://www.reviewboard.org/docs/codebase/dev/git/clean-commits/).

## Force Pushing
The main rules are:
- **Never force push if you don't exactly know what you are doing**. If you accidentally force push on someone else's branch, it will cause major headaches while we get things restored. Note that we have restricted master, staging and production from being force pushed to.
- **Don’t piss off the reviewer**.
- Try to make **clean commits** with **clean git history**.

Concretely:

##### 1. When you work with someone else on the same branch
- **Never force push** because it would be very hard and painful for your coworker to pull the updated branch while keeping his local commits.
- When pulling the remote branch into your local branch, use `git pull --rebase origin branch` so it doesn’t pollute the history with some unnecessary merge commits. You can do `git config --global pull.rebase true` so it is the default behavior and so you just need to do `git pull origin branch`.

##### 2. When you work alone on your own branch and no review has started
- **It’s ok to force push**
- You should rebase master instead of merging, so that it doesn’t pollute your history.
- Your commit messages should be clean, so it’s easy for the reviewer to know what’s going on. If you pushed many messy commits, please consider using [rebase interactive](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History) (`git rebase -i`) to clean, squash or rename them.

##### 3. When a review has already started
- A review is considered as `started` once the PR has been assigned to a reviewer and is not WIP.
- The main rule here is: **don’t change the history on commits that have already been reviewed** so that it doesn’t mess up with the review history.
- You should merge master instead of rebasing it if there is a conflict.
- Create new commits, don’t amend them to the previous ones that have already been reviewed.

