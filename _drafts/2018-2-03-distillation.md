---
layout: post
title: Implementing Distillation in PyTorch
tags: experiments
---

## Introduction

Distillation is a technique that was introduced in $CITATION1 that uses a
multi-step process to train a neural network:

1. Train a large neural network to convergence on the task.
2. Use the large neural network to label the dataset, converting it from
one-hot $CITATION2 labels into richer, vector-valued labels.
3. Train a smaller neural network to convergence on the task.

The result will be a neural network that is smaller than the larger one, but
with a higher level of accuracy. Moreover, it has (so far) been impossible to
directly train a small network to the same degree of accuracy as one can achieve
with distillation. Rich Caruana has an excellent talk on this phenomena
$CITATION3.

I have a number of hypothese about why this is, and what can be done to fix
this. In the interest of evaluating them, I wanted to create a setup that would
let me test this. In doing so, I created a framework for distillation using
PyTorch that I'm releasing to let others do the same. I found it hard to find
resources to do this in PyTorch, so I hope that I will save others the struggle.

## How I did this

It's surprisingly easy to create a distilled copy of a dataset using PyTorch.
All you need to do is change the labels that are assigned to each dataset.
To do so, I [subclassed]($CODELINK1) the dataset that I was working with, and
added a link to a [pickled]($CODELINK2) dictionary that the class uses to modify
the labels.

I have a script that takes a model checkpoint as input and uses it to create the
pickled dictionary.

## Conclusion

I plan to release the code as an open source framework once I've cleaned it up
a bit, so stay tuned. Please email me if you have any questions
(finbarrtimbers@gmail.com).
