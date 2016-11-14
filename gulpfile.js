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
    var books = json.GoodreadsResponse.books[0].book;

    // TODO: This will work until you read 400+ books :-)
    goodreads.getSingleShelf({
      page: 2,
      per_page: 200,
      shelf: 'read',
      userID: '76558'
    }, function (json2) {
      var books2 = json2.GoodreadsResponse.books[0].book;
      var fs = require('fs');

      for (var i = 0; i < books2.length; i++) {
        books.push(books2[i]);
      }

      books.sort(function (a, b) {
        var nameA = a.title[0].toUpperCase();
        var nameB = b.title[0].toUpperCase();

        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
      });
      fs.writeFile('_data/books.json', JSON.stringify(books), function (error) {
        if (error) {
          return console.log('Error: ' + error);
        }

        count++;
      });
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

  console.log(secrets.spotify.client_id);
  console.log(secrets.spotify.client_secret);

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
          var accept = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ];
          var count = 0;
          var i = playlists.length;

          while (i--) {
            var name = playlists[i].name;
            var valid = false;

            for (var j = 0; j < accept.length; j++) {
              if (name.indexOf(accept[j]) > -1) {
                valid = true;
                break;
              }
            }

            if (!valid) {
              playlists.splice(i, 1);
            }
          }

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
