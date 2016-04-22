const gruntTaskLoader = require('load-grunt-tasks');
const eslintConfig = require('./grunt/configs/eslint');
const babelConfig = require('./grunt/configs/babel');

module.exports = function (grunt) {
    // Load all the grunt task plugin
    gruntTaskLoader(grunt);

    // Specify our grunt config
    grunt.initConfig({
        eslint: eslintConfig,

        babel: babelConfig
    });
};
