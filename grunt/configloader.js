const eslintConfig = require('./configs/eslint');
const uglifyConfig = require('./configs/uglify');
const browserifyConfig = require('./configs/browserify');

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
        uglify: uglifyConfig,
        browserify: browserifyConfig
    });
    return grunt;
};
