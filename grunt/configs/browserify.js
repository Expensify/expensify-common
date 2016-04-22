module.exports = {
    dist: {
        options: {
            transform: [
                ['babelify', {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: ['transform-decorators-legacy']
                }]
            ]
        },
        files: {
            './dist/index.js': ['./index.js']
        }
    }
};
