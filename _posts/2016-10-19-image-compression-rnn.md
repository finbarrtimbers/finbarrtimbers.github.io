---
layout: post
title: Full Resolution Image Compression with Recurrent Neural Networks
tags: papers machine-learning
---

### [Abstract](https://arxiv.org/abs/1608.05148)

This paper presents a set of full-resolution lossy image compression methods
based on neural networks. Each of the architectures we describe can provide
variable compression rates during deployment without requiring retraining of the
network: each network need only be trained once. All of our architectures
consist of a recurrent neural network (RNN)-based encoder and decoder, a
binarizer, and a neural network for entropy coding. We compare RNN types (LSTM,
associative LSTM) and introduce a new hybrid of GRU and ResNet. We also study
"one-shot" versus additive reconstruction architectures and introduce a new
scaled-additive framework. We compare to previous work, showing improvements of
4.3%-8.8% AUC (area under the rate-distortion curve), depending on the
perceptual metric used. As far as we know, this is the first neural network
architecture that is able to outperform JPEG at image compression across most
bitrates on the rate-distortion curve on the Kodak dataset images, with and
without the aid of entropy coding.

### Notes

It's been thought that neural nets should be good at image compression, but
there haven't been any results to indciate that this is true across a variety
of scenarios (i.e. with the exception of dedicated, one-off image compression
nets). A previous paper by one of the authors was able to do this, but only for
32 x 32 images. This paper tries to generalize that.

The authors use a three component architecture comprised of an encoding network
$$E$$, a binarizer $$B$$, and a decoding network $$D$$. The input images are
encoded, turned into binary, transmitted through the network, and then decoded.
The authors represent a single iteration of their network as:

$$
b_t = B(E_t(r_{t-1})), \hat{x}_t = D_t(b_t) + \gamma \hat{x}_{t-1}, r_t = x - \hat{x_t}, r_0 = x, \hat{x}_0 = 0,
$$

where $D_t$ and $E_t$ represent the decoder/encoder at iteration $t$. The model
thus becomes better and better with each iteration, and after $k$ iterations,
the model has produced $m \times k$ bits in total, where $m$ is a value
determined by $$B$$. Thus, by reducing the number of iterations needed, the
model can achieve smaller image sizes..

The encoder and decoder are RNNs, with two convolutional kernels. The authors
explored a number of different types of RNNs^[LSTMs, associative LSTMs, GRUs.],
and a number of different reconstruction frameworks^[One-shot reconstruction,
additive reconstruction, and residual scaling.]

The authors used two sets of training data:

- The data from the previous paper that contained 32x32 images, and
- A random sample of 6 million 1280x720 images on the web, decomposed into
non-overlapping 32x32 tiles, and samples the 100 tiles with the worst
compression ratio under PNG, with the goal of finding the "hard-to-compress"
data, theoretically yielding a better compression model.

They ran the model for 1 million epochs, and picked the models with the largest
area under the curve when both of their metrics are plotted against each other.
The best model was able to slightly beat JPEG. However, this doesn't do the
results justice, as the results are remarkably good, and look much better
than JPEG.

### RNNs

Three types explored here:

1. *LSTMs*: A RNN structure that contains LSTM blocks, which are network units
that can remember a value for an arbitrary length of time. A LSTM block contains
gates that determine when the input is significant enough to remember, when it
should continue to remember or forget the value, and when it should output the
value.

2. *Associative LSTMs*: Not clear. Need to read more.

3. *GRUs*: A LSTM that merges the forget and input gates into a single "update"
gate, making it simpler than LSTM models.


### Reconstruction frameworks

Three types explored here:

1. *One-shot Reconstruction*: a process in which the full image is predicted
after each iteration of the decoder. Each iteration has access to more bits,
which should allow for a better reconstruction.

2. *Additive Reconstruction*: each iteration tries to reconstruct the residual
from the previous iterations, making the final image the sum of all iterations.

3. *Residual Scaling*: the residual is scaled up over iterations to compensate
for the fact that the residual is supposed to decrease with each iteration.

## Entropy Coding
