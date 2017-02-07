---
layout: post
title: How I write R scripts
tags: economics Nintendo Pokemon finance
---

These are several best practices that I find useful when writing R scripts.

## Don't use absolute references

E.g. don't write `setwd("/users/finbarr/path/to/my/directory/script.R")`.
Instead, use local references, like `setwd("../other/directory/script.R")`. This
makes it so that other people can run your script without having to modify it.

## Use the Hadleyverse, particularly dplyr

## Don't use for loops
