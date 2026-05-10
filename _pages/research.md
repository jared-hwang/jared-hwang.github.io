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

.research-container > h2:first-of-type {
    margin-top: 0;
}

.research-container > h2.research-section-heading {
    font-size: 1.5em;
    margin-bottom: 0.6em;
    margin-top: 1.6em;
    color: #333;
}

.research-container > h2.research-section-heading:first-of-type {
    margin-top: 0;
}

/* Accordion list */
.accordion-row {
    border-top: 0.5px solid #e5e5e5;
    transition: background-color 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-row:last-child {
    border-bottom: 0.5px solid #e5e5e5;
}

.accordion-row.expanded {
    background-color: #f4f2ee;
    border-radius: 12px;
    border-top-color: transparent;
}

.accordion-row.expanded + .accordion-row {
    border-top-color: transparent;
}

.accordion-row.expanded:last-child {
    border-bottom-color: transparent;
}

.accordion-header {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 8px 16px 156px;
    min-height: 96px;
    cursor: pointer;
    user-select: none;
    transition: padding 300ms cubic-bezier(0.4, 0, 0.2, 1),
                min-height 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-row.expanded .accordion-header {
    align-items: stretch;
    padding: 254px 18px 0;
    min-height: 240px;
}

.accordion-image-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 140px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    background-color: #e0e0e0;
    transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1),
                height 500ms cubic-bezier(0.4, 0, 0.2, 1),
                border-radius 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.accordion-row.expanded .accordion-image-wrap {
    width: 100%;
    height: 240px;
    border-radius: 12px 12px 0 0;
}

.accordion-image-fade {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 70%;
    background: linear-gradient(to bottom,
        rgba(248, 241, 226, 0) 0%,
        rgba(248, 241, 226, 0.5) 45%,
        rgba(248, 241, 226, 0.9) 80%,
        #f4f2ee 100%);
    opacity: 0;
    transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

.accordion-row.expanded .accordion-image-fade {
    opacity: 1;
}

.accordion-text {
    flex: 1;
    min-width: 0;
}

.accordion-row.animating .accordion-text {
    animation: accordionTextFade 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes accordionTextFade {
    0%   { opacity: 1; }
    30%  { opacity: 0; }
    60%  { opacity: 0; }
    100% { opacity: 1; }
}

.accordion-title-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
}

.accordion-title {
    font-size: 15px;
    font-weight: 500;
    color: #222;
    line-height: 1.35;
    flex: 1;
    min-width: 0;
}

.accordion-year {
    font-size: 12px;
    color: #888;
    flex-shrink: 0;
    white-space: nowrap;
}

.accordion-chevron {
    flex-shrink: 0;
    color: #999;
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-row.expanded .accordion-chevron {
    transform: rotate(180deg);
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

.accordion-row.expanded .accordion-summary {
    display: none;
}

.accordion-detail {
    max-height: 0;
    overflow: hidden;
    transition: max-height 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-row.expanded .accordion-detail {
    max-height: 4000px;
}

.accordion-detail-inner {
    padding: 0 18px 22px;
}

.accordion-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 14px;
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

/* Body content (rendered post.content) inside the expanded panel */
.accordion-body p {
    font-size: 14px;
    line-height: 1.65;
    color: #333;
    margin: 0 0 0.9em 0;
}

.accordion-body h2 {
    font-size: 1.15em;
    margin-top: 1.3em;
    margin-bottom: 0.4em;
    color: #222;
}

.accordion-body h3 {
    font-size: 1.0em;
    margin-top: 1.1em;
    margin-bottom: 0.3em;
    color: #222;
}

.accordion-body strong {
    color: #222;
}

.accordion-body img {
    max-width: 100%;
    height: auto;
}

.accordion-body table {
    margin: 1em auto;
    border: none;
}

.accordion-body table th,
.accordion-body table td {
    border: none;
    padding: 4px 0;
    text-align: center;
}

.accordion-body table img {
    display: block;
    margin: 0 auto;
}

.accordion-body table em {
    color: #666;
    font-size: 0.9em;
}

.accordion-body .research-publications {
    margin-top: 1.5em;
}

@media (max-width: 768px) {
    .accordion-header {
        padding: 0 6px 14px 116px;
        min-height: 78px;
    }
    .accordion-row.expanded .accordion-header {
        padding: 194px 14px 0;
        min-height: 180px;
    }
    .accordion-image-wrap {
        width: 100px;
        height: 64px;
    }
    .accordion-row.expanded .accordion-image-wrap {
        width: 100%;
        height: 180px;
    }
    .accordion-title-row {
        flex-wrap: wrap;
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
      if (row.classList.contains('animating')) return;

      var wasExpanded = row.classList.contains('expanded');

      rows.forEach(function (r) {
        if (r !== row) r.classList.remove('expanded');
      });

      row.classList.add('animating');

      setTimeout(function () {
        if (wasExpanded) {
          row.classList.remove('expanded');
        } else {
          row.classList.add('expanded');
        }
      }, 210);

      setTimeout(function () {
        row.classList.remove('animating');
      }, 700);
    });
  });
})();
</script>
