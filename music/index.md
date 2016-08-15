---
css:
  - "assets/css/main.css"
layout: default
---

# Music

{% for playlist in site.data.playlists %}
<h2><a href="{{ playlist.external_urls.spotify }}">{{ playlist.name }}</a></h2>
<ol>
  {% for track in playlist.tracks %}
  <!-- <li>{{ track.track.name }}<br><strong>{{ track.track.artists.first.name }}</strong> - {{ track.track.album.name }}</li> -->
  <li>{{ track.track.name }} - <strong>{{ track.track.artists | map: 'name' | join: ', ' }}</strong></li>
  {% endfor %}
</ol>
{% endfor %}
