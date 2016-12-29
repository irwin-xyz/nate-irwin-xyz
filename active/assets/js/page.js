/* globals mapboxgl, XMLHttpRequest */

var activityColor = '#ff4b00';
var storedActivities = {};
var map;

window.handleClick = function (el) {
  for (var id in storedActivities) {
    map.setPaintProperty(id, 'line-color', activityColor);
  }

  map.setPaintProperty(el.id, 'line-color', '#ffba43');
  window.zoomTo(storedActivities[el.id].data.features[0].geometry.coordinates);
};
window.loadFile = function (path, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function () {
    return callback(this.responseText);
  };
  xhr.open('GET', path, true);
  xhr.send();
};
window.zoomTo = function (coordinates) {
  var bounds = coordinates.reduce(function (bounds, coord) {
    return bounds.extend(coord);
  }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

  map.fitBounds(bounds, {
    padding: 20
  });
};
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
    map.addControl(new mapboxgl.NavigationControl());
    window.loadFile('assets/data/activities.json', function (activities) {
      var allCoordinates = [];
      var ul = '<ul>';

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
                properties: activity,
                geometry: {
                  type: 'LineString',
                  coordinates: latLngs
                }
              }]
            }
          };
          var id = activity.id.toString();

          storedActivities[id] = geojson;

          for (var j = 0; j < latLngs.length; j++) {
            allCoordinates.push(latLngs[j]);
          }

          ul += '' +
            '<li id="' + id + '" onclick="handleClick(this);return false;">' +
              '<div>' + activity.name + '<br>' + activity.formattedDate + '</div>' +
            '</li>' +
          '';

          map
            .addSource(id, geojson)
            .addLayer({
              id: id,
              layout: {
                'line-cap': 'round',
                'line-join': 'round'
              },
              paint: {
                'line-color': activityColor,
                'line-width': 7
              },
              source: id,
              type: 'line'
            }, 'water');
        }
      }

      ul += '</ul>';
      document.getElementsByClassName('sidebar')[0].innerHTML = ul;
      window.zoomTo(allCoordinates);
    });
  });
