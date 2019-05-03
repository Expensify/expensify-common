/**
 * Grunt config object
 * Paths are relative to the Gruntfile.js (in the root)
 */
module.exports = function (grunt) {
    // On watch events, we want to configure the tasks to only process
    // the files that have changed
    grunt.event.on('chokidar', function (action, filepath, target) {
        grunt.config('eslint.js.src', filepath);
    });

    return {
        files: ['**/*.js', '**/*.jsx'],
        tasks: ['eslint'],
        options: {
            spawn: false,
        }
    };
};
