---
layout: post
title: Generative Adversarial Networks and Actor-Critic methods
tags: papers machine-learning
---

# [Connecting Generative Adversarial Networks and Actor-Critic Methods](https://arxiv.org/abs/1610.01945)

### Abstract

Both generative adversarial networks (GAN) in unsupervised learning and
actor-critic methods in reinforcement learning (RL) have gained a reputation for
being difficult to optimize. Practitioners in both fields have amassed a large
number of strategies to mitigate these instabilities and improve training. Here
we show that GANs can be viewed as actor-critic methods in an environment where
the actor cannot affect the reward. We review the strategies for stabilizing
training for each class of models, both those that generalize between the two
and those that are particular to that model. We also review a number of
extensions to GANs and RL algorithms with even more complicated information
flow. We hope that by highlighting this formal connection we will encourage both
GAN and RL communities to develop general, scalable, and stable algorithms for
multilevel optimization with deep networks, and to draw inspiration across
communities.

### Notes

The paper discusses how similar Generative Adversial Networks are to
Actor-Critic methods, and how both methods are difficult to optimize.

GANs are models with two neural networks, one that generates images and one that
tries to classify images. The generator tries to best the classifier.

Actor-Critic methods are models from reinforcement learning in which a model
learns an action-value function $Q^\pi(s, a)$ that predicts the expected
discounted reward (the Critic), and a policy that is optimal for that value (the
Actor).

The paper shows how GANs can be constructed as an Actor-Critic model, and
discusses the strategies that can be used to optimize each type of model, with
the idea being that these strategies can be used to optimize the other type of
model.
