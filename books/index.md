---
layout: default
---

# Books

<ul>
{% for book in site.data.books %}
  <li>{{ book.title }} - <strong>{{ book.authors | map: 'author' | map: 'name' | join: ', ' }}</strong></li>
{% endfor %}
</ul>
