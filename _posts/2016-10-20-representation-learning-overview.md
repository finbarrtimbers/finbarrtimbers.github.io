---
layout: post
title: "Representation Learning: A Review and New Perspectives"
tags: papers machine-learning
---

### [Abstract](https://arxiv.org/abs/1206.5538)

The success of machine learning algorithms generally depends on data
representation, and we hypothesize that this is because different
representations can entangle and hide more or less the different explanatory
factors of variation behind the data. Although specific domain knowledge can be
used to help design representations, learning with generic priors can also be
used, and the quest for AI is motivating the design of more powerful
representation-learning algorithms implementing such priors. This paper reviews
recent work in the area of unsupervised feature learning and deep learning,
covering advances in probabilistic models, auto-encoders, manifold learning, and
deep networks. This motivates longer-term unanswered questions about the
appropriate objectives for learning good representations, for computing
representations (i.e., inference), and the geometrical connections between
representation learning, density estimation and manifold learning.

### Notes

Data representation is key to machine learning, and there are entire fields of
computer science dedicated to detecting features from data (e.g. computer
vision). Recent developments using convolutional network models [@zeiler2014]
have shown that convnets can automatically learn features from the data. This
automated feature detection is extremely powerful, and provides a lot of value.
To allow computers to better understand the world, it is important to figure out
how computers can learn optimal representations of the world.

The authors discuss desirable features for a given representation. These
include smoothness ($$x \approx y$$ should imply that $$f(x) \approx f(y)$$),
manifolds (i.e. detecting the relevant dimensions in high-dimensionality data),
sparsity, simplicity, and learning factors that help explain aspects of
variation, not one off factors. The authors discuss the curse of
dimensionality, namely that complication grows exponentially with the number
of dimensions, and so for a high-dimensionality object, it is exponentially
more difficult to learn a smooth representation when compared to a
lower-dimensionality object.

The paper focuses on how expressive certain representations are, comparing
models like RBMs, auto-encoders, and multi-layer neural networks to more
traditional algorithms like one-hot representations, Gaussian mixtures, and
nearest neighbour algorithms, discussing how the former can represent up to
$$O(2^k)$$ input regions using only $$O(N)$$ inputs, while the latter can
only represent $$O(N)$$ regions using $$O(N)$$ inputs. This is both good and
bad, as you can have representations that are too precise with some of the more
advanced representations.

Deep learning is discussed, focusing on how deep networks evolve their own
internal representation of the data.
