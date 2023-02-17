---
layout: post
title: Batch Normalization (Ioffe & Szegedy, 2015)
tags: papers machine-learning
---

### Overview

I was at a [talk](https://www.amii.ca/events/2017/9/11/ai-seminar-kzt73-6shn4)
yesterday where the author was discussing the history of machine learning, and
particularly, about how shallow networks were prior to the present day. The talk
made me interested in finding out what has made it so that we can easily train
deeper and deeper layers. Conveniently, DeepMind released their
[AlphaGo Zero](https://deepmind.com/blog/alphago-zero-learning-scratch/)
paper on the same day, which uses a DNN to learn a distribution over all
possible moves to determine which is the best move to take. Their network is a
deep, convolutional network, composed of residual blocks, that uses batch
normalization and rectified linear activations.

Inspired by that paper, I've started reading the literature to understand why
that architecture has proven useful; I began with Batch Normalization (BN).

The [paper](https://arxiv.org/abs/1502.03167) introduces BN as a technique that
seeks to address the problem of covariate shift. Effectively, when you're
training a neural network with parameters $\Theta$ and a loss function
$l(x_i, \Theta)$, we optimize the parameters $\Theta$ of the network using
backpropagation and some varient of stochastic gradient descent. In effect, for
each parameter $\theta_j$ of the network, we perform an update of the form

\[
\theta_{j+1} = \theta_j + \frac{\alpha}{m} \sum_{i=1}^m \frac{\partial l(x_i, \Theta)}{\partial \theta_j},
\]

for a mini-batch of size $m$ and a learning rate of size $\alpha$. However, we
do this for every parameter of the network simultaneously. This is
problematic--- if you recall back to the definition of a partial derivative, the
definition is the rate of change of the function with respect to a variable,
holding all the other variables constant. By altering the other variables, we're
violating that assumption, which causes our gradient descent step to have some
error $\epsilon_i$. As such, we have a compounding error of the form

\[
\epsilon_0 \times \cdots \times \epsilon_n,
\]

where our network has $n$ layers. This error is small, but compounds. We could
improve our ability to train our model if we could guarantee that the inputs to
each layer remain constant over time (for some definition of constant---
obviously we don't want to require the inputs to remain the same, as if we did
that, we wouldn't be able to improve our model). The most natural definition,
working in a stochastic environment, is to keep the distribution of values
consistent.

This is the central idea behind batch normalization. To make our
model better able to learn, we should try and keep our mini-batches consistent.
Batch normalization does this by scaling the variables to have unit variance and
zero mean, and then learns parameters $\gamma$ and $\betta$ that scale and shift
our variables to have a more appropriate mean and variance.

### The algorithm

For each minibatch $\mathcal{B} := \{x_i}_{i =1, \ldots, m}$, the
batch-normalization layer calculates the following transformation:

1. Calculate $\mu_\mathcal{B} = \frac 1 m \sum \limits_{i=1}^m x_i$.
2. Calculate $\sigma^2_{\mathcal{B}} = \frac{1}{m} \sum \limits_{i=1}^m (x_i -
   \mu_{\mathcal{B}})^2$.
3. Calculate $\hat{x}_i = \frac{x_i -
   \mu_{\mathcal{B}}}{\sqrt{\sigma^2_{\mathcal{B}} + \epsilon}}$, where
   $\epsilon$ is a small, positive, constant used for numerical stability.
4. Calculate $BN_{\gamma, \beta}(x_i) = \gamma \hat{x}_i + \beta$.

The output of the layer is then $y = \sigma(W BN_{\gamma, \beta}(x_i))$, where
$\sigma$ is some activation function, and $W$ is a weight matrix.

During backprop, the network optimizes $\gamma$ and $\beta$ to find appropriate
values. Note that the gradient for each of them is

\begin{equation}
\frac{\partial l}{\partial \gamma} = \sum \limits_{i=1}^m \frac{\partial
l}{\partial y_i} \hat{x}_i\\
\sum \limits_{i=1}^m \frac{\partial
l}{\partial y_i}.
\end{equation}


During inference, the algorithm computes $\hat{x}_i$ as $\frac{x_i -
E[x_i]}{\Var{x_i}}$, using the population mean and variance from the training
set.

Note that the BN transform removes the bias term $b$; however, as it introduces
a bias term $\beta$, this isn't a problem.

## Performance

This has resulted in allowing algorithms to have much higher learning rates,
causing them to train faster; the BN transform also allows the network to
achieve higher final accuracy rates, achieving SOTA on a number of problems.
