var gulp = require('gulp');
var secrets = require('./secrets.json');

gulp.task('default', function () {});
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
