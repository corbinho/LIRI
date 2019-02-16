var dotEnv = require('dotenv')
require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var moment = require('moment');
var Spotify = new Spotify(keys.spotify);
var fs = require('fs');

var processArray = process.argv;
var typeOfSearch = process.argv[2];
var searchTerm = "";

for (var i = 3; i < processArray.length; i++) {

    if (i > 3 && i < processArray.length) {
        searchTerm = searchTerm + "+" + processArray[i];
    } else {
        searchTerm += processArray[i];

    }
}

switch (typeOfSearch) {
    case "concert-this":
        console.log("Searching for a concert based on artist")
        var queryUrl = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";
        axios.get(queryUrl).then(
            function (response) {
                var divider = "\n------------------------------------------------------------\n\n";
                var jsonData = response.data[0];
                // movie ends up being the string containing the show data we will print to the console
                var ConcertData = [
                    "Show Venue: " + jsonData.venue.name,
                    "Venue Location: " + jsonData.venue.city + " " + jsonData.venue.region,
                    "Date of Event: " + jsonData.datetime
                ].join("\n\n");

                fs.appendFile("log.txt", ConcertData + divider, function (err) {
                    if (err) throw err;
                });
                console.log(ConcertData)
            }
        );
        break

    case "spotify-this-song":
        console.log("Searching for a song")
        Spotify.search({
            type: 'track',
            query: searchTerm
        }, function (err, data) {
            var divider = "\n------------------------------------------------------------\n\n";
            if (err) {
                return console.log('Error occurred: ' + err);
            } else
                //console.log(data.tracks.items[0]);
                var jsonData = data.tracks.items[0]
            var songData = [
                "Artist: " + jsonData.artists[0].name,
                "Song Name: " + jsonData.name,
                "Preview Link: " + jsonData.preview_url,
                "Album: " + jsonData.album.name
            ].join("\n\n");

            fs.appendFile("log.txt", songData + divider, function (err) {
                if (err) throw err;
            });
            console.log(songData)
        });
        break
    case "movie-this":
        console.log("Searching for a movie")
        var queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=trilogy";
        if (queryUrl === "http://www.omdbapi.com/?t=&y=&plot=short&apikey=trilogy") {
            axios.get("http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=trilogy").then(
                function (response) {
                    var divider = "\n------------------------------------------------------------\n\n";
                    var jsonData = response.data;
                    // showData ends up being the string containing the show data we will print to the console
                    var movie = [
                        "Title: " + jsonData.Title,
                        "Release Year: " + jsonData.Year,
                        "IMDB Rating: " + jsonData.Ratings[0].Value,
                        "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
                        "Country of production: " + jsonData.Country,
                        "Language: " + jsonData.Language,
                        "Plot: " + jsonData.Plot,
                        "Actors: " + jsonData.Actors
                    ].join("\n\n");

                    fs.appendFile("log.txt", movie + divider, function (err) {
                        if (err) throw err;
                    });
                    console.log(movie)
                }
            )
            break
        } else {
            axios.get(queryUrl).then(
                function (response) {
                    var divider = "\n------------------------------------------------------------\n\n";
                    var jsonData = response.data;
                    // showData ends up being the string containing the show data we will print to the console
                    var movie = [
                        "Title: " + jsonData.Title,
                        "Release Year: " + jsonData.Year,
                        "IMDB Rating: " + jsonData.Ratings[0].Value,
                        "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
                        "Country of production: " + jsonData.Country,
                        "Language: " + jsonData.Language,
                        "Plot: " + jsonData.Plot,
                        "Actors: " + jsonData.Actors
                    ].join("\n\n");

                    fs.appendFile("log.txt", movie + divider, function (err) {
                        if (err) throw err;
                    });
                    console.log(movie)
                }
            )
        };
        break
    case "do-what-it-says":
        console.log("Doing what the text file says");
        fs.readFile("random.txt", "utf-8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            var output = data.split(",")
            console.log(output)
            if (output[0] === "concert-this") {
                for (var i = 1; i < output.length; i++) {

                    if (i > 1 && i < output.length) {
                        searchTerm = searchTerm + "+" + output[i];
                    } else {
                        searchTerm += output[i];
                
                    }
                }
                // console.log(searchTerm)
                console.log("Searching for a concert based on artist")
                var queryUrl = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=codingbootcamp";
                axios.get(queryUrl).then(
                    function (response) {
                        var divider = "\n------------------------------------------------------------\n\n";
                        var jsonData = response.data[0];
                        // movie ends up being the string containing the show data we will print to the console
                        var concertData = [
                            "Show Venue: " + jsonData.venue.name,
                            "Venue Location: " + jsonData.venue.city + " " + jsonData.venue.region,
                            "Date of Event: " + jsonData.datetime
                        ].join("\n\n");

                        fs.appendFile("log.txt", concertData + divider, function (err) {
                            if (err) throw err;
                        });
                        console.log(concertData)
                    }
                );
               
            }
        })
}