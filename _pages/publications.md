---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

<style>
.publications-list {
  margin: 2em 0;
}

.pub-year-header {
  font-size: 1.3em;
  font-weight: bold;
  margin: 1.5em 0 0.5em 0;
  color: #333;
}

.publication-item {
  display: flex;
  gap: 1.5em;
  margin-bottom: 1em;
  padding-bottom: 1em;
  border-bottom: 1px solid #e0e0e0;
}

.publication-item:last-child {
  border-bottom: none;
}

.pub-thumbnail {
  flex-shrink: 0;
  width: 120px;
  height: 156px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.pub-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pub-thumbnail-placeholder {
  color: #999;
  font-size: 0.8em;
  text-align: center;
  padding: 10px;
}

.pub-content {
  flex: 1;
  min-width: 0;
}

.pub-title {
  font-size: 1em;
  font-weight: 600;
  margin-bottom: 0.3em;
  line-height: 1.4;
}

.pub-title a {
  color: #0066cc;
  text-decoration: none;
}

.pub-title a:hover {
  text-decoration: underline;
}

.pub-authors {
  color: #555;
  margin-bottom: 0.4em;
  font-size: 0.95em;
  line-height: 1.4;
}

.pub-venue {
  color: #666;
  margin-bottom: 0.3em;
  font-size: 0.95em;
}

.pub-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-top: 0.3em;
  align-items: center;
}

.pub-link {
  font-size: 0.7em;
  color: #0066cc;
  text-decoration: none;
  padding: 0.2em 0;
  white-space: nowrap;
}

.pub-link:hover {
  text-decoration: underline;
}

.pub-link-separator {
  color: #999;
  margin: 0 0.0em;
  user-select: none;
}

/* Filter toggle styles */
.filter-toggle {
  margin: 1.5em 0;
  display: flex;
  gap: 0.5em;
  align-items: center;
}

.filter-button {
  padding: 0.5em 1.2em;
  border: 2px solid #0066cc;
  background: white;
  color: #0066cc;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.filter-button:hover {
  background: #f0f7ff;
}

.filter-button.active {
  background: #0066cc;
  color: white;
}

.publication-item.hidden {
  display: none;
}

@media (max-width: 768px) {
  .publication-item {
    flex-direction: column;
  }
  
  .pub-thumbnail {
    width: 100%;
    max-width: 200px;
  }
}
</style>

{% if site.author.googlescholar %}
<p>You can also find my articles on <a href="{{ site.author.googlescholar }}">my Google Scholar profile</a>.</p>
{% endif %}

{% include base_path %}

<div class="filter-toggle">
  <button class="filter-button active" data-filter="selected">Selected Publications</button>
  <button class="filter-button" data-filter="all">All Publications</button>
</div>

<div class="publications-list">
{% capture written_year %}'None'{% endcapture %}
{% for post in site.publications reversed %}
  {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
  {% if year != written_year %}
<h2 class="pub-year-header" data-year="{{ year }}">{{ year }}</h2>
    {% capture written_year %}{{ year }}{% endcapture %}
  {% endif %}
  
  <div class="publication-item" data-selected="{% if post.selected %}true{% else %}false{% endif %}">
    <div class="pub-thumbnail">
      {% if post.thumbnail %}
        <img src="{{ post.thumbnail }}" alt="{{ post.title }} thumbnail">
      {% elsif post.paperurl %}
        <img src="{{ post.paperurl | replace: '.pdf', '-thumb.jpg' }}" 
             alt="{{ post.title }} thumbnail"
             onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\'pub-thumbnail-placeholder\'>PDF</div>';">
      {% else %}
        <div class="pub-thumbnail-placeholder">PDF</div>
      {% endif %}
    </div>

    <div class="pub-content">
      <div class="pub-title">
        {% if post.paperurl %}
          <a href="{{ post.paperurl }}">{{ post.title }}</a>
        {% else %}
          {{ post.title }}
        {% endif %}
      </div>
      
      {% if post.authors %}
      <div class="pub-authors">
        {{ post.authors }}
      </div>
      {% endif %}
      
      <div class="pub-venue">
        {{ post.venue }}
        {% if post.award %}
          | <em>{{ post.award }}</em>
        {% endif %}
        {% if post.acceptance_rate %}
          | Acceptance Rate: {{ post.acceptance_rate }}
        {% endif %}
      </div>
      
      <div class="pub-links">
        {% if post.paperurl %}
          <a href="{{ post.paperurl }}" class="pub-link">PDF</a>
          {% if post.doi or post.citation or post.code or post.slides or post.video or post.project or post.arxiv %}
            <span class="pub-link-separator">|</span>
          {% endif %}
        {% endif %}
        {% if post.doi %}
          <a href="{{ post.doi }}" class="pub-link">DOI</a>
          {% if post.citation or post.code or post.slides or post.video or post.project or post.arxiv %}
            <span class="pub-link-separator">|</span>
          {% endif %}
        {% endif %}
        {% if post.citation %}
          <a href="{{ post.citation }}" class="pub-link">Citation</a>
          {% if post.code or post.slides or post.video or post.project or post.arxiv %}
            <span class="pub-link-separator">|</span>
          {% endif %}
        {% endif %}
        {% if post.code %}
          <a href="{{ post.code }}" class="pub-link">Code</a>
          {% if post.slides or post.video or post.project or post.arxiv %}
            <span class="pub-link-separator">|</span>
          {% endif %}
        {% endif %}
        {% if post.slides %}
          <a href="{{ post.slides }}" class="pub-link">Slides</a>
          {% if post.video or post.project or post.arxiv %}
            <span class="pub-link-separator">|</span>
          {% endif %}
        {% endif %}
        {% if post.video %}
          <a href="{{ post.video }}" class="pub-link">Video</a>
          {% if post.project or post.arxiv %}
            <span class="pub-link-separator">|</span>
          {% endif %}
        {% endif %}
        {% if post.project %}
          <a href="{{ post.project }}" class="pub-link">Project</a>
          {% if post.arxiv %}
            <span class="pub-link-separator">|</span>
          {% endif %}
        {% endif %}
        {% if post.arxiv %}
          <a href="{{ post.arxiv }}" class="pub-link">arXiv</a>
        {% endif %}
      </div>
    </div>
  </div>
{% endfor %}
</div>

<script>
function filterPublications(filter, button) {
  // Update button states
  const buttons = document.querySelectorAll('.filter-button');
  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  
  // Filter publications
  const publications = document.querySelectorAll('.publication-item');
  const yearHeaders = document.querySelectorAll('.pub-year-header');
  
  publications.forEach(pub => {
    const isSelected = pub.getAttribute('data-selected') === 'true';
    
    if (filter === 'all' || (filter === 'selected' && isSelected)) {
      pub.classList.remove('hidden');
    } else {
      pub.classList.add('hidden');
    }
  });
  
  // Hide year headers with no visible publications
  yearHeaders.forEach(header => {
    let nextElement = header.nextElementSibling;
    let hasVisiblePub = false;
    
    while (nextElement && !nextElement.classList.contains('pub-year-header')) {
      if (nextElement.classList.contains('publication-item') && 
          !nextElement.classList.contains('hidden')) {
        hasVisiblePub = true;
        break;
      }
      nextElement = nextElement.nextElementSibling;
    }
    
    if (hasVisiblePub) {
      header.style.display = '';
    } else {
      header.style.display = 'none';
    }
  });
}

// Apply selected filter on page load and attach event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Attach click handlers to buttons
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      filterPublications(filter, this);
    });
  });
  
  // Apply initial filter
  const publications = document.querySelectorAll('.publication-item');
  const yearHeaders = document.querySelectorAll('.pub-year-header');
  
  publications.forEach(pub => {
    const isSelected = pub.getAttribute('data-selected') === 'true';
    if (!isSelected) {
      pub.classList.add('hidden');
    }
  });
  
  // Hide year headers with no visible publications
  yearHeaders.forEach(header => {
    let nextElement = header.nextElementSibling;
    let hasVisiblePub = false;
    
    while (nextElement && !nextElement.classList.contains('pub-year-header')) {
      if (nextElement.classList.contains('publication-item') && 
          !nextElement.classList.contains('hidden')) {
        hasVisiblePub = true;
        break;
      }
      nextElement = nextElement.nextElementSibling;
    }
    
    if (!hasVisiblePub) {
      header.style.display = 'none';
    }
  });
});
</script>