---
layout: post
title: BugDedupe writeup
tags: machine learning
---

## Introduction

I'm a stats/ML guy who does a lot of number crunching in Python
(Numpy/sklearn/SciPy). I've been wanting to learn more about the whole Python
stack, and particularly web dev, so I decided to try to write a web app that
would combine my stats skills and Python. I did some research in my
undergrad that I had kicking around, so I thought I'd turn that into a tool that
people could use. I was able to recruit a friend of mine from university to
help.

Except for the HTML/CSS/Javascript needed to run the frontend, everything was in
Python, so I thought I'd do a writeup of how I built/designed the app for
r/Python to get feedback and share what I learned.

The site is [www.BugDedupe.com](http://www.bugdedupe.com), and it's a web app
that uses machine learning to help you find and merge duplicate bug reports on
Github.

## Background:

I did some [research](http://finbarr.ca/dedup/) in my undergrad for a machine
learning class that I took. I worked with a team to develop an automated method
of predicting whether or not two bug reports are duplicates of each other. We
did this by analysing the text of the bug report and comparing it to each other,
and to reference texts (e.g. we had bug reports for a Java project, and we
compared them to different chapters of a Java textbook to get subject scores---
this report is 30\% cryptography and 45\% networking). This gave us a number
of features that we could run through a machine learning classifier. We used a
number of different ones and got really high results--- 97\%. You can see the
results in the above link, in the two papers that we published.

I've been trying to constantly get better at programming as that's been the
most useful skill I've developed as part of my career. At my day job, I do a lot
of statistical analysis and machine learning. I thought that I could combine the
two, and create a ML-driven SaaS app.

## Layout

At the start of the project, I was pretty confused about how to develop the app.
I had a few objectives:

1. I wanted to make sure that I could easily recover from disaster. We recently
had a flood at work, and that spooked me.
2. I wanted to avoid complexity (like everyone). I've been bitten by codebases
that slowly grow hairier and hairier over time, and I wanted to try and avoid
that as much as possible.

I've been a fan of functional programming for a long time, and decided to use
that hear. John Carmack had a post strongly arguing for functional programmming
[1], and who am I to argue with John Carmack? Jokes aside, I've had nasty
experiences with object-oriented codebases that have grown warts over time, and
I'm a bit shy of hidden state as a result, so I like to make state as clear as
possible in my code.

In that light, I decided to use a stateless architecture for the app. All of the
state of the app (users, data, etc.) would be stored in the MySQL database, and
the server would exist only to render it onto the web; similarly, the
machine learning processes would interact uniquely with the database. If, god
willing, we run into scaling problems, this will also allow us to focus only on
optimizing the specific parts that are bottlenecking our performance, as
everything is logically separated.

## Hosting

I've been using Docker at work and like it a lot. I decided to encapsulate each
separate component in a container, and run them on Google Cloud Platform, as
I like what Google's doing with [Kubernetes](https://kubernetes.io/). Once I
had the components in Docker, it was straightforwardt to launch them on Google
Container Engine.

## Conclusion

While some things surprised me (particularly the latency of Stormpath), overall,
I'm extremely happy with how the stateless architecture worked. It managed to
reduce complexity significantly, so that I only had to think about how the
current component interacted with the database, instead of having to worry about
how it fit in with all of the other components of the stack.

I'm also quite happy with kubernetes. It sucked (a lot) getting started with it,
but since then, I've had very few devops problems. We'll see if that becomes a
problem as we (hopefully) get more users.

[1]: https://www.reddit.com/r/programming/comments/3ejsyq/john_carmack_why_functional_programming_is_the/
