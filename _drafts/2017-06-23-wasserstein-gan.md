---
layout: post
title: Wasserstein GAN
tags: papers machine-learning
---

## [Abstract](https://arxiv.org/abs/1701.07875)

We introduce a new algorithm named WGAN, an alternative to traditional GAN
training. In this new model, we show that we can improve the stability of
learning, get rid of problems like mode collapse, and provide meaningful
learning curves useful for debugging and hyperparameter searches. Furthermore,
we show that the corresponding optimization problem is sound, and provide
extensive theoretical work highlighting the deep connections to other distances
between distributions.

## Notes

This paper is focused on Generative Adversarial Networks (GANs).
This is a problem as

## Conclusions

Strong paper, effectively lays out how training deep networks can be scaled
effectively. This sort of yeoman's work is needed in the field.

Concerns:

1. Continues the trend of papers that rely on resources only available at a
handful of industrial labs. No academic researcher that's not affiliated with
a large tech company would be able to muster the 256 GPUs required to reproduce
this work.

2. The amount of proprietary code required for this is a bit insane; you have to
have an infrastructure that can support the communication between GPUs required
here. Similar to my first point. Reproducibility suffers.

[1]: https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks
[2]: https://github.com/mozilla/DeepSpeech/issues/630
