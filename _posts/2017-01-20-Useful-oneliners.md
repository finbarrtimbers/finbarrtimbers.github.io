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


# Recursively unrar files


`find ./ -name '*.rar' -execdir unrar e {} \;`

# Turn white backgrounds transparent

Source: http://www.imagemagick.org/discourse-server/viewtopic.php?t=12619

`convert image.gif -transparent white result.gif (or use result.png)`


`convert image.gif -fuzz XX% -transparent white result.gif`

where the smaller the %, the closer to true white or conversely, the larger the %, the more variation from white is allowed to become transparent.

# Diff contents of two folders

Checks which files are different

`diff -qr dir1 dir2`
