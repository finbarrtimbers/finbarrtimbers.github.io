---
layout: post
title: Attention is all you need
tags: papers machine-learning
---

## [Abstract](https://arxiv.org/abs/1706.03762)

The dominant sequence transduction models are based on complex recurrent or
convolutional neural networks in an encoder-decoder configuration. The best
performing models also connect the encoder and decoder through an attention
mechanism. We propose a new simple network architecture, the Transformer, based
solely on attention mechanisms, dispensing with recurrence and convolutions
entirely. Experiments on two machine translation tasks show these models to be
superior in quality while being more parallelizable and requiring significantly
less time to train. Our model achieves 28.4 BLEU on the WMT 2014
English-to-German translation task, improving over the existing best results,
including ensembles by over 2 BLEU. On the WMT 2014 English-to-French
translation task, our model establishes a new single-model state-of-the-art BLEU
score of 41.0 after training for 3.5 days on eight GPUs, a small fraction of the
training costs of the best models from the literature. We show that the
Transformer generalizes well to other tasks by applying it successfully to
English constituency parsing both with large and limited training data.

## Notes

This paper is focused on .
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
