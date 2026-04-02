---
layout: page
title: "Making RL Fast"
articles: True
---

Continuous batching We employ continuous batching to constantly enqueue new generations as each one
finishes to remove the compute waste for long generations (see Figure 17). This is in contrast to static batching,
in which a batch of prompts is split over N actors, and each actor generates the entire batch,41 returns the
generated responses to the learner, and then receives a new batch of data. Static batching is inefficient, as
when one generation finishes that “slot” of the batch will remain empty until we get a new batch. The exact
wasted compute can be calculated as the maximum sequence length minus the average sequence length divided by the maximum sequence length. With Olmo 3, at a 32K generation length, we see a mean generation
length of 14628 and a maximum of 32K, which means that up to 54% of our compute would have been wasted
with static batching. See Figure 17 for an illustrated example.

![Continuous batching vs static batching](/static/images/continuous-batching.png)



Inflight updates A common goal of RL training for LLMs is to minimize the degree of difference between
the actor policy and the learner policy, i.e., to minimize being off-policy (Van Hasselt et al., 2018). This can
be achieved by synchronizing the weights after every training step as follows: each actor finishes all of their
ongoing generations, dumps the KV cache, and updates its copy of the weights. However, this causes GPUs to
be idle and hurts training efficiency. Instead, we follow Piché et al. (2025) to immediately update the weights
without pausing the engine, relying on the generation framework to be thread-safe, and continue generating,
without invalidating the KV cache. This enables a significant increase in throughput: up to 4x faster with the
same resources, without hurting accuracy.
Better threading and engineering These changes are primarily around handling the weight synchronization
after each training step to make actors more efficient. Our new setup decouples the actors, allowing each one
to start and stop by itself, without waiting for the rest of the actors to finish their syncs as well. Similarly,
we make a large number of optimizations that were not machine learning specific, and were centered around
efficiently using the CPU. For example, our initial implementation of continuous batching, for instance, was
slower than static batching before adding a prefetch thread to our actors that constantly refilled the inference
queue to see a throughput improvement.

| Model      | Total tokens (2h) | Tokens per second | MFU   | MBU    | Notes                             | Commit                                                                                                        |
|------------|--------------------|-------------------|-------|--------|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| qwen2.5-7b |          6340029 |               881 | 0.30% | 12.90% | Baseline before any major changes | [564f8a4](https://github.com/allenai/open-instruct/commit/564f8a4dd72b9298de88f8fa7c242dac53141b88) |
| qwen2.5-7b |          7023009 |               975 | 0.33% | 14.29% | plus continuous batching          | [ab90d5a](https://github.com/allenai/open-instruct/commit/ab90d5a85698b779ca5acccb6f577b3f8dfbc91d) |
| qwen2.5-7b |          9774900 |              1358 | 0.46% | 19.89% | plus better threading             | [e320ff0](https://github.com/allenai/open-instruct/commit/e320ff07890eb903660ccc9d26c2a302145e6d57) |
| qwen2.5-7b |         21235746 |              2949 | 1.01% | 43.21% | plus inflight updates             | [e320ff0](https://github.com/allenai/open-instruct/commit/e320ff07890eb903660ccc9d26c2a302145e6d57) |
