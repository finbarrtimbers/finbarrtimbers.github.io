---
layout: page
title: "Papers I've read this week (March 4th, 2023)"
articles: True
---

I’m going to try to write a weekly summary of the most interesting papers I’ve read that week. I’d love to hear what papers you’ve been reading, if you agree/disagree about my conclusions for each paper, and/or suggestions for what papers I should read next!

## Scaling laws for routed language models

[Abstract](https://arxiv.org/abs/2202.01169)

I [used to work](https://www.deepmind.com/) with Aidan, and way back in 2021, he was insistent that LLMs were the future of AI. I thought he was crazy. In ‘22, he also insisted that conditional routing models were the future. Given how right he was about LLMs, it’s probably worth paying attention to conditional routing models.

The paper provides a great general overview of how routing networks work and performance comparisons (in terms of negative log likelihood over a validation dataset) for the 3 most common routing techniques ([sparse MoE](https://arxiv.org/abs/1701.06538), [non-parametric HASH](https://arxiv.org/abs/2106.04426), [RL routing](https://arxiv.org/abs/1308.3432)). 

The authors trained a large number of conditional routing networks, and fit scaling laws to the results; they find that all 3 techniques follow the same scaling laws, with RL routing doing quite well. I’d be curious to see how much effort has been put into improving RL routing; I suspect that it could be improved significantly.

The authors observed the following results:

1. Routing improves the performance of language models across all sizes and variants attempted
2. Training a Routing Network with RL is of comparable effectiveness to state-of-the-art techniques.
3. The performance of all Routing Networks is accurately described by scaling laws in the number of experts and in
the underlying dense model size.

I was surprised at how similar the performance of the various techniques was. The data was quite nice, with little variation. The scaling laws seem to fit the data quite nicely. 

One interesting result was that routing helps significantly more when the model is smaller. I found this surprising; my intuition is that routing should always help. They found that this was the case across all models, and that routing helped less as the models grew.

The paper ends with recommendations, which I found really useful:

1. Use routing for models with less than 1.3B parameters
2. S-Base is a good, default routing algorithm (defined in the appendix of their paper).
3. Target using E in {64, 128} experts. 
4. Use K = 1 experts; route layers with a frequency between 0.5 & 1; lower frequency reduces performance.

## Internet explorer

[Abstract](https://arxiv.org/abs/2302.14051)

In this paper, the authors create an agent which dynamically explores the internet, running text queries to find images to use for self-supervised training. While seemingly designed to [directly antagonize Yudkowsky](https://rationalwiki.org/wiki/AI-box_experiment), the paper is extremely interesting, and presents, to me, a potential future direction for AGI research. As [Chinchilla](https://arxiv.org/abs/2203.15556) showed us, LLMs could [massively improve](https://www.lesswrong.com/posts/6Fpvch8RR29qLEWNH/chinchilla-s-wild-implications#fnjefvfidovdb) with more data. Having agents dynamically exploring the internet is one excellent way to get more data- especially if they’re able to adaptively learn over time and prioritize images accordingly.

In the paper, they train a model to learn representations of images based on [MoCo-v3](https://paperswithcode.com/method/moco-v3). They query Google Images for new images, ranking the query results by similarity to the target dataset, assigning a reward to the new images:

![reward equation for internet explorer paper](/static/images/internet-explorer-reward.png)

Here, S_cos is the cosine similarity, f_k is the image encoder, D := {x_i} is the target dataset, and y is the new image to evaluate, and they evaluate over the k closest neighbours in the target dataset (where “closest” is determined by the encoded representation).

They create the queries for Google Images by sampling them a static vocabulary dataset. They estimate the reward associated with the query using a Gaussian process regression. I’d be really interested to see a fancier query generation process. One idea that comes to my mind would be using RL to train a LLM to generate queries in a manner similar to what’s done in [RLHF](https://openai.com/research/learning-from-human-preferences)/[RLAIF](https://arxiv.org/abs/2204.05862), i.e. use an RL algorithm like PPO to finetune a pretrained LLM to maximize reward. This would require much more compute, however.

## LLaMa

[Abstract](https://arxiv.org/abs/2302.13971)

I’ve been digesting the LLaMa paper that Facebook released this week. It was very interesting to see the performance increases they got despite the size decreases. Their 13B model outperformed GPT-3 on a number of benchmarks, and their 65B model was competitive with Chinchilla-70B and PaLM-540B (!). 

I did find it incredibly frustrating that they stopped training when they did; their loss curves are all looking pretty far from convergence, and I’m curious to see how much the models will continue to improve:

![loss curves for LLaMa paper](/static/images/llama-training-curves.png)

I wish that they had just [left it training](https://karpathy.github.io/2019/04/25/recipe/#6-squeeze-out-the-juice).

My biggest question about the paper is that it’s not clear what caused the improvements. They discuss a few major changes compared to GPT-3, which their model is based on:

- They only use publicly available data, but it’s unclear what exactly the filtering steps are. I wish they’d open source their dataset (or at least, the code to clean it).
- They normalize the input of each transformer sub-layer, rather than the output.
- They use the SwiGLU activation function, as PaLM did, with a slight dimensional difference compared to PaLM.
- They use Rotary Embeddings.[^1]

[^1]: I haven’t seen a great ablation study comparing various embedding schemes. This is on my list of experiments to do once I can scrounge up GPUs.

There was no ablation study, unfortunately. If I can scrounge up the GPUs, I’m tempted to do my own ablation based on [nanoGPT](https://github.com/karpathy/nanoGPT). LLaMa also uses [FlashAttention](https://arxiv.org/abs/22015.14135), which I suspect will become the default attention implementation used in LLMs going forward.

Anecdotally, it seems like performance with the default parameters [isn't great](https://twitter.com/browserdotsys/status/1632145830277795840) (unless you're writing [erotic stories](https://twitter.com/browserdotsys/status/1632512136906719232)). However, it hasn't been tuned (RLHF/SFT), so maybe [that would make a difference](https://twitter.com/yacineMTB/status/1632392979833921539)? With some [modifications](https://twitter.com/theshawwn/status/1632569215348531201), performance is apparently pretty good. This lends strength to my hypothesis that the paper was rushed out in response to the LLM gold rush we've seen since ChatGPT was released. The paper, while strong, would be much stronger with a few more changes (ablation, more details, slightly more polished code), in a way that doesn't make sense for the omissions to be strategic. 

Facebook benefits when open source LLMs get better in a way that OpenAI/Anthropic/Cohere/etc. doesn't, so they should want to do ablations and other scientific work to advance the field. The fact that they didn't include this makes me think that they wanted to get the paper out the door as soon as possible- probably to avoid the chance of being scooped with an even larger, better, model.
