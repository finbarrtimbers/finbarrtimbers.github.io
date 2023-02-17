---
layout: page
title: Bug report deduplication
permalink: /dedup/
---

## Introduction

Previous work done by [Alipour et al.](http://softwareprocess.es/a/bugdedup.pdf)
came up with a methodology for detecting duplicate bug reports by comparing the
unstructured text of the bug reports to subject-specific contextual
material. Our first paper used lists of software-engineering terms, such as
non-functional requirements and architecture keywords; our second paper used
more abstract levels of context, using domain and project-specific context as
well.

## Our method

When a bug report contains a word that is also contained in
the relevant contexts, the bug report is considered to be associated with that
context. We use a number of different textual comparison measures to formally
create a similarity measure that can be used to train machine learning
classifiers with high accuracy.

Our main contribution was to propose a method that partially automates the
extraction of the contextual word lists from the technical literature, bringing
down the number of hours required for a given level by two orders of magnitude
(from 30 hours down to half an hour) while suffering only a minor loss in
performance.

## Extension

We have an extension to our first paper currently under consideration for
publication. The extension shows that general software engineering features
(features based on the similarity to extremely general textbooks and
documentation) can be used to predict a large number of the duplicate reports
while being easily used across projects.

## Code

Our code is on [Github](https://github.com/timbers/dedup). It is currently
messy, and I am in the process of making it more presentable.

## References

[Anahita Alipour. A contextual approach towards more accurate duplicate bug report detection. Master’s thesis, University of Alberta, Fall 2013.](http://webdocs.cs.ualberta.ca/~hindle1/2014/anahita-alipour-thesis.pdf)

[Anahita Alipour, Abram Hindle, and Eleni Stroulia. A contextual approach towards more accurate duplicate bug report detection. In Proceedings of the Tenth International Workshop on Mining Software Repositories, pages 183–192. IEEE Press, 2013.](http://softwareprocess.es/a/bugdedup.pdf)

[K. Aggarwal, T. Rutgers, F. Timbers, A. Hindle, R. Greiner, E. Stroulia. "Detecting Duplicate Bug Reports with Software Engineering Domain Knowledge". IEEE International Conference on Software Analysis, Evolution, and Reengineering, January 2015.](http://softwareprocess.es/pubs/aggarwal2015SANER-dedup.pdf)
