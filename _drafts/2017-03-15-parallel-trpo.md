---
layout: post
title: Write up--- TRPO Parallel
tags: machine learning
---

# Paper coming

Inspired by the OpenAI request for resaerch
[#7](https://openai.com/requests-for-research/#parallel-trpo), I am trying to
parallelize the Trust Region Policy Optimization (TRPO) algorithm so that it
would use multiple computers to achieve a 15x lower wall-clock time than
joschu's single threaded implementation on the Atari Gym environments.

# Process
- Set up a test case [link]
- Look everywhere there's a for loop
