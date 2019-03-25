const glob = require('glob');

/**
 * Load all of our files from the task folder and have them register with grunt
 * @param  {Grunt}   grunt
 */
module.exports = function (grunt) {
    // This path is relative from Gruntfile.js
    const files = glob.sync('./grunt/task/*');

    if (!files || !files.length) {
        grunt.fail.warn('no tasks found');
        return;
    }

    for (let i = 0; i < files.length; i++) {
        grunt.verbose.writeln(`Loading task file: ${files[i]}`);

        // Disable this lint rule so that we can have our debug output before requiring the file.
        /* eslint-disable vars-on-top */
        // This path is relative to this file, so we have to remove the grunt part
        const task = require(files[i].replace('/grunt', ''));
        /* eslint-enable vars-on-top */

        task(grunt);
    }
};
