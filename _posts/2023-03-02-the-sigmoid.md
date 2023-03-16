---
layout: page
title: "The Sigmoid: a metaphor for technological progress"
articles: True
math: True
---

I regularly reference the “s-curve”, or sigmoid, as a metaphor for progress. Here, I explain what I mean, so that I can just link to this post.

A common mathematical relationship in technology is the s-curve (or sigmoid curve). Mathematically:

$$
\text{sigmoid}(x) := \dfrac{1}{1 + e^{-x}} \equiv \dfrac{e^x}{e^x + 1}
$$

This is notable because it produces a curve that *looks like an s* ([source](https://en.wikipedia.org/wiki/Sigmoid_function)):

![The sigmoid curve](/static/images/sigmoid.png)

In particular, when x is small, this grows slowly, when x is not too big or not too small, it grows exponentially, and when x is large, it grows slowly. This is a common pattern with many technologies! We see slow progress at first, then it accelerates rapidly, and finally, as we begin to hit the limits of the technology, progress slows. Consider single-thread CPU performance. Initially, progress was slow as people figured out how to make them. Then, it grew exponentially for years, following Moore’s Law ([picture source](https://preshing.com/20120208/a-look-back-at-single-threaded-cpu-performance/)).

![Single-threaded CPU performance](/static/images/single-threaded-cpu-performance.png)

However, since around 2010, we haven’t seen a lot of improvements in single-thread CPU performance. That pattern- slow, fast, then slow- is what I mean when I talk about the s-curve in technology. And when I talk about entering the *saturating part of the s-curve*, I mean that we’re entering the region where progress is slowing down again.
