---
layout: post
title: Canadian Deep Learning Build
tags: hardware deep learning
---

I've been reading deep learning papers for about three years now, and while
I've ran a few models on AWS spot instances, I've always hesitated to do so
because of the cost. I've been getting more serious about pursuing a career as a
machine learning engineer focusing on deep learning, and as such, I recently
decided to invest in a setup that would let me run the models discussed in the
state of the art papers.


Writeups:
1.

Partlist:

- https://ca.pcpartpicker.com/user/finbarr/saved/#view=QChbvK


## Economics

The underlying reason for doing this is economics.

I can save money by doing this instead of running models on AWS. I've found that
running models on the AWS p2.xlarge instance (which is the smallest, current
generation GPU instance), costs an average of $0.45 per hour. According to
various [benchmarks](), the p2.xlarge instance runs about half as fast as a
on-prem machine with a 1080 Ti, which makes the directly comparable cost
$0.9/hour. If you're running the machine constantly, which is entirely
reasonable, you end up spending roughly $20 per day, $600 per month, or $7200
annually. And, at the end of the year, you have nothing to show for it, while if
you have your own machine, you'll still have it at the end of the year.

Obviously it's impractical to suggest that you'll be running your instances
continually. However, if you run them 1/4 of the time, you're still paying $1800
per year, which is still a lot. There's also the fact that if you have the
machine, you'll be more likely to use it. Although it's economically
inefficient, knowing that each hour was costing me money made me anxious to turn
off the instance.

I'm also a big believer in self-education. I think that if having a personal
deep learning machine allows you to get practical experience running deep
networks, which you wouldn't receive without the machine, than the proper
comparison is the cost of tuition, which at, say, Stanford, is quite high. I've
been considering going back to school to get experience doing just that; the
opportunity cost alone makes the machine worth it.

I also largely agree with Slav's argument [1] that it's very important to save
time while training models. The faster the feedback loop, the easier it is to
learn.

# Components

I based my build on
[Slav Ivanov's recent build](https://blog.slavv.com/the-1700-great-deep-learning-box-assembly-setup-and-benchmarks-148c5ebe6415).
The heart of the build is the GPU; after that, every other part was chosedn with
two goals in mind:

1. Not bottlenecking. I want to make sure that the GPU is the bottleneck of the
system, and not anything else.

2. Extensibility. I don't foresee myself upgrading the machine, as 32 GB of
memory and a 1080 Ti seems more than enough for any tasks I see myself doing,
but I want to make sure that I won't have to upgrade the motherboard, power
supply, and other non-essential parts. As such, my part list includes two 1080
Tis, and 64 GB of memory, even though I bought one and 32 GB, respectively.


## GPU

I knew that I wanted to get a NVIDIA GPU as CUDA is the way to go in deep
learning (and, indeed, the only supported toolkit for most of the major
frameworks). Within NVIDIA's range of GPUs, from discussions with friends and
reading online, the 10 series was highly recommended, and within that, anything
from the GTX 1060 to the 1080 Ti. The Titan X was said to be too expensive,
while anything below the 1060 (e.g. the 980) was said to be not worth the money.
For the 1070 vs 1080 vs 1080 Ti, my research seemed to indicate that the
performance for each scaled roughly linearly with the price; i.e. the 1080 Ti is
about 30% faster than the 1080, and has 40% more memory (11 GB vs 8 GB), while
costing 40% more ($900 vs $650). As such, I decided to go with the 1080 Ti.

## CPU

[1]: https://blog.slavv.com/the-1700-great-deep-learning-box-assembly-setup-and-benchmarks-148c5ebe6415
