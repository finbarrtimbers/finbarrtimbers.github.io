---
layout: post
title: How I designed my machine learning app
tags: machine learning
---

## Introduction

Approximately ten thousand years ago, during undergrad, I made what was probably
the best decision of my academic career and took
[Russ Greiner's](https://webdocs.cs.ualberta.ca/~greiner/) CMPUT 466 class at
the University of Alberta. As a math major, it took some convincing to let the
CS department allow me into the course, as I was missing approximately every
prerequisite for the class, but convince them I did, and I was introduced to the
body of techniques known as machine learning. The course required me to complete
a group project, and my group worked on the problem of bug report deduplication.

## Inspiration

Managing the flood of bug reports that pour in is a problem for any sizable
software project. Android has some
[53 636](https://code.google.com/p/android/issues/list?num=100&start=0)  bug
reports as of the time of writing, and if you search "bug report triage" in
[Google Scholar](https://scholar.google.ca/scholar?q=bug+report+triage&btnG=&hl=en&as_sdt=0%2C5),
you get almost 4000 results for academic work. The cost of managing bug reports
is huge, too--- if each bug report takes a quarter of an hour to administer (read,
compare to previous bug reports, link them, and assign to a developer), then the
Android community has spent 13 409 hours, or 32 work years managing bug reports.
That ignores the number of internal bug reports that Google's QA staff would
have found and reported. If we assume a typical Software Engineer costs
$100 000 annually, that's $3.2 million that the Android community has dedicated
to bug triage.

The [project](http://finbarr.ca/dedup/) that my team worked on focused on
analysing the text of the bug reports and using features generated from those to
classify the bug reports. We developed a series of features that used reference
material (textbooks, manuals, documentation) to create subject specific word
lists, from which we generated numerical comparison scores. From this, we were
able to get a series of subject scores (e.g. Android security: 0.2). The work
proved remarkably successful, almost matching the performance of word lists that
were manually extracted. With very little tuning, we were able to correctly
classify 97% of bug reports, and I suspect that with some modelling effort
(hyperparameter optimization, investigating some more complicated models) that
could be improved on.

That was several years ago. The code that performed the bug report deduplication has
been sitting around on Github for a few years, untouched. It seemed to me that
bug report deduplication was a problem with a clear solution that hadn't been
implemented by anyone. I've been looking for a side project to do that will let
me learn more about product development and deploying machine learning in
production environments, instead of just academic experimental settings, so I
took it upon myself to turn the academic code into a web app. I was able to
recruit a few of my friends to help, and we built
[BugDedupe](http://www.bugdedupe.com). It's still in a very early stage, so I'm
looking for feedback and feature requests. The goal is to have the site be free
for open source repositories and small (private) side projects, charging larger
repositories to recoup my costs. If you have feedback or feature requests, or
just want to chat, shoot me an email at finbarrtimbers@gmail.com.

When I started building BugDedupe, I hadn't seen many posts about how teams
designed their machine learning web apps, so I wanted to write about how we
approached ours, to get feedback and to help others doing the same.

## Myself

I'm a stats/ML guy who does a lot of number crunching in Python at my day job
(Numpy/sklearn/SciPy). I've been wanting to learn more about the whole Python
stack, and particularly web dev, so that I can learn how to make products from
end-to-end. As a consultant, I get all of my projects to the MVP stage and then
have to start again on the next one for a new client. I wanted to work on
something that I could polish and grow, and given my stats background,
BugDedupe seemed like a great opportunity.

## Background:

We developed an automated [method](http://finbarr.ca/dedup) of predicting
whether or not two bug reports are duplicates of each other. We did this by
analysing the text of the bug report and comparing it to each other, and to
reference texts (e.g. we had bug reports for a Java project, and we compared
them to different chapters of a Java textbook to get subject scores--- allowing
us to say that a given report is 30\% cryptography and 45\% networking). This
gave us a number of features that we could run through a machine learning
classifier. We used a number of different ones and got really high results---
97\%. The method worked, and we tested it on real world data--- the bug reports
from Android, and Eclipse, among others. The only remaining problem was figuring
out how to make the service available online.

## Layout

At the start of the project, I was pretty confused about how to develop the
site. I've been a fan of functional programming for a long time, and try to
develop all of my projects in a functional manner.In that light, I decided to
use a stateless architecture for the app. All of the state of the app (users,
data, etc.) would be stored in the MySQL database, and the server would exist
only to render it onto the web; similarly, the machine learning processes would
interact uniquely with the database. As a result, we can have anything except
the database crash at any time, and we won't lose any data. The database is
regularly backed up, and as we're using Google Cloud SQL, it's in good hands.
If, god willing, we run into scaling problems, we feel that our architecture will
also allow us to focus only on optimizing the specific parts that are
bottlenecking our performance, as everything is logically separated.

## Hosting

I've been using Docker at work and like it a lot. I decided to encapsulate each
separate component in a container, and run them on Google Cloud Platform, as
I like what Google's doing with [Kubernetes](https://kubernetes.io/). Once I
had the components in Docker, it was straightforwardt to launch them on Google
Container Engine.

I found it surprisingly easy. It sucked getting started, but now that
everything's set up, it's super easy to work with, and kubernetes makes a lot of
the administrative tasks go away (e.g. managing secrets/environment variables,
restarting Python, scaling).

## Conclusion

While some things surprised me (particularly the latency of APIs- I was using
Stormpath for authentication, and it started adding up to 6 seconds per
request), overall, I'm extremely happy with how the program turned out. I think
that having everything interact only with the database and itself managed to
reduce complexity significantly, so that I only had to think about how the
current component interacted with the database, instead of having to worry about
how it fit in with all of the other components of the stack. The test now is to
get more users, and see how we perform at scale. The more users we get, the
more accurate our classifier will be, and the more useful our service will be,
so we need to get that flywheel rolling as fast as we can.

If you found this useful, or if you have any feedback, please send me an email
at finbarrtimbers@gmail.com. I'd love to hear what you think of our
architecture.
