---
layout: post
title: Generative Adversarial Imitation Learning
tags: papers machine-learning
---

## [Abstract](https://arxiv.org/abs/1606.03476)

Consider learning a policy from example expert behavior, without interaction
with the expert or access to reinforcement signal. One approach is to recover
the expert's cost function with inverse reinforcement learning, then extract a
policy from that cost function with reinforcement learning. This approach is
indirect and can be slow. We propose a new general framework for directly
extracting a policy from data, as if it were obtained by reinforcement learning
following inverse reinforcement learning. We show that a certain instantiation
of our framework draws an analogy between imitation learning and generative
adversarial networks, from which we derive a model-free imitation learning
algorithm that obtains significant performance gains over existing model-free
methods in imitating complex behaviors in large, high-dimensional environments.

## Notes

Imitation learning is a problem in which one learns to perform a task from
expert demonstrations--- a setting in which the learner is given samples and
outcomes from the expert, is not allowed to query the expert for more data,
and is not provided any sort of reinforcement signal.

Currently, there are two frameworks used to solve problems of this form:

1. Behavioral cloning (BC), where a policy is learned as a supervised learning
problem over state-action pairs that are derived from the samples created by
the expert, and
2. Inverse Reinforcement Learning (IRL), which finds a cost function where the
expert's actions are uniquely optimal.

However, there are problems with these approaches. BC requires large amounts of
data due to the "Covariate Shift" problem, where the distribution of the inputs
changes between the training and production stages of modelling. IRL does not
require as much data but is extremely computationally expensive.

However, the cost function learned from IRL does not explicitly tell the learner
how to act. The authors create an algorithm that amends this by directly
learning a policy, using techniques from Generative Adversarial Networks (GAN).

The authors do this by demonstrating that they can construct a reinforcement
learning (RL) setting in which the IRL problem is the dual of the RL problem.
As such, the solution to the primal RL problem is optimal, and is the same
solution as the solution one would get by recovering a policy from the IRL
cost function.

Moving from the IRL to the RL primal setting requires a series of assumptions,
which the authors go on to show are not particularly restrictive. The authors
use an apprenticeship learning (AL) framework to show this. The authors do this with
a two step algorithm. The algorithm alternates between sampling possible
trajectories for the policy by simulating the environment, and then optimizes
in that setting. This allows the AL framework to succeed, as AL requires a
convex space created as the convex hull over a linear combination of basis
functions; the basis functions are taken as the cost functions that result from
maximizing over the sampled points. However, this setting requires careful
tuning of the sampling procedure.

The authors remove the need for careful tuning by using a GAN setting to tune
the sampling automatically.
