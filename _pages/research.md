---
layout: research
title: "Research"
permalink: /research/
author_profile: true
---

<style>
/* Research Page Hover Effect Styles */
.research-container {
    max-width: 900px;
    margin: 0;
}

/* Remove top padding/margin from archive div */
.archive {
    padding-top: 0;
    margin-top: 0;
}

/* Adjust main content area */
#main {
    padding-top: 0em; /* Adjust this value as needed, or set to 0 */
}
/* Remove any extra spacing from the research container */
.research-container {
    margin-top: 0;
    padding-top: 0;
}

/* Remove top margin from first heading */
.research-container h2:first-of-type {
    margin-top: 0;
}

/* Scale down section headings */
.research-container h2 {
    font-size: 1.5em; /* Down from 1.8em */
}

/* Scale down research cards */
.research-title {
    font-size: 20px; /* Down from 24px */
}

.research-meta {
    font-size: 13px; /* Down from 14px */
}

.research-excerpt {
    font-size: 14px; /* Down from 15px */
}

.research-supervisor {
    font-size: 13px; /* Down from 14px */
}

/* Scale down image height */
.research-image-container {
    height: 250px; /* Down from 300px */
}

.research-card {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    position: relative;
    transition: box-shadow 0.3s ease;
}

.research-card:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.research-image-container {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    background-color: #e0e0e0;
}

.research-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.research-card:hover .research-image {
    transform: scale(1.05);
}

.research-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%);
    color: white;
    padding: 30px;
    transform: translateY(calc(100% - 80px));
    transition: transform 0.4s ease;
    max-height: 100%;
    overflow-y: auto;
}

.research-card:hover .research-content {
    transform: translateY(0);
}

.research-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 10px 0;
    color: white;
}

.research-title a {
    color: white;
    text-decoration: none;
}

.research-title a:hover {
    color: #e0e0e0;
}

.research-meta {
    font-size: 14px;
    color: #ccc;
    margin-bottom: 15px;
}

.research-meta span {
    margin-right: 15px;
    display: inline-block;
}

.research-excerpt {
    font-size: 15px;
    line-height: 1.6;
    color: #f0f0f0;
    margin: 0;
    opacity: 0;
    transition: opacity 0.3s ease 0.1s;
}

.research-card:hover .research-excerpt {
    opacity: 1;
}

.research-supervisor {
    font-style: italic;
    color: #ddd;
    margin-top: 10px;
    font-size: 14px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .research-image-container {
        height: 200px;
    }

    .research-content {
        transform: translateY(calc(100% - 70px));
        padding: 20px;
    }

    .research-title {
        font-size: 20px;
    }

    .research-meta {
        font-size: 12px;
    }

    .research-meta span {
        display: block;
        margin-bottom: 5px;
    }
}
</style>

{% include base_path %}

<div class="research-container">
  <h2 style="font-size: 1.8em; margin-bottom: 1em; color: #333;">Current Projects</h2>
  {% assign current_projects = site.research | where: "status", "current" | reverse %}
  {% if current_projects.size > 0 %}
    {% for post in current_projects %}
      {% include archive-single-research.html %}
    {% endfor %}
  {% else %}
    <p style="color: #666; font-style: italic;">No current projects.</p>
  {% endif %}

  <h2 style="font-size: 1.8em; margin-top: 2em; margin-bottom: 1em; color: #333;">Past Projects</h2>
  {% assign past_projects = site.research | where: "status", "past" | reverse %}
  {% if past_projects.size > 0 %}
    {% for post in past_projects %}
      {% include archive-single-research.html %}
    {% endfor %}
  {% else %}
    <p style="color: #666; font-style: italic;">No past projects.</p>
  {% endif %}
</div>