---
layout: page
title: Pointer Networks
tags: papers machine-learning
---

Link to paper [[arXiv]](https://arxiv.org/abs/1506.03134), [[code]](https://github.com/devsisters/pointer-network-tensorflow).

# Overview

Pointer networks are a new neural architecture that learns pointers to positions
in an input sequence. This is new because existing techniques need to have a
fixed number of target classes, which isn't generally applicable--- consider the
Travelling Salesman Problem, in which the number of classes is equal to the
number of inputs. An additional example would be sorting a variably sized
sequence.

Pointer networks uses "attention as a pointer to select a member of the input."
What's remarkable is that the learnt models generalize beyond the maximum
lengths that they were trained on, with (IMO) decent results. This is really
useful because there has been a lot of work done on making it easy & fast to
serve deep neural network predictions, using e.g.
[Tensorflow Serving](https://www.tensorflow.org/serving/). Existing solutions to
the combinatorial optimization problems discussed here are slow and expensive,
and as a result, to produce results that are anything close to real time, you
need to use heuristic models, which are inaccurate as well. The heuristics are
typically hand-tuned, just like computer vision features were 5 years ago--- it's
reasonable to assume that a deep net can learn better heuristics, which will open
up combinatorial optimization and make it practical for a much wider array of
applications.

## Introduction

RNNs are the most common way of approximating functions operating on sequences,
and have had a lot of success doing so. Historically, these have operated on
fixed input/output sizes, but there has been recent work (such as [seq2seq](https://www.tensorflow.org/tutorials/seq2seq))
that have extended RNNs to operate on arbitrarily sized inputs and outputs.
However, these seq2seq models have still required the output to be of a fixed
size--- consider a neural translation model, where the input and output are a
series of sentences. It is impossible for the model to output predictions that
involve words that the model is not aware of, which is a problem that arises
quite often (consider names, for instance).

The authors introduce a new architecture, which they call Pointer Networks, that
represents variable length dictionaries using a softmax probability distribution
as a "pointer". They then use the architecture in a supervised learning setting
to learn the solutions to a series of geometric algorithmic problems; they then
test the model on versions of the problems that the model hasn't seen.

## Models

The model is similar to a sequence-to-sequence model in that it models the
conditional probability of an output sequence given the input sequence. Once
conditional probabilities have been learned, the model uses the trained
parameters to select the output sequence with the highest probability.Note
that this is non-trivial (to put it lightly). Given $N$ possible inputs, there
are $N!$ different output sequences. As such, the model uses a beam search
procedure to find the best possible sequence given a beam size. See below for a
discussion of beam search.

As such, the model has a linear computational complexity. This is much better
than the exact algorithms for the problems solved here, which typically have
much higher complexity (e.g. the TSP has an exact algorithm that runs in
O($N^2 2^n$)).

A vanilla seq-to-seq models makes predictions based on the fixed state of the
network after receiving all of the input, which restricts the amount of
information passing through the model. This has been extended by attention;
effectively, we represent the state of the encoder & decoder layers by
$(e_i)_{i \in \{1, \ldots, n\}}$ and $(d_i)_{i \in 1, \ldots, m(\mathcal{P})}$.
Attention adds an "attention" vector that is calculated as

\begin{align*}
u_j^i &= v^T \tanh(W_1 e_j + W_2 d_i), &j \in (1, \ldots, n)\\
a_j^i &= \text{softmax}(u_j^i), &j \in (1, \ldots, n)\\
d_i' = \sum \limits_{j = 1}^n a_j^i e_j
\end{align*}

this can be thought of as a version of $d_i$ that has been scaled to draw
attention to the most relevant parts, according to the attention layer. $d_i$
and $d_i'$ are concatenated and used as the hidden states from which predictions
are made. Adding attention increases the complexity of the model during inference
to $O(n^2)$. Note that in attention, there is a softmax distribution over a
fixed size output; to remove this constraint, the authors remove the last step
that creates the attention vector, and instead define $p(C_i | C_1, \ldots,
C_{i-1}, \mathcal{P})$ as being equal to $\text{softmax}(u^i)$.

### Beam search

Beam search is a heuristic search algorithm that operates on a graph. It is a
variant of breadth-first search that builds a tree of all possible sequences
based on the current tree using breadth-first search. However, instead of
storing all states, as in a traditional breadth-first search, it only stores a
predetermined number, $\beta$, of best states at each level (we call $\beta$ the
beam width). With infinite beam width, beam search is identical to breadth-first
search. Beam search is thus not guaranteed to be optimal (and one can easily
find any number of examples where beam search finds a sub-optimal output).

# Results

The authors use the same hyperparameters for every model, which indicates that
there's a lot of potential to improve performance for specific tasks. They
trained the model on 1M training examples. The authors find that they can get
close to optimal results on data that the model's been trained on (e.g. when the
model has been trained on TSP with 5-20 cities, they get results that have
accuracies >98%--- more than enough for most applications.

When they extend this to a cycle of length 50, the accuracy decreases, being
30% less accurate than the heuristic models. What's interesting is that the
computational complexity for the Pointer Network is at least as good as the
heuristic algorithms, and given all of the tooling surrounding deep networks,
the model should be extremely easy to put into production.

# Conclusions

The results are good enough to put into production, as it shoul dbe possible to
use this for real-time predictions. However, I would be interested to see how a
reinforcement learning approach can improve the accuracy of the model (which
we'll look at in the next paper I read: [Neural combinatorial optimization with
reinforcement learning](https://arxiv.org/abs/1611.09940)).
