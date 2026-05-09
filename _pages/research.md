---
layout: research
title: "Research"
permalink: /research/
author_profile: true
---

<style>
.research-container {
    max-width: 900px;
    margin: 0;
}

.archive {
    padding-top: 0;
    margin-top: 0;
}

#main {
    padding-top: 0em;
}

.research-container {
    margin-top: 0;
    padding-top: 0;
}

.research-container h2:first-of-type {
    margin-top: 0;
}

.research-container h2 {
    font-size: 1.5em;
    margin-bottom: 0.6em;
    color: #333;
}

.research-container h2.research-section-heading {
    margin-top: 1.6em;
}

.research-container h2.research-section-heading:first-of-type {
    margin-top: 0;
}

/* Accordion list */
.accordion-row {
    border-top: 0.5px solid #e5e5e5;
}

.accordion-row:last-child {
    border-bottom: 0.5px solid #e5e5e5;
}

.accordion-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 4px;
    cursor: pointer;
    user-select: none;
}

.accordion-image-wrap {
    flex-shrink: 0;
    width: 140px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #e0e0e0;
    transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1),
                height 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.accordion-row.expanded .accordion-image-wrap {
    width: 220px;
    height: 140px;
}

.accordion-text {
    flex: 1;
    min-width: 0;
}

.accordion-title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
}

.accordion-title {
    font-size: 15px;
    font-weight: 500;
    color: #222;
    line-height: 1.35;
}

.accordion-year {
    font-size: 12px;
    color: #888;
    flex-shrink: 0;
    white-space: nowrap;
}

.accordion-venue {
    font-size: 12px;
    color: #888;
    margin-top: 2px;
}

.accordion-summary {
    font-size: 13px;
    color: #555;
    line-height: 1.5;
    margin-top: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.accordion-row.expanded .accordion-header .accordion-summary {
    display: none;
}

.accordion-chevron {
    flex-shrink: 0;
    color: #999;
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-row.expanded .accordion-chevron {
    transform: rotate(180deg);
}

.accordion-detail {
    max-height: 0;
    overflow: hidden;
    transition: max-height 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-row.expanded .accordion-detail {
    max-height: 1500px;
}

.accordion-detail-inner {
    padding: 0 4px 18px calc(140px + 16px + 4px);
}

.accordion-row.expanded .accordion-detail-inner {
    padding-left: calc(220px + 16px + 4px);
}

.accordion-description {
    font-size: 13px;
    color: #555;
    line-height: 1.6;
}

.accordion-description p {
    margin: 0 0 0.6em 0;
}

.accordion-description p:last-child {
    margin-bottom: 0;
}

.accordion-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 12px;
}

.accordion-tag {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 999px;
    background: #eee;
    color: #555;
    line-height: 1.5;
}

.tag-computer-vision { background: #e8f5e9; color: #2e7d32; }
.tag-machine-learning { background: #f3e5f5; color: #6a1b9a; }
.tag-accessibility { background: #e3f2fd; color: #1565c0; }
.tag-physics { background: #fff3e0; color: #b25c00; }
.tag-simulation { background: #fce4ec; color: #ad1457; }
.tag-dataset { background: #fffde7; color: #8d6e00; }
.tag-climate { background: #e0f7fa; color: #006978; }

.accordion-links {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 14px;
}

.accordion-link {
    font-size: 13px;
    color: #0066cc;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
}

.accordion-link:hover {
    text-decoration: underline;
}

.accordion-link-icon {
    font-size: 13px;
}

@media (max-width: 768px) {
    .accordion-image-wrap {
        width: 100px;
        height: 64px;
    }
    .accordion-row.expanded .accordion-image-wrap {
        width: 140px;
        height: 90px;
    }
    .accordion-detail-inner {
        padding-left: calc(100px + 16px + 4px);
    }
    .accordion-row.expanded .accordion-detail-inner {
        padding-left: calc(140px + 16px + 4px);
    }
    .accordion-title-row {
        flex-direction: column;
        gap: 2px;
    }
    .accordion-year {
        font-size: 11px;
    }
}
</style>

{% include base_path %}

<div class="research-container">
  <h2 class="research-section-heading">Current Projects</h2>
  {% assign current_projects = site.research | where: "status", "current" | reverse %}
  {% if current_projects.size > 0 %}
    {% for post in current_projects %}
      {% include archive-single-research.html %}
    {% endfor %}
  {% else %}
    <p style="color: #666; font-style: italic;">No current projects.</p>
  {% endif %}

  <h2 class="research-section-heading">Past Projects</h2>
  {% assign past_projects = site.research | where: "status", "past" | reverse %}
  {% if past_projects.size > 0 %}
    {% for post in past_projects %}
      {% include archive-single-research.html %}
    {% endfor %}
  {% else %}
    <p style="color: #666; font-style: italic;">No past projects.</p>
  {% endif %}
</div>

<script>
(function () {
  var rows = document.querySelectorAll('[data-accordion-row]');
  rows.forEach(function (row) {
    var header = row.querySelector('.accordion-header');
    if (!header) return;
    header.addEventListener('click', function () {
      var wasExpanded = row.classList.contains('expanded');
      rows.forEach(function (r) { r.classList.remove('expanded'); });
      if (!wasExpanded) row.classList.add('expanded');
    });
  });
})();
</script>
