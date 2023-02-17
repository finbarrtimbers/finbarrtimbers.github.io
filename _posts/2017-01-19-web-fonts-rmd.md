---
layout: page
title: Including web fonts in RMarkdown
tags: web html rmd rmarkdown R html markdown
---

I didn't see this anywhere online, so I thought I'd quickly write up how to add
web fonts to a RMarkdown presentation.

You have a RMarkdown presentation using ioslides:

```
---
title: "Best Presentation Ever"
author: "Finbarr Timbers"
date: "January 19, 2017"
output: ioslides_presentation
css: assets/styles.css
logo: assets/logo.png
incremental: true
widescreen: true
---
```

Create a file `header.html` including a link to the fonts you want to use in the
same folder as your RMarkdown document

```
<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
```

Then, add an `includes` section to the header of your RMarkdown document:

```
---
title: "Best Presentation Ever"
author: "Finbarr Timbers"
date: "January 19, 2017"
output:
    ioslides_presentation:
        includes: header.html
css: assets/styles.css
logo: assets/logo.png
incremental: true
widescreen: true
---
```

You're done! Should work properly.
