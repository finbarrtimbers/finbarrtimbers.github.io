---
layout: post
title: Incremental Gradient, Subgradient, and Proximal Methods for Convex Optimization
tags: papers machine-learning
---

## [Abstract](http://www.mit.edu/~dimitrib/Incremental_Survey_LIDS.pdf)

We survey incremental methods for minimizing a sum $$\sum_{i=1}^m f_i(x)$$
consisting of a large number of convex component functions $$f_i$$. Our methods
consist of iterations applied to single components, and have proved very
effective in practice. We introduce a unified algorithmic framework for a
variety of such methods, some involving gradient and subgradient iterations,
which are known, and some involving combinations of subgradient and proximal
methods, which are new and offer greater flexibility in exploiting the special
structure of $$f_i$$. We provide an analysis of the convergence and rate of
convergence properties of these methods, including the advantages offered by
randomization in the selection of components. We also survey applications in
inference/machine learning, signal processing, and large-scale and distributed
optimization.

## Notes

This is a general *theory* paper on convex optimisation, with one of the example
applications being machine learning. Convex optimisation covers a large class of
optimisation techniques, of which ML (and DL) is a small subset (albeit an
important one). As such, this is naturally going to be more interesting to
theorists.


The paper is concerned about solving the problem

$$ \min_{x \in X} \sum \limits_{i=1}^m f_i(x)$$

where $$\{f_i\}_{i \in 1...m}$$ is a set of real-valued functions, and $X$
is a closed convex set (a convex set is a set that's approximately spherical,
and a closed set is one that contains all limit points; e.g. (-3, 3) is an open
set, while [-3, 3] is a closed set, and [-3, 3) and (-3, 3] are neither open nor
closed). When $$m$$ is large, it usually makes sense to use incremental
techniques, like SGD, that focus on individual components, as they don't require
us to evaluate the entire cost function, which can be expensive.
