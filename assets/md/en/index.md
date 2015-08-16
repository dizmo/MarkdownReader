# Markdown Reader

<!-- ---------------------------------------------------------------------- -->

## <!-- Empty H2 -->

A general purpose documentation dizmo based on the [Markdown][1] notation.

[1]: https://daringfireball.net/projects/markdown

### Introduction
...

### Overview

| Subject | File(s) |
|-------------|------|
| MD content | assets/md/${LANGUAGE}/index.md |
| CSS styling | assets/css/{reader-base.css, reader.css} |
| JS actions | assets/js/hooks.js |
| Settings | assets/settings.js |

| Subject | Description |
|---------|-------------|
| Pagers | Next and previous buttons |
| MD headers | H1 and H2 peculiarities |
| TOC panel | Hiding of empty headers |
| Back side | URLs and CSS editor |

<!-- ---------------------------------------------------------------------- -->

## Contents

### Markdown: index.md
...
### Headers: H1 .. H5
...
### CSS styling: reader.css
...
### Next and previous pagers: #pager
...
### Actions: hooks.js
...
### TOC panel
...
### Configuration via settings.json
...
### URLs and CSS editor
...

<!-- ---------------------------------------------------------------------- -->

<div id="pager">
  <span id="pager-rhs" rel="next"></span>
  <span id="pager-lhs" rel="prev"></span>
</div>

<script src="assets/js/hooks.js">
