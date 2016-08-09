---
css:
  - "assets/css/main.css"
layout: default
---

# Music

{% for playlist in site.data.playlists.items %}
  <iframe src="https://embed.spotify.com/?uri=spotify%3Auser%3Anateirwin%3Aplaylist%3{{ playlist.id }}"></iframe>
{% endfor %}
