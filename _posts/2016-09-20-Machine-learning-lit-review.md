---
layout: post
title: Machine Learning Literature Review
tags: economics
---

I read a lot of papers on machine learning. I'm going to conitnually update
this post with notes I make on each of the papers.

## [XGBoost: A Scalable Tree Boosting System](http://arxiv.org/abs/1603.02754)

### Abstract

Tree boosting is a highly effective and widely used machine learning method. In
this paper, we describe a scalable end-to-end tree boosting system called
XGBoost, which is used widely by data scientists to achieve state-of-the-art
results on many machine learning challenges. We propose a novel sparsity-aware
algorithm for sparse data and weighted quantile sketch for approximate tree
learning. More importantly, we provide insights on cache access patterns, data
compression and sharding to build a scalable tree boosting system. By combining
these insights, XGBoost scales beyond billions of examples using far fewer
resources than existing systems.

### Notes

A lot of the notes are taken from XGBoost's
[tutorial](http://xgboost.readthedocs.io/en/latest/model.html).

Gradient Boosting is a ML technique that takes a number of weak leearners and
combines them into a single strong learner. Gradient Boosted Trees are a subset
of the general problem that applies gradient boosting to trees. XGBoost uses
tree ensembles, which are sets of classification and regression trees (CART).
In a CART model, we create a series of trees that split the sample based on
their features into different leaves, and assign each leaf a different score.

![](images/xgboost-twocart.png)

The trees try to complement each other. The complexity of the trees are defined
as $\Omega(f) = \gamma T + \frac{1}{2} \lambda \sum_{j=1}^T w_j^2$, where
$w_j$ is the weight of each leaf, and $T$ is the number of leaves.

XGBoost implements this algorithm and has been particularly successful, being
used in many successful Kaggle competitions. XGBoost is extremely fast due to
a series of algorithmic tricks. The paper reviews these tricks.

## [Safe and Efficient Off-Policy Reinforcement Learning](https://arxiv.org/abs/1606.02647)

### Abstract

In this work, we take a fresh look at some old and new algorithms for
off-policy, return-based reinforcement learning. Expressing these in a common
form, we derive a novel algorithm, Retrace(λ), with three desired properties:
(1) low variance; (2) safety, as it safely uses samples collected from any
behaviour policy, whatever its degree of "off-policyness"; and (3) efficiency,
as it makes the best use of samples collected from near on-policy behaviour
policies. We analyse the contractive nature of the related operator under both
off-policy policy evaluation and control settings and derive online sample-based
algorithms. To our knowledge, this is the first return-based off-policy control
algorithm converging a.s. to Q∗ without the GLIE assumption (Greedy in the Limit
with Infinite Exploration). As a corollary, we prove the convergence of Watkins'
Q(λ), which was still an open problem. We illustrate the benefits of Retrace(λ)
on a standard suite of Atari 2600 games.

### Notes

In reinformcement learning, Q-learning is a technique that is commonly used. In
it, a Q-function is defined which returns the discounted expected value for each
state. The Q-function is updated with each iteration:

$$
Q(s_t, a_t) = Q(s_t, a_t) + \alpha \cdot (r_{t+1} + \gamma \cdot \max_a Q(s_{t+1}, a) - Q(s_t, a_t)),
$$

where $r_{t+1}$ is the reward observed after performing $a_t$ in $s_t$, and
where $\alpha_t(s, a) \in (0, 1]$ is the learning rate.

In reinforcement learning, there is a trade-off in the definition of the update
target: should one estimate Monte Carlo returns or bootstrap from an existing
Q-function? Return-based methods are better behaved when combined with function
approximation, and quickly respond to exploration, but bootstrap methods are
easier to apply to off-policy data.

An off-policy learner learns the value of the optimal policy independently of
the agent's actions. An on-policy learner learns the value of the policy being
carried out by the agent. This paper shows that learning from returns can be
consistent with off-policy learning.

## [Sim-to-Real Robot Learning from Pixels with Progressive Nets](https://arxiv.org/abs/1610.04286)

### Abstract

Applying end-to-end learning to solve complex, interactive, pixel-driven control
tasks on a robot is an unsolved problem. Deep Reinforcement Learning algorithms
are too slow to achieve performance on a real robot, but their potential has
been demonstrated in simulated environments. We propose using progressive
networks to bridge the reality gap and transfer learned policies from simulation
to the real world. The progressive net approach is a general framework that
enables reuse of everything from low-level visual features to high-level
policies for transfer to new tasks, enabling a compositional, yet simple,
approach to building complex skills. We present an early demonstration of this
approach with a number of experiments in the domain of robot manipulation that
focus on bridging the reality gap. Unlike other proposed approaches, our
real-world experiments demonstrate successful task learning from raw visual
input on a fully actuated robot manipulator. Moreover, rather than relying on
model-based trajectory optimisation, the task learning is accomplished using
only deep reinforcement learning and sparse rewards.

### Notes
