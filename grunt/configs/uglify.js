/**
 * Grunt config object
 * Paths  are relative to the Gruntfile.js (in the root)
 */
module.exports = {
    dist: {
        files: {
            './dist/index.min.js': ['./dist/index.js']
        }
    }
};
