const dotenv = require('dotenv').config();
var keys = require('./key.js');
var Spotify = require('node-spotify-api');
var request = require('request');



// spotify -----------------------

function spotifyThisSong(song) {
    var spotifyMessenger = new Spotify(keys.spotify);  
    spotifyMessenger.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        var firstResponse = data.tracks.items[0];
        var artists = "";
        for (var i = 0; i < firstResponse.artists.length; ++i) {
            artists += firstResponse.artists[i].name;
            if(i != firstResponse.artists.length - 1) {
                artists += ', ';
            }
        }
        console.log('Artists: ' + artists); 
        console.log('Song Name: ' + firstResponse.name);
        console.log('Album: ' + firstResponse.album.name);
        console.log('Preview Link: ' + firstResponse.external_urls.spotify); 
        // console.log(firstResponse);
    });
}

function parseInput() {
    // get the command
    const command = process.argv[2];

    // get the parameter
    const parameter = process.argv[3];
    switch(command) {
        case 'spotify-this-song':
            spotifyThisSong(parameter);
            break;
        case 'movie-this':
            searchThisMovie(parameter);
            break;
        case 'concert-this':
            searchThisBand(parameter);
            break;
        case 'do-what-it-says':
            doWhatItSays(parameter);
            break;
        default:
            console.log('Unrecognized Input');
    }
}

parseInput();


// omdb ---------------
function searchThisMovie(movie) {
    var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie + "&y=&plot=full&tomatoes=true&r=json";
    request.get(queryURL, function(err, response, body) {
        var jsonBody = JSON.parse(body);

        if(err) {
            return console.log('Error occurred: ' + err);
        }

        if(!movie) {
            return console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        } else if(!err && response.statusCode === 200) {
            var ratings = jsonBody.Ratings;
            var tomato = ratings.find(obj => {
                return obj.Source === 'Rotten Tomatoes';
            })
            console.log('Title: ' + jsonBody.Title);
            console.log('Year: ' + jsonBody.Year);
            console.log("The movie's IMDB rating is: " + jsonBody.imdbRating);
            console.log('Rotten Tomatoes Rating: ' + tomato.Value);
            console.log('Country Produced in: ' + jsonBody.Country);
            console.log('Language: ' + jsonBody.Language);
            console.log('Plot: ' + jsonBody.Plot);
            console.log('Actors: ' + jsonBody.Actors);
        } 
    });
};

//--- bands in town

function searchThisBand(artist) {
 var bandsURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
 request(bandsURL, function(err, response, body) {
     if(err) {
        return console.log('Error occurred: ' + err);
        }

    else if (!err && response.statusCode === 200) {
        var jsonData = JSON.parse(body);
        
    console.log("Upcoming concerts for " + artist + ":");

    for (var i = 0; i < jsonData.length; i++) {
        var show = jsonData[i];

    // print data (venue, region/country, date)
        console.log(show.venue.name);
        console.log(show.venue.city + "," + (show.venue.region || show.venue.country));
        console.log(moment(show.datetime).format("MM/DD/YYYY"));
        }
    }
});

//--- do what it says

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error,data){
        console.log(data);
        var dataArr = data.split(",");
        if (dataArr.length === 2) {
            pick(dataArr[0], dataArr[1]);
        } else if (dataArr.length === 1) {
            pick(dataArr[0]);
        }
    });
};

var runCode = function(argOne, argTwo) {
    pick(argOne, argTwo);
  };
  

runCode(process.argv[2], process.argv.slice(3).join(" "))};