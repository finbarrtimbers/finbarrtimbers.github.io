---
layout: post
title: SqueezeNet: AlexNet-level accuracy with 50x fewer parameters and <0.5mb model size
tags: machine learning statistics papers
---

## [Abstract](https://arxiv.org/abs/1602.07360)

Recent research on deep convolutional neural networks (CNNs) has focused primarily
on improving accuracy. For a given accuracy level, it is typically possible
to identify multiple CNN architectures that achieve that accuracy level. With
equivalent accuracy, smaller CNN architectures offer at least three advantages: (1)
Smaller CNNs require less communication across servers during distributed training.
(2) Smaller CNNs require less bandwidth to export a new model from the
cloud to an autonomous car. (3) Smaller CNNs are more feasible to deploy on FPGAs
and other hardware with limited memory. To provide all of these advantages,
we propose a small CNN architecture called SqueezeNet. SqueezeNet achieves
AlexNet-level accuracy on ImageNet with 50x fewer parameters. Additionally,
with model compression techniques, we are able to compress SqueezeNet to less
than 0.5MB (510× smaller than AlexNet).
The SqueezeNet architecture is available for download here:
https://github.com/DeepScale/SqueezeNet

## Notes

THis is extremely important because communication between servers limits scaling
distributed NN training. *Small models train faster as they require less
communication*.

The authors downsize the models by employing three strategies:

1. Replace all 3 x 3 filters with 1 x 1 filters.

2. Decrease the number of input channels to the 3 x 3 filters by using
"squeeze layers."

3. Downsample late in the network so that convolution layers have large
activation maps.

It is obvious how the first two strategies decrease the model size (they
radically decrease the number of weights needed). The last one doesn't---
having large activation maps help the model have high classification accuracy
on a limited "budget" of parameters.

The "squeeze layer" the authors define is a convolution layer made of 1 x 1
filters. The authors use this to create a "Fire module" that is composed of two
layers: a squeeze layer, and an expand layer that has a mix of 1 x 1 and 3 x 3
convolution filters.

SqueezeNet is then composed of a convolution layer (conv1), 8 Fire modules
(fire2-9), and a convolution layer (conv10). SqueezeNet performs max-pooling with
a stride of 2 after layers conv1, fire4, fire8, and conv10, as per strategy 3.

SqueezeNet performs as well as AlexNet at the top-1 and top-5 levels, while
achieving a 50x reduction in size.

The authors then go on to discuss the metaparameters that can be used to create
similar squeeze layers.
