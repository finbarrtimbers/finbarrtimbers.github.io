---
layout: post
title: Unit tests don't detect errors- they make you write down your assumptions
tags:
---

I've been fighting with recurring errors the whole time I've been working on
[BugDedupe](http://www.bugdedupe.com). I keep changing some aspect of the
frontend, and inadvertently break the site. The way to prevent this, of course,
is by using unit tests. I know that I should have unit tests, and I do, but not
at anywhere near the coverage that I need (I'm currently at 31% code
coverage).

The reason for the abysmal amount of code coverage is that I don't know how to
write the tests that I need. For instance, to test that BugDedupe is merging
rows correctly, I need to:

1. Set up a test database.
2. Set up a test Github account.
3. Mock the `POST` request for Flask.
4. Figure out how Flask's app environments work so that I can get the correct
   context for `flask.g` and the `user` objects that are used throughout the routes.
   `flask.g` and `user` are objects that can be called at any point in the application
   context for Flask without you having to explicitly set `user = ...`. This is
   good- it makes it really easy to use them- but it's bad as I don't *really*
   know how they work.

The reason I've been avoiding writing the tests is that it's really difficult
to write tests when you don't know *exactly* what your code is doing, and you
don't have a clear understanding of how the framework you're using works.
However, it turns out that it's really difficult to write code that works
correctly when you don't have a clear understanding of how your framework works.
So I'm taking the time to figure out exactly what's going on, and so far, it's
definitely been worth it.

For instance, I found out how `flask.g` works- it turns out that Flask creates
multiple [contexts](http://flask.pocoo.org/docs/0.12/appcontext/) that store
data that are needed on a per-request basis. `flask.g` stores data on the
application context, so it makes data available to different functions
during one request. It's effectively a super-global variable. You can't just use
a global variable to replace `flask.g` as then it would break in threaded
environments, which are necessary when you're trying to serve many users. That's
cool. I wouldn't have learned that today if I hadn't been writing unit tests
that needed to call `flask.g` and store data there. I would only have learned it
when I introduced some nasty bug.

In short, if you don't know exactly what's going on in your code, then you
should write some unit tests and formalize your knowledge.
