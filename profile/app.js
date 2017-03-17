'use strict';

// require module
const profile = require('./profile');

// Get the arguments from the command line
// first 2 are not apart of the arguments
const users = process.argv.slice(2);
// for each argument call profile.get
users.forEach(profile.get);
