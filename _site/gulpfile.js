var gulp = require('gulp');
var secrets = require('./secrets.json');

gulp.task('default', function () {});
gulp.task('fetch-goodreads', function (cb) {
  var GoodreadsApi = require('goodreads');
  var goodreads = new GoodreadsApi.client({
    key: secrets.goodreads.key,
    secret: secrets.goodreads.secret
  });
  var count = 0;
  var interval;

  goodreads.getShelves('76558', function (json) {
    // console.log(JSON.stringify(json));
    count++;
  });
  goodreads.getSingleShelf({
    page: 1,
    per_page: 200,
    shelf: 'read',
    userID: '76558'
  }, function (json) {
    var fs = require('fs');

    fs.writeFile('_data/books.json', JSON.stringify(json.GoodreadsResponse.books[0].book), function (error) {
      if (error) {
        return console.log('Error: ' + error);
      }

      count++;
    });
  });

  interval = setInterval(function () {
    if (count === 2) {
      clearInterval(interval);
      cb();
    }
  }, 500);
});
gulp.task('fetch-spotify', function (cb) {
  var SpotifyApi = require('spotify-web-api-node');
  var spotify = new SpotifyApi({
    clientId: secrets.spotify.client_id,
    clientSecret: secrets.spotify.client_secret
  });

  spotify.clientCredentialsGrant()
    .then(function (data) {
      return data.body['access_token'];
    })
    .then(function (accessToken) {
      spotify.setAccessToken(accessToken);
      spotify.getUserPlaylists('nateirwin')
        .then(function (data) {
          return data.body.items;
        })
        .then(function (playlists) {
          var count = 0;

          playlists.forEach(function (playlist) {
            spotify.getPlaylist('nateirwin', playlist.id)
              .then(function (data) {
                playlist.tracks = data.body.tracks.items;

                count++;

                if (count === playlists.length) {
                  var fs = require('fs');

                  fs.writeFile('_data/playlists.json', JSON.stringify(playlists), function (error) {
                    if (error) {
                      return console.log('Error: ' + error);
                    }

                    cb();
                  });
                }
              });
          });
        });
    });
});
