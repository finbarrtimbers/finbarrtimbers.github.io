---
layout: page
title: "Accurate, Large Minibatch SGD: Training ImageNet in 1 Hour"
tags: papers machine-learning
---

## [Abstract](https://research.fb.com/wp-content/uploads/2017/06/imagenet1kin1h5.pdf?)

Deep learning thrives with large neural networks and large datasets. However,
larger networks and larger datasets result in longer training times that impede
research and development progress. Distributed synchronous SGD offers a
potential solution to this problem by dividing SGD minibatches over a pool of
parallel workers. Yet to make this scheme efficient, the per-worker workload
must be large, which implies nontrivial growth in the SGD minibatch size. In
this paper, we empirically show that on the ImageNet dataset large minibatches
cause optimization dif- ficulties, but when these are addressed the trained
networks exhibit good generalization. Specifically, we show no loss of accuracy
when training with large minibatch sizes up to 8192 images. To achieve this
result, we adopt a linear scaling rule for adjusting learning rates as a
function of minibatch size and develop a new warmup scheme that overcomes
optimization challenges early in training. With these simple techniques, our
Caffe2-based system trains ResNet- 50 with a minibatch size of 8192 on 256 GPUs
in one hour, while matching small minibatch accuracy. Using commodity hardware,
our implementation achieves ∼90% scaling efficiency when moving from 8 to 256
GPUs. This system enables us to train visual recognition models on internetscale
data with high efficiency.

## Notes

This paper is focused on parallelizing model training across multiple GPUs. This
is a problem as it is currently typically quite difficult to get reasonable
speedups when using multiple GPUs to train a model (by difficult, I mean that
you get significantly less than linear speedups).

In this paper, by Facebook Research, the authors are able to get *almost* linear
speedups moving from 8 to 256 GPUs (0.9x), which is quite good. Using 256 GPUs,
the authors are able to train the ResNet-50 model in 1 hour (to give you an
idea of how impressive this is, the ImageNet dataset consists of 750 GB of
data). AlexNet, which was the breakthrough paper that was a large
contributor to Deep Learning's current popularity, took 5-6 days to train for 90
epochs on two NVIDIA GTX 580s, which is equivalent to 288 GPU hours [1].

The trick that they use to do this is to use a large minibatch size consisting
of 8192 images. Using a large minibatch size makes it much easier to fully
exploit the GPUs, and hence makes training run faster, however, it makes each
gradient update noisier, making the training potentially take longer to
converge (or making it so that training might converge to a *wrong*,
i.e. non-optimal, answer). Additionally, if you are using multiple GPUs, you
have to synchronize the weights after each minibatch update, so having smaller
minibatches causes the required communication overhead to drastically increase.

To compensate for the noise introduced by the large minibatch size used here,
the authors used a "Linear Scaling Rule", where they multiplied the learning
rate by $$k$$ when they used a minibatch size of $$k$$. This allowed the authors
to match the accuracy between small and large minibatches.

The authors note that the linear scaling rule is nice theoretically as, after
$$k$$ iterations of SGD with a learning rate of $$\eta$$ and a minibatch of
$$n$$, the weight vector is

$$
w_{t+k} = w_t - \eta \frac{1}{n} \sum \limits_{j < k} \sum
\limits_{x \in \mathcal{B}_j} \nabla l(x, w_{t + j})
$$

When, instead, we take asingle step with a minibatch $$\cup_j \mathcal{B}_j$$ of size
$$kn$$ and learning rate $$\eta'$$, the updated weight vector is instead

$$
w_{t+1}' = w_t - \eta' \frac{1}{n} \sum \limits_{j < k} \sum
\limits_{x \in \mathcal{B}_j} \nabla l(x, w_t),
$$

which is different. However, if $$\Delta l(x, w_t)$$ is close in value to
$$\Delta l(x, w_{t+j})$$ for $$j < k$$, then setting $$\eta' = kn$$ makes it so
that $$w_{t+1} \approx w_{t+k}$$ (I would imagine that you could formalize this
with an epsilon-delta proof fairly easily). The paper notes that the two updates
can only be similar when the linear scaling rule is used; in other words, the
linear scaling rule is necessary, but not sufficient.

The authors note that the assumption that the two gradients are similar doesn't
hold during the initial training, when the weights are rapidly changing, and
that the results hold only for a large, but finite, range of minibatch sizes
(which for ImageNet is as large as 8192). The authors use a "warmup" phase to
mitigate the problems with divergence during initial training, where the model
uses less aggressive learning rates, and then switches to the linear scaling
rule after 5 epochs. That didn't work, and instead, they used a gradual warmup
that brought the learning rate to increase at a constant rate per iteration
so that it reached $$\eta' = k \eta$$ after 5 epochs, which worked better.

The authors then go on to discuss results, namely that they were able to train
ResNet-50 in one hour while still getting state of the art results.

What's novel about this is the size of the parallelization; presumably there's
nothing special about using 256 GPUs, and if someone had the resources available
(*cough* Google *cough*), one could scale this further. Given that GPUs seem to
be following Moore's law and doubling in performance every 18 months, this paper
seems to be important; if we can train a state of the art model in one hour
using 256 GPUs today, then within 3 years, we could train one in 15 minutes. If
someone wanted to scale the number of GPUs higher, they could train the model in
under 10 minutes.

Conversely, researchers currently tolerate several weeks of
training time (Mozilla's implementation of
[Baidu's DeepSpeech](https://github.com/mozilla/DeepSpeech) model takes
Mozilla roughly 10 days to train on 4 high end GPUs [2]); if the amount of model
that can be trained in that time drastically increases, all of a sudden
researchers are able to consider datasets that are radically larger, and can
start approaching even higher performance levels.

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
