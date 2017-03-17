'use strict';
const https = require('https');
const http = require('http');
const api = require('./api.json');

// print the weather for the queried location
function printWeather(weather) {
    const message = `The weather in ${weather.current_observation.display_location.full} is currently ${weather.current_observation.temperature_string}`;
    console.log(message);
}

// print error message to the console
function errorMessage(error) {
    console.error(error.message);
}

// call the weather api with the query
function get(query) {
    // try...catch to catch if the url is malformed
    try {
        const request = https.get(`https://api.wunderground.com/api/${api.key}/conditions/q/${query}.json`, response => {
            // remove underscores for readability when sending query in an error
            const readableQuery = query.replace('_', ' ');

            // check the response status code
            if (response.statusCode === 200) {
                let body = "";
                response.on('data', chunk => {
                    body += chunk;
                });

                response.on('end', () => {
                    // catch any errors by the json parser
                    try {
                        // parse the data
                        const weather = JSON.parse(body);
                        // check if the weather was found before printing
                        if (weather.current_observation) {
                            // print the weather to the console
                            printWeather(weather);
                        } else {
                            // if weather was not found create new error message
                            const queryError = new Error(`The location "${readableQuery}" was not found.`);
                            errorMessage(queryError);
                        }

                        // json parser errors
                    } catch (error) {
                        errorMessage(error);
                    }
                });

                response.on('error', errorMessage);
            } else {
                // if statusCode is not 200 create a new error with a human readable status message
                const message = `There was a problem getting the message for ${readableQuery} (${http.STATUS_CODES[response.statusCode]})`;
                const statusCodeError = new Error(message);
                errorMessage(statusCodeError);
            }
        });

        request.on('error', errorMessage);

    } catch (error) {
        // malformed url error
        errorMessage(error);
    }
}

module.exports.get = get;