---
layout: page
title: Do deep networks generalise or just memorise?
tags: algorithms
---

There's a brilliant paper out of Google Brain [1] which claimed that DNNs just
memorise the training data, and a response [2], which claims that they don't.

In the paper, the authors randomly assigned labels to MNIST and were able to
train a few deep nets to convergence (specifically, Inception, AlexNet, and a
MLP). However, performance was statistically null on the test set, as one would
expect (they correctly predicted 10% of images, which is the same as if you
randomly picked a label). The conclusion was that deep nets do do some
memorisation.

However, in the same paper, the authors trained a linear model to predict MNIST
(with the true labels). The linear model had a 1.2% error, but took up 30GB of
memory. In comparison, AlexNet is roughly 250 MB in size. The linear model is
explicitly memorising the dataset, and it takes 30GB to do so, while AlexNet can
learn a similarly accurate model in <1% of the space (and something like
SqueezeNet [3] can do so in <0.5MB). As such, it seems pretty clear that there's
some true generalisation happening, as we're able to have a low error on 10 MB
of data (the size of MNIST) using 0.5MB of weights.

In the response paper [2], the authors showed that "DNNs trained on real data
learn simpler functions than when trained with noise data, as measured by the
sharpness of the loss function at convergence." They also showed that by using
better regularization, you can radically diminish performance on noise datasets
while maintaining performance on real datasets.

I'm persuaded that generalisation is happening, with the caveat that there's
some memorisation happening. The main test of the memorisation claim is that the
models are able to perform well on test sets, which goes against my prior; if
the models weren't learning *some* generalisation, I would expect that they
wouldn't be able to perform well when it came to testing.

[1]: https://arxiv.org/abs/1611.03530
[2]: https://openreview.net/pdf?id=rJv6ZgHYg
[3]: https://arxiv.org/abs/1602.07360
