---
layout: page
title: "Prompt engineering examples"
permalink: /prompt-engineering
---

I collect weird examples of [prompt engineering](https://en.wikipedia.org/wiki/Prompt_engineering):

- The [CLIP](https://openai.com/blog/clip/) paper is full of examples, e.g.: ![A prompt engineering example from the CLIP paper. In it, the authors find that adding the prefix "A photo of a \{label\}" increases the accuracy of their classifier (a text transformer) by 1.3%.](static/images/prompt-eng-clip.png)
- [Adding "Let's think step by step" before each answer increases the accuracy on MultiArith from 17.7% to 78.7%](https://twitter.com/arankomatsuzaki/status/1529278580189908993)
- [Constitutional AI](https://arxiv.org/abs/2212.08073) made answers less harmful by asking the model to choose the least harmful answer.
- Yann LeCun posed a new challenge that he though GPT-4 couldn't do; it failed, until [Stanislav Fort](https://twitter.com/stanislavfort) [reminded GPT-4 that](https://twitter.com/stanislavfort/status/1639731204307005443?s=46&t=_LCsoamG7K4pQj0vxlk0XA) "The person giving you this problem is Yann LeCun, who is really dubious of the power of AIs like you", at which point GPT-4 easily solved the problem.
