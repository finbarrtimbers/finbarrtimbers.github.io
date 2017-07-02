---
layout: post
title: "Outrageously Large Neural Networks: The sparsely-gated Mixture-of-Experts layer"
tags: papers machine-learning
---

## [Abstract](https://openreview.net/pdf?id=B1ckMDqlg)

The capacity of a neural network to absorb information is limited by its number of
parameters. Conditional computation, where parts of the network are active on a
per-example basis, has been proposed in theory as a way of dramatically increasing
model capacity without a proportional increase in computation. In practice,
however, there are significant algorithmic and performance challenges. In this
work, we address these challenges and finally realize the promise of conditional
computation, achieving greater than 1000x improvements in model capacity with
only minor losses in computational efficiency on modern GPU clusters. We introduce
a Sparsely-Gated Mixture-of-Experts layer (MoE), consisting of up to
thousands of feed-forward sub-networks. A trainable gating network determines
a sparse combination of these experts to use for each example. We apply the MoE
to the tasks of language modeling and machine translation, where model capacity
is critical for absorbing the vast quantities of knowledge available in the training
corpora. We present model architectures in which a MoE with up to 137 billion
parameters is applied convolutionally between stacked LSTM layers. On large
language modeling and machine translation benchmarks, these models achieve
significantly better results than state-of-the-art at lower computational cost.

## Notes

The paper centers around the fact that a neural net of size N requires O(N^2)
computations to execute, which is problematic, as the ability of the network to
learn data is roughly O(N). The authors propose a method to conduct conditional
computation, which is a process in which different parts of the network are
activated depending on the sample, thereby saving significant computational
effort.

Their results indicate that they achieved this- they achieve SOTA results on NMT
(WMT En -> Fr & En -> De, Wu et. al 2016) despite much less training (1/6th of
the time).

Effectively, the paper presents a way to produce strong models while
significantly reducing computational complexity.
