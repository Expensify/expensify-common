const chokidarConfig = require('./configs/chokidar');
const eslintConfig = require('./configs/eslint');

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
        chokidar: chokidarConfig(grunt)
    });
    return grunt;
};
