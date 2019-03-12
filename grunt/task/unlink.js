const exec = require('child_process').execSync;

/**
 * Removes symlinks and restores Web-Expensify and Web-Secure node_modules back to their default JS-Libs version
 *
 * @param {Object} grunt
 */
module.exports = (grunt) => {
    grunt.registerTask('unlink', 'Unlinks Web-Expensify and Web-Secure repos from global JS-Libs', () => {
        grunt.log.writeln('Unlinking Web-E and Web-S from global JS-Libs');
        grunt.log.writeln('Unlinking Web-Secure...');
        let result = exec('cd ../Web-Secure && npm uninstall --no-save js-libs && npm install');
        grunt.log.writeln(result);
        grunt.log.writeln('Unlinking Web-Expensify...');
        result = exec('cd ../Web-Expensify && npm uninstall --no-save js-libs && npm install');
        grunt.log.writeln(result);
        grunt.log.writeln('Back to normal!');
    });
};
