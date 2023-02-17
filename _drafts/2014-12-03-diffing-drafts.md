---
layout: post
title: Diffing PDFs for free- easy, right?
tags: open source C++ 
--- 

- tried diffing text documents from pdftotext, no luck 
- tried to use script from [stack overflow](http://askubuntu.com/questions/40813/diff-of-two-pdf-files)
- realised: code is on [Github](https://github.com/vslavik/diff-pdf)!
- offset isn't working- how to fix?
- change definition of constant.
- appears in three places- which one? (Lazy, didn't want to read all code)
- compiled: no luck. But wait... I forgot to change the symlink! Success!
- use binary search to narrow down proper offset
