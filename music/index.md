---
css:
  - "assets/css/main.css"
layout: default
---

# Music

In November 2015, I started creating monthly playlists to track songs that "hit a nerve" with me during each month. Some months I obviously didn't listen to much music, while others were chock full of discovery.

Click through on each playlist's name to listen to it on Spotify.

{% for playlist in site.data.playlists %}
<h2><a href="{{ playlist.external_urls.spotify }}">{{ playlist.name }}</a></h2>
<ol>
  {% for track in playlist.tracks %}
  <!-- <li>{{ track.track.name }}<br><strong>{{ track.track.artists.first.name }}</strong> - {{ track.track.album.name }}</li> -->
  <li>{{ track.track.name }} - <strong>{{ track.track.artists | map: 'name' | join: ', ' }}</strong></li>
  {% endfor %}
</ol>
{% endfor %}
