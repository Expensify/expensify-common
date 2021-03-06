module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 68:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __nccwpck_require__) => {

const GitUtils = __nccwpck_require__(37);

// Then hard-code your test usages here and console.log the results
const fromRef = '9254b614399175a6a85745a99a6fb5bb9789915d';
const toRef = '07bc78b5932dd94e2576227d5dc89b6017877186';
const gitUtils = new GitUtils()
gitUtils.getPullRequestsMergedBetween(fromRef, toRef)
    .then(pullRequestNumbers => console.log(pullRequestNumbers))
    .catch(err => console.log(err));


/***/ }),

/***/ 37:
/***/ ((module) => {

module.exports = eval("require")("./lib/GitUtils");


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
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(68);
/******/ })()
;