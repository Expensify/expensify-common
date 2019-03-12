const exec = require('child_process').execSync;

/**
 * A series of commands to execute when the watchChokidar task runs
 * 
 * @param {Object} grunt
 */
module.exports = (grunt) => {
    grunt.registerTask('link', 'Links Web-Expensify and Web-Secure to global JS-Libs', () => {
        grunt.log.writeln('Linking JS-Libs to global node_modules...');
        const result = exec('npm link');
        grunt.log.writeln(result);
        grunt.log.writeln('Linking Web-Expensify with global node_modules...');
        const webe = exec('cd ../Web-Expensify && npm link js-libs');
        grunt.log.writeln(webe);
        grunt.log.writeln('Linking Web-Expensify with global node_modules...');
        const webs = exec('cd ../Web-Secure && npm link js-libs');
        grunt.log.writeln(webs);
    });
};
