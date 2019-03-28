const eslintConfig = require('./configs/eslint');
const watchConfig = require('./configs/watch');

/**
 * This will load all of the configs in the `./configs` folder and add
 * them to grunt
 *
 * @param  {Grunt} grunt
 * @return {Grunt}
 */
module.exports = (grunt) => {
    grunt.initConfig({
        eslint: eslintConfig,
        watchChokidar: watchConfig
    });
    return grunt;
};
