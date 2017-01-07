---
layout: post
title: Tuning Python Flask performance
tags: python flask performance
---

I am having speed issues with my Python Flask application. I currently have
9.9s request times; I want request times <1s.

I began by making a
few, simple changes to confirm with best practices:

1. I moved as many scripts as possible from CDNs to being hosted locally.
2. I minified all of my scripts & HTML.
3. I set Nginx to gzip every response.


I integrated the
Werkzeug profiler as so:

I then used [gprof2dot](https://github.com/jrfonseca/gprof2dot) to convert the
profiler outputs into a graph visualization, which is much easier to understand:

![](images/python_flask_call_graph_v1.png)

Looking at the graph, my performance hits are happening in a few places:

1. 61% of the program's time is spent in the `flask_login` stack, which ends up
being bottlenecked by the `_socket.getaddrinfo` function, which is called twice
and takes up 51.65% of the program's time.
2. The other bottleneck comes from the `overview` function itself, which takes
35.4% of the program's time. This breaks down into four subcalls:
    1. 16.46% of the time is spent in the `read` method of `_ssl._SSLSocket`
    objects, which is called a whopping 1134x. These calls come from the
    Github API scraping I do in the `get_repositories_data` and in the Stormpath
    API calls. Eliminating these calls will be a priority.
    2. The `get_total_bug_count` function, which is 13.87%. This ends up
    bottlenecked by the `connections:261.query` function, which runs the
    MySQL query that I've written. 13.87% equates to ~ms, which is similar to
    3. 4% of the time is spent initializing the MySQL connection, which I don't
    think I can do anything about.
    4. Another 4% is spent doing 2 SSL handshakes. I can reduce this by
    serving any assets from a CDN locally, but this is probably not worth my
    time.

Based on this, there seem to be two tasks for me to accomplish:

1. Speed up the `_socket.getaddrinfo` function call. As it only gets called
twice, I need to either eliminate the calls to the function, or find some way
to speed it up.
 2. Reduce the number of reads from the `_ssl._SSLSocket` objects.

The fastest code, is, of course, code that doesn't run. [Famously](https://lists.freebsd.org/pipermail/freebsd-current/2010-August/019310.html), "GNU grep is
fast because it avoids looking at every input byte," and "executes very few
instructions for each byte that it does look at."

As such, my first job will be to check if I can just not call the
`_socket.getaddrinfo` function calls.

I did this by changing the DNS settings. The change took N characters, and
consisted of adding `--dns 8.8.4.4 --dns 8.8.8.8` to my call to Docker to start
the container. That immediately took my request time down to 3.5s (3552ms).

Now, my call graph looks like this:

![](images/python_flask_call_graph_v2.png)

My bottlenecks, however, appear to be the same:

1. `method 'read' of '_ssl._SSLSocket' objects` (1139x, 37.41%)
2. `method 'do_handshake' of '_ssl.SSLSocket' objects` (16.32%)
3. `method 'connect' of '_socket.socket' objects` (6.34%)

These correspond to roughly the same amount of time. 37% of 3.55s is 1.31s,
while 16% * 9.9s is 1.58s, roughly equivalent. As a result, I can feel
reasonably confident that changing my DNS servers didn't affect the
`_ssl.SSLSocket` calls.

The calls to `read` are coming largely from `get_user_info`, my function
that returns the user's custom data from Stormpath. I'm going to try to have
that call the user less.
