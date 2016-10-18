---
layout: post
title: Progressive networks training robots
tags: papers machine-learning
---

## [Sim-to-Real Robot Learning from Pixels with Progressive Nets](https://arxiv.org/abs/1610.04286)

### Abstract

Applying end-to-end learning to solve complex, interactive, pixel-driven control
tasks on a robot is an unsolved problem. Deep Reinforcement Learning algorithms
are too slow to achieve performance on a real robot, but their potential has
been demonstrated in simulated environments. We propose using progressive
networks to bridge the reality gap and transfer learned policies from simulation
to the real world. The progressive net approach is a general framework that
enables reuse of everything from low-level visual features to high-level
policies for transfer to new tasks, enabling a compositional, yet simple,
approach to building complex skills. We present an early demonstration of this
approach with a number of experiments in the domain of robot manipulation that
focus on bridging the reality gap. Unlike other proposed approaches, our
real-world experiments demonstrate successful task learning from raw visual
input on a fully actuated robot manipulator. Moreover, rather than relying on
model-based trajectory optimisation, the task learning is accomplished using
only deep reinforcement learning and sparse rewards.

### Notes

It's really difficult to use deep RL to train pixel-driven robots. This paper
tries to do so using progressive networks. The paper is useful as it provides
a proof-of-concept by which deep RL can be used on a real robot.

Progressive nets are an architecture that connects each layer of previously
learnt network columns to each new column. They were used successfully by
@rusu16 on to train a model on a number of different Atari games.

In a progressive network (prognet), you initially train a deep network with hidden layers
$h_i^{(1)}$ and parameters $\Theta^{(1)}$ to convergence. When you switch to a
second task, $\Theta^{(1)}$ is frozen, and a new column with parameters
$\Theta^{(2)}$ is instantiated, with each hidden layer $h_i^{(2)}$ receiving
input from both $h_{i-1}^{(2)}$ and $h_{i-1}^{(1)}$ via lateral connections.
Effectively, a progresive network is one in which you have $N$ deep neural
networks, each connected laterally. Consequently, we have $N$ policies, and
are thus learning a probability distribution over all states and actions.

One advantage of this is that the columns of a prognet do not have to be
identical, which allows us to train a deep neural net using simulation, and
then hook the simulated network into the prognet. See figure.

![](images/prognet-architecture.png)

The risk here is that any rewards will be so sparse that it will be impossible
to learn effectively. The authors get around that by having the initial policy
of the agent identical to the previous column, and then learning on it.

The authors tested the system on a robot trying to pick up a ball. They found a
strong increase in performance, and that the prognet was less sensitive to
hyperparameter selection.
