/**
 * This file registers a task with grunt
 * @param  {Grunt} grunt
 * @return {Grunt}
 */
const packageJson = require('../../package.json');
const version = packageJson.version;
module.exports = function (grunt) {
    grunt.task.registerTask('package', () => {
        grunt.config.set('version', version);
        grunt.task.run(['eslint', 'browserify', 'uglify']);
    });
    return grunt;
};
