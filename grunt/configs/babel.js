/**
 * Grunt config object
 * Paths  are relative to the Gruntfile.js (in the root)
 */
module.exports = {
    options: {
        sourceMap: false,
        presets: ['es2015', 'react', 'stage-0'],
        plugins: ['transform-decorators-legacy']
    },
    dist: {
        files: [{
            cwd: './lib/',
            expand: true,
            src: ['**/*.js'],
            dest: './dist/es5'
        }]
    }
};
