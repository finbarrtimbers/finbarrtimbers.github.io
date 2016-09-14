---
layout: post
title: Useful One-liners
tags: bash
---

# Download a page and all linked pages/documents [1]:

Download `$PAGE` and all linked pages/documents, to a depth of `$NUM`:

`wget -r "$NUM" "$PAGE"`

e.g. `wget -r 1 https://courses.cs.washington.edu/courses/cse455/14au/notes/`

[1]: http://superuser.com/questions/274414/how-to-save-all-the-webpages-linked-from-one
