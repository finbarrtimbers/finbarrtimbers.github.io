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

Turns out I can't, at least without killing one of my two calls to the APIs
that I use (Stripe's & Stormpath's).

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

I now download the Stripe Plan object as a dictionary, and store it in
`.pkl` format locally. I then read it in when necessary. This is effectively
free (tests had it taking <0.0001s). In production, I'll move this to using
a cache. I'll want to do the same thing in a few places:

1. The `repositories` object
2. The `issues_count` object

I can look at using something like `memcache`.

I added DNS settings, using Google's nameservers instead of the default:

    docker --dns 8.8.4.4 --dns 8.8.8.8

That took my code from 9.9s to 3.5s, a 64% decrease.

I then modified the `get_user_info` function, which provided all of the info
needed for every view in one function, into a number of separate functions for
each view, restricting the number of calls to the `user.custom_data` Stormpath
API. Streamlining my `get_user_*_info` functions reduced my time significantly,
taking the time for a call to 1.8s, a 48% decrease.

![](images/python_flask_call_graph_v3.png)

However, this didn't appear to affect the main bottlenecks identified
previously. My current bottlenecks are, totalling 83.62% (1.5s) of my execution
time:

1. `method 'read' of '_ssl._SSLSocket' objects` (49.30%, 1131x)
2. `method 'do_handshake' of '_ssl._SSLSocket' objects` (14.34%, 2x)
3. `_socket.getaddrinfo` (12.32%, 2x)
4. `method 'connect' of '_socket.socket' objects` (7.66%, 2x)

Notice that the number of `read` calls barely changed. Moving up the graph,
there are two main sources of `read` calls:

1. `get_repositories_data`
2. `user.save`

At a higher level, 97.15% of my time is spent in the `get_user_account_info`
(70.66%) and `get_plans` (26.49%) functions. As a result, I need to focus my
attention on those functions.

For `get_user_account_info`, 70.66% of my time equates to approximately 1.27s;
my next step will be to try to create a test that measures this directly so that
I can make it a regression test to detect when this is occurring in the future.

When it comes to `get_plans`, 26.49% of my time equates to 0.48s. I'll try to
do the same here.
