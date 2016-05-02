/**
 * This file registers a task with grunt
 * @param  {Grunt} grunt
 * @return {Grunt}
 */
module.exports = function (grunt) {
    grunt.task.registerTask('travis', ['eslint']);
    return grunt;
};
