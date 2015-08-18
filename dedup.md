# Detecting duplicate bug reports with contextual knowledge
## Introduction

Previous work done by Alipour et al. came up with a methodology for detecting
duplicate bug reports by comparing the unstructured text of the bug reports to
subject-specific contextual material. Our first paper used lists of
software-engineering terms, such as non-functional requirements and architecture
keywords; our second paper used more abstract levels of context, using domain
and project-specific context as well. 

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

The code is on [Github](https://github.com/timbers/dedup); it is currently
messy, and I am in the process of making it more presentable.

## Bibliography

[K. Aggarwal, T. Rutgers, F. Timbers, A. Hindle, R. Greiner, E. Stroulia. "Detecting Duplicate Bug Reports with Software Engineering Domain Knowledge". IEEE International Conference on Software Analysis, Evolution, and Reengineering, January 2015.](http://papersdb.cs.ualberta.ca/~papersdb/view_publication.php?pub_id=1125)
