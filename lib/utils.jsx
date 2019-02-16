import _ from 'underscore';

module.exports = {
    exists: thing => !_.isUndefined(thing) && thing !== null,
};
