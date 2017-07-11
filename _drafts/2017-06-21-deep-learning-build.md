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

- https://ca.pcpartpicker.com/user/finbarr/saved/xjWFTW


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

## Cooler

Cooler Master Hyper 212 EVO. Seems to be the standard.

## RAM

I went with DDR4 2400 as it seemed to be a good middle ground.
Debated between 16-64GB and decided to go with 32GB. I could probably get away
with 16GB for most of my work, but given that I'm able to bill hourly, I thought
it was worth paying an extra $150 to not have to fiddle with RAM.

## Storage

Debated extensively between 250 & 500 GB SSDs, and between the Samsung 850 &
960 EVO. Went with the 850 because I don't think it's worth the additional $100.

Chose 2TB hard drive. Might add another one later. ImageNet alone is 1.2TB.

## Case

Chose the Fractal Design Define S. Looks good, reviewed well. I wanted something
that I could use for a long time going forward and that would upgrade well. The
Define S is basically a cheaper, stripped down version of the R5, so I went for
it. It's supposed to be easy to work with.

## Concerns

1. Ability to run multiple GPUs. x16 support seems to be a huge black box... I
   really struggled to find good information about what I needed to run multiple
   GPUs in x16. The cheapest way to do so seems to be with a
   [i7 5820K](https://pcpartpicker.com/product/6tXfrH/intel-cpu-bx80648i75820k),
   but at the time of writing, that costs $220 more than the i5-7600K that I
   went with, which didn't seem worth it. I would have also had to upgrade the
   motherboard, which would have cost at least $100.

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

I went back and forth between the founder's edition and AORUS Xtreme editions of
the 1080 Ti. I almost was able to buy the FE for $898 due to a promotion, but
narrowly missed the boat. I would have. However, the AORUS Xtreme seems good. I
didn't find much information about blower vs fan GPUs for machine learning. I
know that the fans typically cool better, and hence allow for a higher clock
rate, which doesn't really matter for machine learning. However, a
[benchmark](http://techreport.com/review/31763/aorus-geforce-gtx-1080-ti-xtreme-edition-11g-graphics-card-reviewed/4)
claimed that the Aorus Xtreme could run 12 degrees cooler, which is in line
with other articles that I've read. That seems worth it given that much of my
work will require running the card for weeks at a time.

## CPU

Decision was between i5-7600K and i5-6400. Chose i5-7600K as it was 40% faster
for 30% more. Given that most of the work done with the CPU will be single
threaded, that seemed worth it. If I had more money I would have gone for the
i7-5820K, and I still might when it's time to upgrade. I was concerned about the
i5's 16 PCIe lanes.

## Assembly

I bought everything from memory express, which was great as they attached the
CPU to the motherboard. I would recommend that.

Everything else was easy. I followed this document and these youtube videos.

[1]: https://blog.slavv.com/the-1700-great-deep-learning-box-assembly-setup-and-benchmarks-148c5ebe6415
