---
layout: post
title: Leading engineers: lessons I've learned
tags: startups engineering leadership
---

Lately, I've found myself leading teams of engineers. Here are some lessons I've learned.

It is impossible to convince anyone of anything. Rather, you have to give them the facts, and let them convince themselves. In practice, this looks like you're convincing them. But there's a key difference: they need to internalize what you're saying and be able to act on it.

For instance- a senior engineer on your team might genuinely believe that Tensorflow is the best technology to have ever been created. I believe the opposite. How could you win them over to your side? One way would be to argue with them and discuss the pain points. Another would be to highlight genuine issues you've faced, and ask for their help to solve them, and then highlight competing technologies (say: JAX). This lets them convicne themsleves.

This arose in a discussion I had with a senior research scientist several years ago. He was convinced that AlphaZero had used GPUs in their work, and that, as a result, we had to use GPUs for ours [0]. I spent a bunch of time going back and forth with him, but he didn't care about my technical arguments. Finally, I said, look, if you want to use GPUs, that's fine, but AlphaZero used TPUs, and I pointed him to the paper. That convinced him.

Another lesson is that investing in improvement is so, so, so valuable, but teams, almost as a rule, don't do it. I don't know why this is. No company I've been part of has regularly tracked how to help engineers improve. They do somewhat, via perf/promo, but there's no rigorous study of which interventions lead to more successful engineers. Improvements to the product, however, are treated with care.

Value, not quantity. Your job as a leader is to improve the value of the work that your team produces. This has very little to do with the quantity of product your team produces. As a leader, your role is to align your team with the rest of the organization, and with the market. If you don't do this, you're doomed. I don't use "doomed" lightly. Work that doesn't fit with the rest of the team/organization literally does not matter, and you would be better served not doign it. I have spent many hours in my career, especially when I was more junior, doing work that someone lightly expressed interest in out of politeness. THis was a waste, as when it was done, they didn't care. I ahve been focused lately on "what wouldn't get done if I didn't do it?" For instance, if I'm trying to decide between two projects to work on, what happens if I choose each one? Is there one project that will go forward regardless of my choice? And what happens if the projects don't go forward? if the answer is "nothing", then it's fine to not do it. In fact, it's probably better.


[0]: This would become the [Player of Games](https://arxiv.org/abs/2112.03178) paper.