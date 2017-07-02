---
layout: post
title: Geoff Hinton's capsule theory: a new theory of computer vision
tags: papers machine-learning
---

Geoff Hinton is the computer scientist who invented much of what is behind the

"capsules receives multi-dimensional prediction vectors from capsules in the layer below
and looks for a tight cluster of predictions."

"If it finds a tight cluster, it outputs:

A high probability that an entity of its type exists in its domain.
The center of gravity of the cluster, which is the generalized pose of that entity.
"
"This is very good at filtering out noise because high-dimensional coincidences
do not happen by chance."

Four arguments against pooling

It is a bad fit to the psychology of shape perception:
It does not explain why we assign intrinsic coordinate frames to objects and why they have such huge effects
It solves the wrong problem
We want equivariance, not invariance. Disentangling rather than discarding.
It fails to use the underlying linear structure
It does not make use of the natural linear manifold that perfectly handles the largest
source of variance in images
Pooling is a poor way to do dynamic routing
We need to route each part of the input to the neurons that know how to deal with it.
Finding the best routing is equivalent to parsing the image


Some psychological evidence that our visual systems impose coordinate frames in
order to represent shapes.

He says "linear manifold used in computer graphics makes it very easy to deal with viewpoints" TODO: what is this exactly?

@11:16 "two things that have no problem with viewpoint. One is our brains and
the other is computer graphics and therefore they work the same way". TODO: what
is this exactly?

People use rectangular coordinate frames embedded in objects.
Using a different fame totally changes the perception
The relation between an object and the viewer is represented by a whole
bunch of active neurons that capture different aspects of the
relationship, not by a single neuron or a coarse-coded set of neurons.

f you want high accuracy for exactly where something is, you want Neurons with
receptive fields that overlapp a whole lot

Two types of equivariance

If a low-level part moves to a very different position it will be represented by a different
capsule.
This is "place-coded" equivariance
If a part only moves a small distance it will be represented by the same capsule but
the pose outputs of the capsule will change.
This is "rate-coded" equivariance

Current neural net wisdom:
Learn different models for different viewpoints.
This requires a LOT of training data.
A much better approach:
The manifold of images of the same rigid shape is highly non-linear in the space of
pixel intensities.
Transform to a space in which the manifold is globally linear( i.e. the graphics
representation that uses explicit pose coordinates)
This allows massive extrapolation.

How do convnets do routing?

In each pool, the output neuron only attends to the most active neuron in the pool.
This is a very primitive way to do routing.
A much better routing principle is to send the information to the capsule in the layer above
that is best at dealing with it.
This can be done by getting a capsule to ask for more input from lower-level capsules that
vote for its cluster and less input from lower-level capsules that vote for its outliers.
The total weight on the bottom-up inputs supplied by one lower-level capsule is
at most 1.

Higher-level capsules have bigger domains so low-level place-coded equivariance gets converted into high-level rate-coded equivariance.
A much better routing principle is to send the information to the capsule in the layer above that is best at dealing with it.
