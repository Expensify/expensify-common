const gruntTaskLoader = require('load-grunt-tasks');
const loadConfigs = require('./grunt/configloader');
const loadTasks = require('./grunt/taskloader');

module.exports = function (grunt) {
    // Load all the grunt task plugin
    gruntTaskLoader(grunt);

    // Load all of the configs from our ./grunt/configs folder
    loadConfigs(grunt);

    // Setup our tasks
    loadTasks(grunt);
};
