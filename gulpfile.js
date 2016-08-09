var gulp = require('gulp');
var secrets = require('./secrets.json');

gulp.task('default', function () {
  // place code for your default task here
});
gulp.task('fetch-spotify', function (cb) {
  var SpotifyApi = require('spotify-web-api-node');
  var spotify = new SpotifyApi({
    clientId: secrets.spotify.client_id,
    clientSecret: secrets.spotify.client_secret
  });

  spotify.clientCredentialsGrant()
    .then(function (data) {
      spotify.setAccessToken(data.body['access_token']);
      spotify.getUserPlaylists('nateirwin')
        .then(function (data) {
          var items = data.body.items;
          var count = items.length;
          var interval;

          console.log('hello!');

          console.log(items);

          for (var i = 0; i < count; i++) {
            var item = items[i];

            spotify.getPlaylist('nateirwin', item.id)
              .then(function (data) {




                items[i].added = data.body;
                count++;
              }, function (error) {
                console.log(error);
                count++;
              });
          }

          interval = setInterval(function () {
            if (count === items.length) {
              var fs = require('fs');

              clearInterval(interval);
              console.log(items);
              fs.writeFile('_data/playlists.json', JSON.stringify(items), function (error) {
                  if (error) {
                    return console.log(error);
                  }

                  cb();
              });
            }
          }, 100);
        }, function (error) {
          console.log(error);
          cb();
        });
    }, function (error) {
      console.log(error);
      cb();
    });
});
