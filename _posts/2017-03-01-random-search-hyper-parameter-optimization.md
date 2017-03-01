---
layout: post
title:Random Search for Hyper-Parameter Optimization
tags: machine learning statistics papers
---

# [Abstract](http://www.jmlr.org/papers/volume13/bergstra12a/bergstra12a.pdf)

Grid search and manual search are the most widely used strategies for hyper-parameter optimization.
This paper shows empirically and theoretically that randomly chosen trials are more efficient
for hyper-parameter optimization than trials on a grid. Empirical evidence comes from a comparison
with a large previous study that used grid search and manual search to configure neural networks
and deep belief networks. Compared with neural networks configured by a pure grid search,
we find that random search over the same domain is able to find models that are as good or better
within a small fraction of the computation time. Granting random search the same computational
budget, random search finds better models by effectively searching a larger, less promising con-
figuration space. Compared with deep belief networks configured by a thoughtful combination of
manual search and grid search, purely random search over the same 32-dimensional configuration
space found statistically equal performance on four of seven data sets, and superior performance
on one of seven. A Gaussian process analysis of the function from hyper-parameters to validation
set performance reveals that for most data sets only a few of the hyper-parameters really matter,
but that different hyper-parameters are important on different data sets. This phenomenon makes
grid search a poor choice for configuring algorithms for new data sets. Our analysis casts some
light on why recent “High Throughput” methods achieve surprising success—they appear to search
through a large number of hyper-parameters because most hyper-parameters do not matter much.
We anticipate that growing interest in large hierarchical models will place an increasing burden on
techniques for hyper-parameter optimization; this work shows that random search is a natural baseline
against which to judge progress in the development of adaptive (sequential) hyper-parameter
optimization algorithms.

# Summary

## Introduction

A learning algorithm $\mathcal{A}$ can be thought of as a functional (a function
that operates on functions) that maps a data set $\mathcal{X}^{\text{train}}$ to
a function $f$. We can think of $\mathcal{A}$ as a function itself, and write
it as $\mathcal{A}(\mathcal{X}^{\text{train}}, \lambda)$, where $\lambda$ is a
vector of so-called "hyper-parameters", which change how the algorithm operates.
An example is $\alpha$, the $L_1$ penalty in
[Lasso](http://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Lasso.html).
Finding $\lambda$ is called the "hyper-parameter optimization problem", which
consists of finding $\lambda^\star$ that minimizes the expected error of the
algorithm over the set of all possible training sets. Said expected error
cannot be characterized, and as a result, solutions to the hyper-parameter
optimization problem take two forms:

1. The manual approach, where a researcher tries a number of different
parameters and uses the best one.

2. Grid search, where all of the different combinations of parameters are tried.

Approach 2 is guaranteed to find the optimal combination, but it is extremely
computationally expensive, growing at a rate of O($p^n$), where $p$ is the
number of different values each parameter can take, and $n$ is the number of
different parameters. Typically, manual search is used to minimize the number
of possible values that each parameter can take, and then a grid search is
performed over the remaining values.

Manual search has advantages and disadvantages; on the one hand, it can work
well, and it can give researchers insight into how the algorithm works. On the
flip side, it's not reproducible, and has no guarantee of success, particularly
in higher dimension spaces.

Consequently, the authors present a randomized variant of grid search that
randomly searches the space of all possible hyper-parameters. Random search
ends up being more practical than grid search as it can be applied using a
cluster of unreliable computers, and new trials can easily be added to the
search as all trials are i.i.d.

## Random vs. Grid for neural networks

This part of the paper is heavily inspired by Larochelle (2007) [1].
The authors use a variety of classification datasets, including a number of
variants of MNIST, to perform hyper-parameter optimization on a series of
neural networks.The authors note that the variation of the hyper-parameter
optimization varies significantly with the datasets; for MNIST basic,
experiments with 4 or 8 trials often had the same performance as much bigger
trials, while even with 16 or 32 trials, MNIST rotated background images were
still exhibiting significant variation.

The authors use these results to note that in many cases, the effective
dimensionality of $\psi$ ,the hyper-parameter space, is much lower than the
possible dimensionality of $\psi$. In other words, many of the parameters only
have a small number of possible values that are useful.

## Random vs. sequential manual optimization

The authors discuss an experiment by [1] comparing randomized grid search with having a
researcher conduct a sequential manual search. The authors quote [1] on how to
effectively conduct sequential manual optimization, which is quite insightful.
The setting used in the experiment is one with 32 different hyper parameters,
which, if each parameter had two possible values, would create a parameter space
with $2^32$ members- far too large to evaluate with a grid search. In the
experiment, random search performed well, but not as well as with the neural
networks, finding a better model than manual search in 1 data set, an equally
good model in 4 data sets, and an inferior model in 3 data sets.

## Conclusion

The authors suggest using randomized search instead of grid search in almost
every scenario, noting that although more complicated approaches are better
(e.g. adaptive search algorithms), they're more complicated, while a randomized
grid search is a much cheaper way of evaluating more of the search space. The
randomized search, similar to the grid search, is trivially parallelizable, and
can be scaled much more rapidly than an adaptive search, and can stopped,
started, and scaled without difficulty.

# Comments

The paper makes a lot of sense, and I'm persuaded to swap out grid search for a
randomized search in my own work. I'd like to see some sort of sequential
randomized grid search that works iteratively, alternating between performing a
randomized grid search over a subset of the parameter space, and then selecting
a new, smaller subset to search over (in effect, performing gradient descent
over the parameter space). Perhaps that exists and I need to find a paper
discussing that.

[1]: https://dl.acm.org/citation.cfm?id=1273556
