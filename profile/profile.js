'use strict';

const https = require('https');
const http = require('http');

// function to print message to console
function printMessage(username, badgeCount, points) {
    const message = `${username} has ${badgeCount} total badge(s) and ${points} points in JavaScript`;
    console.log(message);
}

function printError(error) {
    console.error(error.message);
}

function get(username) {
    // uses try...catch block to catch runtime errors like having a mal-formed domain for the get request
    try {
        // connect to the API url
        const request = https.get(`https://teamtreehouse.com/${username}.json`, (res) => {
            if (res.statusCode === 200) {
                let body = "";
                res.on('data', data => {
                    body += data.toString();
                });

                res.on('end', () => {
                    try {
                        const profile = (JSON).parse(body);
                        printMessage(username, profile.badges.length, profile.points.JavaScript);
                    } catch (error) {
                        printError(error);
                    }
                });
            } else {
                const message = `There was an error getting the profile for ${username} (${http.STATUS_CODES[res.statusCode]})`;
                const statusCodeError = new Error(message);
                printError(statusCodeError);
            }
        });

        // catches errors on the request and prints a nice message to the console
        request.on('error', printError);
    } catch (error) {
        printError(error);
    }
}

module.exports.get = get;