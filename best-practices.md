---
layout: page
title: "Best practices in training neural networks"
permalink: /best-practices
---

Here are some best practices for training (large, deep) neural networks:

1. Use a linear warmup to your initial learning rate.
2. Use cosine decay once your model starts to plateau.
3. Use a batch size warmup schedule.
4. Read a mind numbing amount of papers.
5. Exclude weight decay from your embeddings.
6. Set AdamW $$\epsilon$$ to 1e-8.