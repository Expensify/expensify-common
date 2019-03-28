/**
 * Grunt config object
 * Paths are relative to the Gruntfile.js (in the root)
 */
module.exports = {
    scripts: {
        files: ['**/*.js', '**/*.jsx'],
        tasks: ['eslint'],
        options: {
            spawn: false,
        }
    }
};
