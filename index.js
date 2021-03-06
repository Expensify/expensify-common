module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 582:
/***/ ((__unused_webpack_module, __webpack_exports__, __nccwpck_require__) => {

// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./lib/GitUtils.jsx
const { promisify } = __nccwpck_require__(669);
const exec = promisify(__nccwpck_require__(129).exec);

class GitUtils {

    /**
     * Takes in two git refs and returns a list of PR numbers of all PRs merged between those two refs
     *
     * @param {String} fromRef
     * @param {String} toRef
     * @returns {Promise}
     */
    getPullRequestsMergedBetween(fromRef, toRef) {
        return new Promise((resolve, reject) => {
            exec(`git log --format="%s" ${fromRef}...${toRef}`)
                .then(({ stdout, stderr }) => {
                    const commitMessages = stdout.split('\n');
                    const pullRequestNumbers = commitMessages
                        .map(commitMessage => this.getPullRequestNumberFromCommitMessage(commitMessage))
                        .filter(prNumber => prNumber != null);
                    resolve(pullRequestNumbers);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Takes in a git commit message and returns pull request number 
     * if it is merge commit or null
     * 
     * @param {String} commitMessage
     * @returns {String}
     */
    getPullRequestNumberFromCommitMessage(commitMessage) {
        const regExp = new RegExp(/Merge pull request #(\d{1,6})/);
        const match = commitMessage.match(regExp);
        if (match == null) {
            return null;
        }
        return match[1];
    }
}

// CONCATENATED MODULE: ./myScript.js


// Then hard-code your test usages here and console.log the results
const fromRef = '9254b614399175a6a85745a99a6fb5bb9789915d';
const toRef = '07bc78b5932dd94e2576227d5dc89b6017877186';
const gitUtils = new GitUtils()
gitUtils.getPullRequestsMergedBetween(fromRef, toRef)
    .then(pullRequestNumbers => console.log(pullRequestNumbers))
    .catch(err => console.log(err));


/***/ }),

/***/ 129:
/***/ ((module) => {

module.exports = require("child_process");;

/***/ }),

/***/ 669:
/***/ ((module) => {

module.exports = require("util");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(582);
/******/ })()
;