---
css:
  - "assets/css/main.css"
layout: default
---

# Music

{% for playlist in site.data.playlists %}
  <h2>{{ playlist.name }}</h2>
  <iframe src="https://embed.spotify.com/?uri=spotify%3Auser%3Anateirwin%3Aplaylist%3A{{ playlist.id }}"></iframe>
{% endfor %}
