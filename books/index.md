---
layout: default
---

# Books

I've read {{ site.data.books.size }} books (and counting).

<ul>
{% for book in site.data.books %}
  <li><a href="{{ book.link.first}} " target="_blank">{{ book.title }}</a> - <strong>{{ book.authors | map: 'author' | map: 'name' | join: ', ' }}</strong></li>
{% endfor %}
</ul>
