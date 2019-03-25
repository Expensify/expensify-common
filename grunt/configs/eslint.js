/**
 * Grunt config object
 * Paths  are relative to the Gruntfile.js (in the root)
 */
module.exports = {
    options: {
        format: 'stylish'
    },
    js: {
        src: [
            './lib/**/*.js',
            './lib/**/*.jsx'
        ]
    }
};
