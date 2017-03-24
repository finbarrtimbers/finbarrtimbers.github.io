---
layout: post
title: Useful Bash One-liners
tags: bash
---


I have a file in my home folder that contains Bash oneliners that I use
regularly (I'm a huge nerd, naturally).  I found most of them elsewhere online;
I wrote very few of these from scratch.

## Download a page and all linked pages/documents:

Download `$PAGE` and all linked pages/documents, to a depth of `$NUM`:

    $ wget -r "$NUM" "$PAGE"

e.g.

    $ wget -r 1 \
        https://courses.cs.washington.edu/courses/cse455/14au/notes/

If you only want PDF files (e.g. if you're downloading course notes), then you
can add the flag `---accept "*.pdf"`

Taken from [Stack Overflow](http://superuser.com/questions/274414/how-to-save-all-the-webpages-linked-from-one).


## Recursively unrar files

You can replace `unrar e` with any other command as well (e.g. `unzip`).

    $ find ./ -name '*.rar' -execdir unrar e {} \;

As a data scientist, I often get a dump of data from a client. This command lets
me process them all at once.

## Turn white backgrounds transparent

I use this ALL THE TIME when I'm giving talks (particularly when I'm teaching). I
found it on the
[Imagemagick](http://www.imagemagick.org/discourse-server/viewtopic.php?t=12619)
forums.

    $ convert image.gif -transparent white result.gif (or use result.png)

Alternately, if the image has an off-white background:

    $ convert image.gif -fuzz XX% -transparent white result.gif

where the smaller the %, the closer to true white or conversely, the larger the
%, the more variation from white is allowed to become transparent.

## Diff contents of two folders

Checks which files are different between the folders `dir1` and `dir2`. I've
used this to track down bugs when I'm installing our software on client sites
to make sure that their data is exactly the same as my copy of it.

    $ diff -qr dir1 dir2

You can also use some sort of checksum by zipping up both folders and comparing
the results, e.g. with

    $ md5 dir1.zip
    $ md5 dir2.zip
