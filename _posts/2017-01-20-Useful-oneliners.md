---
layout: post
title: Useful Bash One-liners
tags: bash
---

The following are a handful of oneliners that I've consistently found useful.
I found most of them elsewhere online; I wrote very few of these.

## Download a page and all linked pages/documents:

Download `$PAGE` and all linked pages/documents, to a depth of `$NUM`:

`wget -r "$NUM" "$PAGE"`

e.g. `wget -r 1 https://courses.cs.washington.edu/courses/cse455/14au/notes/`

Taken from [Stack Overflow](http://superuser.com/questions/274414/how-to-save-all-the-webpages-linked-from-one).


## Recursively unrar files

You can replace `unrar e` with any other command as well (e.g. `unzip`).

`find ./ -name '*.rar' -execdir unrar e {} \;`

## Turn white backgrounds transparent

I use this all the time. I found it on the [Imagemagick](http://www.imagemagick.org/discourse-server/viewtopic.php?t=12619) forums.

`convert image.gif -transparent white result.gif (or use result.png)`

Alternately, if the image has an off-white background:

`convert image.gif -fuzz XX% -transparent white result.gif`

where the smaller the %, the closer to true white or conversely, the larger the
%, the more variation from white is allowed to become transparent.

## Diff contents of two folders

Checks which files are different between the folders `dir1` and `dir2`. I've
used this more times than I'd care to admit.

`diff -qr dir1 dir2`
