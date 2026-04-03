---
layout: page
title: "Making RL Fast"
articles: True
---

For Olmo 3, I was fortunate enough to find a series of optimizations which made our RL setup 4x faster. As
we used approximately 250k H100 hours running RL on Olmo 3, this saved us approximately 750k H100 hours, which is roughly equal to $1.5M at current market prices. These changes were detailed in the [paper](https://arxiv.org/abs/2512.13961), but I wanted to write more about them here.

There were three primary optimizations:

1. Continuous batching.
2. Inflight updates.
3. Better thread synchronization.

## Continuous batching

For Olmo 2, the code used a synchronous RL approach, in which the actors and learner all operate in lockstep. This is inefficient, as it makes it.

We employ continuous batching to constantly enqueue new generations as each one
finishes to remove the compute waste for long generations (see Figure 17). This is in contrast to static batching,
in which a batch of prompts is split over N actors, and each actor generates the entire batch,41 returns the
generated responses to the learner, and then receives a new batch of data. Static batching is inefficient, as
when one generation finishes that “slot” of the batch will remain empty until we get a new batch. The exact
wasted compute can be calculated as the maximum sequence length minus the average sequence length divided by the maximum sequence length. With Olmo 3, at a 32K generation length, we see a mean generation
length of 14628 and a maximum of 32K, which means that up to 54% of our compute would have been wasted
with static batching. See Figure 17 for an illustrated example.

![Continuous batching vs static batching](/static/images/continuous-batching.png)


I made ChatGPT make the original version of this image in Tikz. It was remarkably difficult. The LaTeX is [available](https://gist.github.com/finbarrtimbers/153dae1598b17c75a9690cd848e86818) if you care to see how I tortured ChatGPT.


## Inflight updates

A common goal of RL training for LLMs is to minimize the degree of difference between
the actor policy and the learner policy, i.e., to minimize being off-policy (Van Hasselt et al., 2018). This can
be achieved by synchronizing the weights after every training step as follows: each actor finishes all of their
ongoing generations, dumps the KV cache, and updates its copy of the weights. However, this causes GPUs to
be idle and hurts training efficiency. Instead, we follow Piché et al. (2025) to immediately update the weights
without pausing the engine, relying on the generation framework to be thread-safe, and continue generating,
without invalidating the KV cache. This enables a significant increase in throughput: up to 4x faster with the
same resources, without hurting accuracy.


## Better threading

In a classic application of [Amdahl's law](https://en.wikipedia.org/wiki/Amdahl%27s_law), as we make our actors more asynchronous, the synchronous points become more of a bottlenck. Consequently, we found that we were spending a great deal of time orchestrating the actors, and specifically, handling the weight sync.

To fix this, Our new setup decouples the actors, allowing each one
to start and stop by itself, without waiting for the rest of the actors to finish their syncs as well. Similarly,
we make a large number of optimizations that were not machine learning specific, and were centered around
efficiently using the CPU. For example, our initial implementation of continuous batching, for instance, was
slower than static batching before adding a prefetch thread to our actors that constantly refilled the inference
queue to see a throughput improvement.

This was a pure engineering/systems change that affected how we synchronize the learner and the actors. The idea is that if you have N actors and need to do a weight broadcast, one way to synchronize them is to:

1. Ask them all to stop, (`for i in range(num_actors): actors[i].stop()`)
2. Send the weight update to each one in turn, (`for i in range(num_actors): actors[i].update_weights()`)
3. Restart the actors processing tokens (`for i in range(num_actors): actors[i].start()`).


Or, in code:

```
for i in range(num_actors):
    actors[i].stop()
for i in range(num_actors):
    actors[i].update_weights()
for i in range(num_actors):
    actors[i].start()
```

If we do this, we have a bunch of synchronization points which kill performance in distributed systems, as the actors have to wait for all of the stragglers to finish.

Instead, we can have each actor operate independently and have each actor start/stop independently:

```
for i in range(num_actors):
    actors[i].stop()
    actors[i].update_weights()
    actors[i].start()
```

and of course, we run this concurrently over all the actors, so that they're all doing this simultaneously. So perhaps something closer to:

```
async def update_weight(actors: list[Actor], actor_index: int):
    actor = actors[actor_index]
    await actor.stop()
	await actor.update_weights()
	await actor.restart()

await asyncio.gather(*(update_weight(actors, i) for i in range(num_actors)))
```

The main bottleneck here is that we have our learner broadcasting the weight updates, which is inherently sequential. We *could* move to an asynchronous approach like Cursor did for [Composer 2](https://arxiv.org/abs/2603.24477), where the weights are written to disk, but we haven't found the weight broadcast to be a bottleneck in practice.

| Model      | Total tokens (2h) | Tokens per second | MFU   | MBU    | Notes                             | Commit                                                                                                        |
|------------|--------------------|-------------------|-------|--------|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| qwen2.5-7b |          6340029 |               881 | 0.30% | 12.90% | Baseline before any major changes | [564f8a4](https://github.com/allenai/open-instruct/commit/564f8a4dd72b9298de88f8fa7c242dac53141b88) |
| qwen2.5-7b |          7023009 |               975 | 0.33% | 14.29% | plus continuous batching          | [ab90d5a](https://github.com/allenai/open-instruct/commit/ab90d5a85698b779ca5acccb6f577b3f8dfbc91d) |
| qwen2.5-7b |          9774900 |              1358 | 0.46% | 19.89% | plus better threading             | [e320ff0](https://github.com/allenai/open-instruct/commit/e320ff07890eb903660ccc9d26c2a302145e6d57) |
| qwen2.5-7b |         21235746 |              2949 | 1.01% | 43.21% | plus inflight updates             | [e320ff0](https://github.com/allenai/open-instruct/commit/e320ff07890eb903660ccc9d26c2a302145e6d57) |
