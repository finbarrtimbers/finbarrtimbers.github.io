---
layout: post
title: Deep Learning Definitions
tags: machine learning statistics papers
---

I'm confused by a lot of the terminolog

# Recurrent networks
- [*beam search*]()

# Boltzmann machines

- [*Boltzmann Machine*](http://www.cs.toronto.edu/~rsalakhu/papers/dbm.pdf): A
  network of symmetrically coupled stochastic binary units. It consists of a set
  of visible units $\textbf{v} \in \{0, 1\}^D$ and a set of hidden units
  $\textbf{h} \in \{0, 1\}^P$. We have an energy $E$ that is calculated as a
  function $E(v, h; \theta)$ of the hidden \& visible states, plus the model
  parameters $\theta$. The energy is used to calculate probabilities using the
  partition function.

- [*Restricted Boltzmann Machine*](http://www.cs.toronto.edu/~rsalakhu/papers/dbm.pdf): A
  Restricted Boltzmann Machine is one in which there are no connections
  between hidden layers, and no connections between visible layers (i.e.
  there are only hidden-to-visible connections).

- [*Partition Function*](https://en.wikipedia.org/wiki/Partition_function_(statistical_mechanics)):
  A partition function defines the statistical properties of an energy based
  system. It comes from physics.

- [*Deep Belief Net*](http://www.cs.toronto.edu/~rsalakhu/papers/dbm.pdf): a network
  composed of of restricted Boltzmann machines that is trained layer by layer,
  where the hidden activies of each RBM is treated as data to train the next RBM,
  enabling the network to learn higher level features. A DBN consists of a RBM
  stacked on top of a directed generative model (composed of RBMs).

- [*Multilayer Boltzmann Machine*](http://www.cs.toronto.edu/~rsalakhu/papers/dbm.pdf):
  a network composed of of restricted Boltzmann machines that is trained
  together, in comparison to the DBN, which is trained greedily.

- [*Contrastive Divergence*]()
