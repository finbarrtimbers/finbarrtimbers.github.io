---
layout: post
title: XGBoost: A scalable tree boosting system
tags: papers machine-learning
---

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
