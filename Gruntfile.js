const gruntTaskLoader = require('load-grunt-tasks');
const loadConfigs = require('./grunt/configloader');
const loadTasks = require('./grunt/taskloader');

module.exports = function (grunt) {
    // Load all the grunt task plugin
    gruntTaskLoader(grunt);

    // Load all of the configs from our ./grunt/configs folder
    loadConfigs(grunt);

    // Load all of the tasks from our ./grunt/task folder
    loadTasks(grunt);

    grunt.event.on('watchChokidar', () => {
        grunt.task.run(['link']);
    });
};
