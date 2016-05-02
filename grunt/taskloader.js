const packageTask = require('./tasks/package');
const travisTask = require('./tasks/travis');

/**
 * Lets all the tasks register themself with Grunt
 * @param  {Grunt} grunt
 * @return {Grunt}
 */
module.exports = function (grunt) {
    // Setup our tasks
    packageTask(grunt);
    travisTask(grunt);
    return grunt;
};
