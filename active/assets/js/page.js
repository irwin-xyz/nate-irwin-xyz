/* globals mapboxgl, XMLHttpRequest */

var map;

function loadFile (path, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    return callback(this.responseText);
  };
  xhr.open('GET', path, true);
  xhr.send();
}

// Personal running heatmap: https://d22umfi1yqsdc.cloudfront.net/tiles/01000000000A7E3713B4D924-117260BC/14-3412-6217.png?1476717904

mapboxgl.accessToken = 'pk.eyJ1IjoibmF0ZWlyd2luIiwiYSI6ImNpdWFkbnMxZDAwMXMyeW53d3I4MmE4NncifQ.4BePx37LMm5D1uDg8fDefA';
map = new mapboxgl.Map({
  center: {
    lat: 39.776,
    lng: -105.009
  },
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v9',
  zoom: 6
})
  .on('load', function () {
    loadFile('assets/data/activities.json', function (activities) {
      var allCoordinates = [];
      var bounds;

      activities = JSON.parse(activities);

      for (var i = 0; i < activities.length; i++) {
        var activity = activities[i];
        var latLngs = activities[i].map.latLngs;

        if (latLngs) {
          var geojson = {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: latLngs
                }
              }]
            }
          };
          var id = activity.id.toString();

          for (var j = 0; j < latLngs.length; j++) {
            allCoordinates.push(latLngs[j]);
          }

          map.addSource(id, geojson);
          map.addLayer({
            id: id,
            layout: {
              'line-cap': 'round',
              'line-join': 'round'
            },
            paint: {
              'line-color': '#ff4b00',
              'line-width': 5
            },
            source: id,
            type: 'line'
          });
        }
      }

      bounds = allCoordinates.reduce(function (bounds, coord) {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(allCoordinates[0], allCoordinates[0]));

      map.fitBounds(bounds, {
        padding: 20
      });
    });
  });
