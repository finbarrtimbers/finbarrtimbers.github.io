---
layout: post
title: [1709.01507] Squeeze-and-Excitation Networks
tags: hardware deep learning
---

[Paper](https://arxiv.org/abs/1709.01507)

# Overview

The paper got a lot of attention as it won ILSVRC 2017. I was surprised to see
no Google employees as coauthors- they've been dominant historically in the
ILSVRC competitions.

The paper presents a new way to modify convolutional networks by focusing on
channels and their dependencies. The work on based on recent results, such
as the Inception architectures, that have demonstrated that including multiple
learning mechanisms (i.e. layers) that work on different spatial scales improves
performance.

The Squeeze-and-Excitation Networks (SEN networks) work by implementing a seires
of blocks composed of a Squeeze operation, which learns a description of the
channel, influence an Excitation operation, where each channel gets a different
output depending on the description. This is then composed with more layers
similar to the traditional deep network.

## Details

Effectively, they create a squeeze block as a means of attempting to embed
global spatial information into a channel. They do this by calculating the
global average of the entire channel for each channel, to create a C dimensional
vector of real numbers, $z_c$. This vector is then used in a layer that is the
composition of a ReLU layer with a sigmoid layer:

$$
s = \sigma(W_2 \delta(W_1 z)),
$$

where $\sigma$ is a sigmoid activation, $\delta$ is a ReLU layer, and $W_i$ is
a standard weight matrix. The weight matrices are reduced dimensionality, and
the reduction ratio $r$ is a hyper-parameter which needs to be chosen
carefully. The output of the Excitation layer, $s$, is then used to scale the
preceding convolutional layer by channel-wise multiplication:

$$
\tilde{x} = s \cdot u,
$$

where is equal to $v * X$, X being the input, and v being the learned set of
convolutional filter kernels.

As a result, the SE layer is scaling the output of the convolutional layers to
incorporate global spatial information, choosing what to emphasize and
de-emphasize.

# Results

The authors achieve a (relatively) dramatic increase in SOTA for ILSVRC, going from a
previous best of 5.12%, to 4.47%.

# Conclusion

The results of the work make it interesting. My prior would have been that such
a mechanism wouldn't have worked--- it seems too simple. This makes me wonder if
there's some way that this can be used to product networks that are more robust
to adversarial perturbation.

The root cause of adversarial perturbations is that minor changes in the input
can lead to dramatic changes in the output. If this work can scale the outputs
of convolutional networks, it might be able to remove that propensity by noting
that the global state hasn't changed much.
