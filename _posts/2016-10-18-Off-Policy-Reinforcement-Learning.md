---
layout: post
title: Off-Policy reinforcement learning
tags: papers machine-learning
---

# [Safe and Efficient Off-Policy Reinforcement Learning](https://arxiv.org/abs/1606.02647)

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
