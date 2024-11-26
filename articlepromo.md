article title: How does batching work on modern GPUs?
link: https://www.artfintel.com/p/how-does-batching-work-on-modern
article text: <begin>
The first and most important optimization you can do for any modern deep learning system is to implement batching. When you batch inference, instead of sending a single input, you send a batch of N inputs. Most of the time, depending on the specific value of N, this is free - running inference takes the exact same amount of time with a single example as it does with N examples. This seems counterintuitive at first, since Nx more work is being done.

With a naive model of how neural networks work, batching isn't free. The batched calculation requires Nx the compute to run, and if you run this on CPU, you'll see that this is true. However, when you run the same example on a modern GPU, going from a batch size of 1, to 2, to 3 requires no additional time, and then after that it increases linearly.

This works because of concurrency. Modern GPUs run their operations concurrently (and are actually slower than CPUs on a per-thread basis). When we run inference, each matrix is loaded into memory. Specifically, each block of the matrix is loaded into on-device memory, namely the shared memory unit (only 192kb big on an A100). This is not the same as GPU RAM (HBM). An A100 has 40GB or 80GB of HBM depending on the model, but only 192kb of on-device memory. This creates a memory bandwidth bottleneck when performing mathematical operations, as we are constantly moving data in and out of the on-device memory.

We can approximate the time it takes to transfer the weights by calculating the model size / memory bandwidth ratio, and approximate the time it takes to do the calculation by model FLOPS / GPU FLOPS. With an MLP, the FLOPS are approximately 2 * the number of parameters * the number of elements in the batch (2 * m * n * b for a batch size of b and a m x n matrix). When the batch size is less than the ratio of FLOPS to memory bandwidth, we are bottlenecked by memory bandwidth. When it is more, we are bottlenecked by FLOPS.

On a T4 GPU with 65 TFLOPS of fp32 and 300 gb/s of memory bandwidth, the magic ratio should be 216. When we run a MLP (depth: 8, width: 1024), inference time starts increasing dramatically around the ~128 mark. Smaller networks don't really see any scaling, taking roughly constant time across the entire range of batch sizes (from 1 to 512). This is likely because GPUs are extremely fast at doing math, but everything else (CPUs, etc.) is relatively slow.

For many ML engineers, their time isn't spent doing much machine learning, but rather getting rid of overhead in the non-ML code. In reinforcement learning research, particularly for researchers who work on continual learning problems with a single agent taking a long stream of actions, it's often not worth using a GPU unless either you have a very large network or you extensively optimize every other aspect of your stack.

In convolutional networks, the weights are equal to the number of filters times the filter size. For torch.nn.Conv2d, this is kernel_size^2 * out_channels. With a (224, 224) image with stride of 1 and kernel size of 3, we apply the same filter 224 times. This means there's much less advantage to batching, as we're reusing the same weights many times. For a pooling layer, it's basically linear in the number of pixels.

Transformers are basically just MLPs, so we can treat them similarly. They have an attention mechanism, but with a KV cache (which keeps the computed data around in memory), the time taken by attention is minimal. The same is true for Mixture of Experts models, with one wrinkle: the gating mechanism in a MoE layer will split the batch across experts, so if the gate doesn't split the batch uniformly, this can cause problems. There are different routing mechanisms which avoid this, but in autoregressive decoders, you're pretty much forced to only use token's choice, which tends toward biased gates. Forcing the gate to evenly allocate tokens is an area of active research and an important goal during training.
<end>

1. (169 likes, 26 retweets) my batching article is out

I discuss the most basic, overlooked, and misunderstood optimization you can do in ML: batch inference

I give you ✨math✨ to predict what will happen, and then do experiments to prove that is, in fact, what's happening

(link in next tweet b/c algo)

2. article: https://www.artfintel.com/p/how-does-batching-work-on-modern

3. batch inference appears magical when you first encounter it: how can you run inference on a batch of N examples in the same time as it takes to run inference on a single example?

like everything with GPUs though, the answer comes down to concurrency

4. infamously, GPUs are slower than CPUs on a core-to-core basis, but they make up for it in quantity: they have many, many more cores. an a100 has 6912 CUDA cores that can execute CUDA in parallel. an AMD Rome 7742 (the CPU that the DGX A100 ships with!) has 64.

5. so GPUs can execute many more (simple) computations in parallel. like... matmuls!

however, the ability to execute matmuls is bottlenecked by the longer of two factors: the time it takes to transfer the data needed to compute the matmul, and the time to compute the matmul

6. modern GPUs are very very very fast at the computation part, but not so fast at the data transfer bit (relatively speaking)

(an a100 is ~153 times faster at computing vs transferring data, insofar as you can compare the two)

7. when processing a single example, our GPU spends more time waiting for the data needed to run the matmuls (matrix weights) then it does running the matmul itself

so if we can reuse the same data (i.e. the matrix weights), then we won't see any difference in wallclock time

8. on CPU, though, this isn't the case, so it's always Nx slower to run inference a batch of size N
9. anyway, check out the full article for more details & some graphs

please send me any corrections and feedback

https://www.artfintel.com/p/how-does-batching-work-on-modern

article title: Where do LLMs spend their FLOPS?
link: https://www.artfintel.com/p/where-do-llms-spend-their-flops
article text: <begin>
Ok folks. I had a longer holiday break than expected thanks to some family illnesses. I'm still lowering adjusting my expectations for how often I can expect to be healthy, now that I have a toddler. Sickness. Lots, and lots of sickness.

Here, I conduct a theoretical analysis of LLM performance, and then profile an actual LLM to see where the empirical results differ from the theory. First, the theory. I will rely on the excellent blog post by Kipply to fill in the details. The basic takeaway is that for a standard decoder model, our FLOPS are allocated as follows (on a per-layer basis):

6 d^2 to compute QKV
2d^2 to compute the attention output matrix, softmax(Q @ K.T) @ V
16 d^2 to run the FFN

The sum is 24d^2 FLOPS. Percentage-wise, we spend 25% of the time computing QKV, ~8% computing the attention output matrix, and ~66% of the time running the FFN.

What about the attention mechanism? Well, as everyone knows, the attention equation is

With a KV cache (you are using a KV cache, right anon?), Q, K, and V are all d-dimensional vectors (equivalently, (d, 1) matrices). So it takes ~2d flops for each dot-product and d flops for the d divisions that happen, for a total of ~5d flops, rounding to nothing:

For d equal to 4096 (the value it takes in Llama7b) this is 0.005%, so nothing. This makes it seem like the attention mechanism doesn't matter, but of course, we only use a KV cache (and flash attention, etc.) because it matters so much. Think of Milton Friedman's thermostat analogy (h/t @bradchattergoon):

If a house has a good thermostat, we should observe a strong negative correlation between the amount of oil burned in the furnace (M), and the outside temperature (V). But we should observe no correlation between the amount of oil burned in the furnace (M) and the inside temperature (P). And we should observe no correlation between the outside temperature (V) and the inside temperature (P).

An econometrician, observing the data, concludes that the amount of oil burned had no effect on the inside temperature. Neither did the outside temperature. The only effect of burning oil seemed to be that it reduced the outside temperature.

A second econometrician, observing the same data, concludes that causality runs in the opposite direction. The only effect of an increase in outside temperature is to reduce the amount of oil burned. An increase in V will cause a decline in M, and have no effect on P.

But both agree that M and V are irrelevant for P. They switch off the furnace, and stop wasting their money on oil.

The KV cache does require O(T) memory (where T is the number of tokens we wish to generate), which ain't cheap (see: $NVDA). 

How big is the KV cache? Well, for each token, we store the following number of many bytes (the first 2 is because we assume bf16 precision, so 2 bytes per parameter, and the second 2 is because we have to store both the K and the V tensors):

Note that, by assumption, n_heads * d_head = d_model = d, so the number of bytes is 4 * the number of layers * d.

For GPT-3, we have 96 layers with a d_model of 12288, so we need 4.72 MB per token. It would thus require 5.6GB to generate 2048 tokens.

Having said this, to generate a sequence of a given length with a given model, we still need to use the exact same amount of memory as the KV cache requires, we just throw it away at the end of each forward pass. So we don't need more memory. In a sense, the KV cache is free (modulo some tedious bookkeeping, at least in Jax).

How does this change for more modern architectures, like Mistral 7B? Mistral 7b uses Grouped query attention (as does Llama2— almost as if there's an overlap in authors or something…) and sliding window attention.

In GQA, you share the KV projection across multiple heads, either a single KV projection across all heads (MQA) or into multiple groups (GQA). These are all equivalent to standard multi-head attention (MHA) with a smaller d_model. Earlier, we did the KV cache calculations assuming that the number of heads * the head dimension is equal to the model dimension, but for MQA/GQA we relax that assumption. As the KV cache formula is

we change this to be

where the number of heads * the head dimension is the effective model dimension. Thus, we see a linear decrease in the KV cache size as the number of KV heads decreases (one of the key motivating factors behind GQA/MQA).

The parameters of the Llama{1,2} models are given by:

So for Llama 2, the KV cache required per token is:

Without GQA, the 34B model would take 5x as much memory for the KV cache, and the 70B model would take 8x more memory.

Sliding window attention, another one of the Llama/Mistral tweaks, guarantees that we can cap the KV cache at the window size, which is 4096 for Llama7B.

Performance motivated architectural changes

As discussed, above, a LLM uses 24d^2 FLOPS per layer. Increasing the number of layers linearly scales the number of flops, and the number of parameters. Increasing the model width quadratically scales the model size. Note that this is because the number of parameters scales quadratically with d_model, as most of our layers go from a d_model input vector to a d_model output vector, so we have weight matrices that are (d_model, d_model) in size. Another way of putting this is that compute scales linearly with the number of parameters, and increasing d_model increases the number of parameters quadratically. Making the model 2x deeper doubles the parameters, but making it 2x wider quadruples the parameters.

Having said this, one advantage of a wider model is that it parallelizes better. To compute the Nth layer, you must first compute the preceding N-1 layers. This is difficult to parallelize efficiently, particularly during training, while it is much easier to split a single layer across GPUs via tensor paralellism. If you care mostly about latency, then you probably want to bias yourself towards a wider model.

Empirical analysis

I did this analysis using Colab (notebook). Here's the high-level profile for a single forward pass (interactive profile on my website):

We see that 4.88% of the overall time from this run was spent within this single forward pass. Of the forward pass, 1.98% is spent in attention, while 2.58% is spent in the MLP. Of the total time spent in the forward pass, 40% of the time is in the attention layer, and 53% in the MLP. Within the attention layer, the time is being spent on 4 different linear layers, 2 of them taking approximately equal time (linear_1, linear_2), one of them taking 50% more (linear_3), and one of them taking twice as long as the first two (linear_0). My guess is that the linear_0 is calculating the Query embedding, while linear_1/2 are calculating the Key and Value embeddings. Note how much quicker the calculation is because of the smaller number of KV heads! GQA makes a tangible difference, even though the attention mechanism being used (xformers.ops.memory_efficient_attention) requires that the QKV embeddings be broadcasted to the same size.  

If we go back to our theoretical analysis, it predicted that 2/3rds of the time would be calculating the FFN, and 1/3rd on calculating attention. That's roughly in line with what we see; we spend slightly more time calculating attention than the MLP, but I suspect that's because the MLP is executing a very well-optimized path for Torch.

Performance changes

I then ran a number of experiments with Llama2 where I swept over the model width and depth. These are the results:

This is really interesting. We see basically no change in speed for the two models with a hidden size of 1024 and 1536 (1.10s vs 1.11s), and only a minor one (1.15s vs 1.10s) for the 1024 vs 2048 model. However, when we compare the models with hidden dimensions of 2048 (1.15s), 3072 (1.41s), and 4096 (1.82s), we start to see what looks like linear scaling!

My explanation is that there's non-trivial overhead from dispatching the kernels and actually running the matmuls. This was run on a T4 (specs), which, although dated by modern standards, still has 65 TFLOPS of bf16 compute. If we multiply two 1024x1024 matrices together, that requires 1GFLOP of compute, so we can (theoretically) multiply 65000 1024x1024 matrices together per second. In practice, we'd only get 60-80% of that, but that's still 40000 matmuls per second. A lot of this advantage comes the massive number of cores that modern GPUs have. A T4 has 2560 CUDA cores, each running at between 585 and 1590 MHz. As a result, any task that can be parallelized will do well, but those that require sequential calculation will not be as optimized. I think that's what we're seeing here- there's not enough parallelism to actually occupy the GPU.

The transformer depth causes performance to behave exactly as you'd expect: inference time increases linearly with depth. There's some noise when it comes to the deepest models, but it's pretty well-behaved.

I then calculated the cost as we generate more tokens (I did 10 runs for each number of tokens, to reduce the noise):

It's exactly linear, as you'd expect, because Llama2 uses a KV cache. If we look at the reserved memory, we see the KV cache working as expected (somewhat):

We see that the model has a jump of ~2.1MB every 20 tokens. As this model has d_model of 1024 and 8 hidden layers, it needs 4 * num_layers * d_model bytes of memory, or 4 * 8 * 1024 bytes = 32KB of memory per token. We should only need 640KB of memory. It's unclear where the extra 3x overhead comes from. I suspect the answer is an inefficient implementation.
<end>

1. (45 likes, 6 retweets) ok, my newest article for Artificial Fintelligence is out. In it, I do a theoretical analysis of how we should expect LLM inference to behave, and then I profile Llama2 to compare how it actually behaves.
2. to read: https://www.artfintel.com/p/where-do-llms-spend-their-flops

article title: https://x.com/finbarrtimbers/status/1861443335841575282
article link: https://www.artfintel.com/p/papers-ive-read-this-week-vision
article text: <begin>
I’ve been on a VLM kick lately, trying to read as many papers about vision language models as possible. This was inspired by Claude being ridiculously good at converting equation screenshots to LaTeX, which made me want to understand how LLMs can be so good at understanding pictures and doing fancy OCR. I remember using Tesseract and ABBYY FineReader back in the day, and finding them slow/hard to work with. Now, with VLMs, it seems like reading text from pictures is a solved problem? Definitely surprised me.

In any case, I realized that I didn’t have a good understanding of how VLMs worked, so I wanted to change that. Here’s the results of my efforts to change that!

Funnily enough, 2 VLMs have been released since I started writing this: Pixtral, and DeepSeek Janus, both causing the article to be delayed.

Spoiler: it’s actually super straightforward. It turns out that using some vision encoder (typically a ViT, initialized from a good open source model) to convert images into features, patchifying it, and concatenating the resulting sequence with the text embeddings, is basically enough. There are some fancier architectures, but they don’t seem noticeably better.

I will be giving a talk as part of the PyTorch Expert Exchange lecture series on how batching works on modern GPUs, based on the article I wrote last year. Please join me!

Finally, this article is long. You might want to read it on the web instead. 

The evolution of multimodal model architectures

[abstract]

I began my mission to understand VLMs with this survey paper from Purdue. It’s a high-level overview of multimodal architectures, grouping them into 4 categories:

Type A and Type B, which combine multimodal inputs within the internal layers of the model

Type C and D, which combine the modalities at the input stage.

Type A employs cross-attention, while B uses custom layers for modality fusion.

Type C uses modality specific encoders, while D uses tokenizers to convert every mode into tokens, and then processes them together.

Examples of models which fall into the various categories:

Type A: Flamingo, and various Flamingo derived models

Type B: CogVLM, MoE-LLaVa

Type C: DeepSeek-VL, LLaVa, Sphinx, Emu, Qwen-VL

Type D: LaVIT, Unified-IO

Contemporary open source models are almost all doing Type C. Type D is somewhat common in video models (e.g. MagViT2) but most multimodal papers aren’t bothering to convert the image features into tokens, but passing the patchified features directly into the decoder.

Of the papers that are notable to me, Type C seems dominant. I suspect that most closed models, like Reka, Claude, and Gpt4o, are doing Type C. My logic is that, in deciding between deep fusion, where modalities are combined within the internal layers of the model, and early fusion, where they’re combined at the input, the large labs will be focusing on the most general approach, and follow the bitter lesson, which states that we should learn as much of our structure as possible, rather than imposing pre-determined inductive biases.

The paper is useful as an overview, but it does get bogged down in coming up with a detailed taxonomy of VLMs which I think is of questionable utility. Great intro if you’re unfamiliar with the space.

Flamingo

[abstract]

Published in April ‘22, Flamingo was one of the early multimodal LMs. It focused on enabling zero-shot adaptation to novel tasks that use text and image inputs. They evaluated on 16 tasks, and reached SOTA in 6 of them despite using ~3 orders of magnitude less task-specific data (yet another win for the bitter lesson!). The architecture is interesting; they combine a pretrained & frozen vision encoder with a similar frozen & pretrained language model, and only train dense cross-attention layers, along with a Perceiver Resampler layer on the top of the vision encoder. This is a much more complicated architecture than we’ll see in later models, which tend to all be decoders with minor tweaks.

The core idea is that they have a Perceiver Resampler on top of a frozen vision encoder which takes visual inputs and outputs a fixed number of tokens. These are used to condition a frozen LM (various Chinchilla models) using freshly initialized gated cross-attention layers.

The model seems to work well, but was very complex. With the benefit of hindsight, it’s interesting how unnecessary the complexity was, as none of the subsequent SOTA models used a similar architecture.

Qwen-VL

[abstract]

Published in August 2023, this is when we start to see architectures/training methodologies arise that are very similar to the state of the art in Q3 2024. The Qwen-VL series of models are based on the Qwen LLM, and add visual capacities. They claimed significant improvements in the SOTA compared to other open VLLMs as of Q3 2023. The model architecture is fairly similar to what we’ll see moving forward; they use a ViT-bigG, initialized from Openclip’s model, and resize images to 224x224, splitting the images into patches. They then use a vision-language adapter to compress the image features. The adapter is a single layer of cross attention, which uses a number of learned embeddings as query vectors and the image features from the visual encoder as keys for cross-attention, outputting a sequence of length 256. They use 2D absolute positional encodings on the output of the cross-attention layer. They have three stages of training during which they freeze various parts of the model.

They add special tokens (<img>, </img>) to the sequence to denote the start/end of image content, and also train the model with bounding boxes, including them as text tokens which are tokenized in the standard way, but with two types of special tokens: <box>, </box> to denote the coordinates, and <ref>, </ref> to denote the text description corresponding to a given bounding box.

The model is pretrained on web-scraped image-text pairs, and then trained on high-quality, fine-grained annotation data. They have an additional supervised fine-tuning stage that they use to create a Chat model. The result is quite strong, and achieves SOTA in a variety of tasks.

CogVLM

[abstract]

Published in late 2023, CogVLM uses a frozen trained language model and image encoder, and combines the two with a trainable visual expert module in the attention and FFN layers, enabling vision features without sacrificing NLP performance. It is SOTA across a number of multi-modal benchmarks. This was likely implemented contemporaneously with Qwen-VL, but definitely has more in common with the pre-Qwen architectures like Flamingo.

They add two trainable layers to each transformer block: a MLP, and a QKV matrix, initializing them from their pretrained counterparts in the language model.

Interestingly, they assign all the image tokens a single position ID for RoPE, with the logic that visual tokens already encapsulate positional information when inputted into the ViT, and that by adding additional positional information, the query would focus more on the closer tokens, i.e. the the lower part of an image.

The authors did a lot of ablation experiments to justify the choices they made. These are great and really informative for training VLMs.

DeepSeek-VL

[abstract]

From March 2024, the DeepSeek take on a VLM appears to be a refinement of the Qwen-VL approach. For the visual feature module, the authors use a hybrid encoder, which has a text-aligned encoder for coarse semantic extraction at 384x384 resolution with a high-resolution encoder that operates at 1024x1024 resolution. The module represents a 1024x1024 image as 576 tokens. The high-resolution encoder is based on SAM-B, while they use SigLIP-L for the low-resolution image inputs. SigLIP can generally be viewed as a “better CLIP” so this is a modernization/improvement on what Qwen-VL did.

The authors use a two-layer hybrid MLP as a vision-language adapter, with two distinct single-layer MLPs processing the high- and low- resolution features separately; these features are then concatenated together, and transformed into the LLM’s input space through another layer of MLP.

The authors pretrain the models beginning with an intermediate checkpoint from DeepSeek-LLM, and continue to use extensive text-only data, with 70% of the tokens seen during training coming from the DeepSeek text-only corpus. The authors keep the LLM and the vision encoders frozen while they train the vision-language adaptor module, and then jointly train the LLM + VL adaptor on interleaved VL + text-only sequences. Finally, they finetune the entire model on chat data, unfreezing everything.

The authors achieve SOTA in the majority of the benchmarks they evaluate when compared against other open-source 7B models. Unsurprisingly, the proprietary LLMs, like GPT4 or Gemini Pro, are significantly better (and presumably significantly larger). Their model doesn’t see significant degradation on language benchmarks, which has consistently been a problem plaguing VLMs, which tend to have rapidly degraded performance on LLMs; I suspect that the large % of text-only pretraining data was sufficient. This is a good counterexample for the frozen text models we’ve seen consistently.

Chameleon

[abstract]

Published by Meta in May of ‘24, Chameleon is what I would think of as a great example of a “modern” multimodal model which uses early fusion to treat all modalities as discrete tokens. The loss here is the standard autoregressive loss, with <start_image> / <end_image> tokens being used to insert the image tokens into the sequential input. Chameleon achieves SOTA on a number of benchmarks (visual question answering, image captioning), and is competitive with text-only models of a similar size (Mixtral 8x7B, Gemini-Pro).

The authors train the model on a variety of orderings, including text-only, text-image pairs, and full interleaved text-image documents. This is, notably, the model that was trained with the most compute and the only one trained from scratch. As you’d expect, performance is quite strong.

For the image tokenizer, they use Make-A-Scene, encoding a 512x512 image into 1024 discrete tokens, using a codebook with size 8192. The authors note that this tokenizer is particularly bad at reconstructing images with a large amount of text, which is to be expected given the codebook size. They use a standard BPE tokenizer for text. They are one of the only VLMs that actually tokenizes their images rather than passing image features directly into the decoder.

The authors ran into stability issues when training models with more than 8B parameters & 1T tokens, with instabilities happening late in training. They used a Llama2 architecture, with RMSNorm, SwiGLU, and RoPE. They found that the softmax operation was leading to complex divergences because the different modalities had significantly different entropy, so the different modalities would “compete” with each other by trying to increase their norms, which would eventually explode. This is similar to the logit drift problem in the text-only setting. Consequently, the authors used QK-Norm and added dropout after the attention & feed-forward layers, which was enough to stabilize their 7B model. To stabilize their 34B model, they also had to reorder the norms, like so:

The changes were quite dramatic, which violates my intuition. I did not expect norm reordering to have such a big impact on the training loss, although pre/post layer normalization has had a significant impact in certain settings, so I should perhaps not be surprised. 

They found that dropout wasn’t necessary with norm reordering, but QK-Norm was. This makes sense; I think QK-Norm should generally be used by default.

PaliGemma

[abstract]

From July 2024, PaliGemma continues to demonstrate the superiority of Lucas Beyer’s SigLIP loss, combining a 400M SigLIP model with a 2B Gemma model into a <3B VLM that is SOTA on a variety of tasks despite being (relatively) small.

SigLIP, standing for Sigmoid loss for Language Image Pre-training, is a loss that operates solely on image-text pairs and does not require a global view of the pairs for normalization. It can be thought of as a replacement for CLIP. It is defined as:

Where $x_i$ is the normalized feature embeddings from the image datapoint, and $y_j$ is the normalized feature embeddings from the text datapoint, and $z_{ij}$ is 1 if the image and text datapoints are paired, and $-1$ otherwise (no, your browser isn’t broken— there’s no good way to do inline math with Substack, unfortunately). PaliGemma uses a SigLIP image encoder to provide image features which are concatenated with the text tokens and processed by a standard decoder.

Unlike Flamingo, the entire PaliGemma architecture is trained jointly on multimodal tasks, with nothing being frozen. Unlike Chameleon, the individual components are initialized from previously trained models (SigLIP 400M and Gemma 2B). It is very similar to DeepSeek-VL.

PaliGemma was SOTA on the MMVP benchmark (47.3%), and did well on the rest. This is remarkable given how small and (relatively) cheap it was to train. Notably, it beat GPT4-V (38.7%) and Gemini (40.7%) on this task. That’s remarkable given that these models presumably are much bigger and saw much more data during training.

Pixtral (12B)

[abstract]

From October 2024, Pixtral is a 12B parameter multimodal model, using a vision encoder trained from scratch which ingests images at their natural resolution and aspect ratio, allowing it to vary the number of tokens used for an image. It has a long context window of 128k tokens.

Pixtral also has a novel RoPE-2D implementation.

It is based on Mistral Nemo 12B. They train a new vision encoder from scratch, Pixtral-ViT, which is a 400M ViT. It has 4 key changes vs a typical ViT:

They include <IMAGE_BREAK> tokens between image rows (as they scan patches in raster order), and include an <IMAGE_END> token at the end of an image sequence.

They use gating in the hidden layer of the FFN.

To efficiently process images, they use sequence packing, flattening images along the sequence dimensions and concatenating; they then use a block-diagonal mask to ensure no attention leakage happens.

RoPE-2D. They replace the standard learned & absolute position embeddings for image patches with relative, rotary position encodings. The function is kinda complicated:



where $M_{\Theta}^{(i, j)}$is a diagonal block matrix such that $M_{\Theta}^{(i, j)}[k: k + 2, k: k+2]$ are the only non-zero entries, with each 2x2 block being equal to



where $l = i$ if $k$ is odd, and $j$ otherwise, with $\Theta = [θ1…θd/2]$is a vector of frequencies for the various dimensions of $x$, where $\theta_m$ is defined following standard, 1D RoPE.

Their implementation satisfies the “relative” property, where inner products between two vectors depend only on their relative difference in height/wodth indices, which is generally agreed to be highly desirable.

The Pixtral vision features are included in the decoder via a two-layer fully connected network, using a GeLU activation on the intermdiate, hidden layer. Image tokens are treated identically to text tokens by the multimodal decoder, including RoPE (1d) embeddings for each token, in particular using causal attention. It’s a complicated architecture but has some nice properties, particularly the variable length, native resolution image encoding.

Unfortunately, there’s no information provided about how they trained the models, and in particular, about whether or not the LLM/vision encoder were frozen during training. The model is notable for being (relatively) quite large, at 12B parameters. That’s much more than the other models discussed here.

DeepSeek Janus

[abstract]

Well, as mentioned above, I was about to publish this article, and DeepSeek released Janus. Janus is a fascinating piece of work as, in true DeepSeek fashion, it’s an actual novel architecture. DeepSeek has two visual encoders: one for visual understanding, and one for image generation. 

Otherwise, the architecture is basically the same as what we’ve seen before, a typical “early fusion” model that uses a pretrained LLM to process the visual features. The visual understanding model uses a SigLIP encoder to extract visual features, which are then flattened into a 1D sequence, and they have an “understanding adaptor” which maps these image features into the input space of the LLM. For visual generation, they use a VQ tokenizer from LlamaGen to convert the images into sequences of discrete IDs, which are then transformed into embeddings via a generation adaptor. The result is a multimodal sequence that is fed into the decoder model. They use a tree-stage training process which is, again, very similar to other models (particularly, and unsurprisingly, DeepSeek-VL):

Their loss function is simply cross-entropy, and for understanding tasks (either text or multimodal) they compute the loss only on the text sequence, while for visual generation tasks, they compute the loss only on the image sequence. During inference, they use CFG in the standard way, with a scale of 5. They claim SOTA on generation when compared to some older models, e.g. DALLE-2, SDXL, etc., when evaluated on the GenEval benchmark, which, while interesting, is not particularly compelling. I’d prefer to see an Elo ranking vs the most commonly used standard models, such as Flux. The model appears good at prompt following, but not particularly aesthetic; I suspect it would fair poorly against, say, Flux. Having said that, the model performs very well for a 1.3B model. 

Conclusions

With Chameleon, Pixtral, and PaliGemma, it looks like training methodologies are starting to converge. I think that the architecture used by Pixtral (and the pretraining recipe used by Chameleon) will basically be the recipe that most SOTA VLMs are using, if they’re not already.

Something worth noting is how (relatively) little compute was used to train many of the open source VLMs. The biggest LLaVa model used 768 A100 hours. DeepSeek-VL used 61440 A100 hours (512 A100s for 5 days). PaliGemma used ~12k A100-equivalent hours (18k TPU v5e hours).

Compare to, say, MovieGen, which used 6144 H100s for an unknown amount of time, or Stable Diffusion, which used 150k A100 hours. Presumably the large AI labs are using much more compute/data to train their models; Chameleon, for instance, using 10T tokens, is much more in line with what I would expect for a SOTA model.

The two big decisions that have to be made when training a VLM appear to be 1) how to combine image/text inputs and 2) whether or not to train the visual & language features separately. CogVLM did very well with a 17B model with keeping the models frozen. DeepSeek-VL trained everything after some careful freezing during pre-training. Chameleon trained everything from scratch. I think that it’s obviously cheaper with little to no degradation in quality to use a pretrained encoder, so I think that’s the route to go with. And “early fusion”, where the image features are concatenated to the text embeddings, seems elegant while performing well. That is probably the route I would go (basically following PaliGemma).

In short, the standard recipe appears to be:

Use a ViT for the image encoder, initialized from a large open source model (SigLip, Clip, etc.)

Use a pretrained LLM as the base model

Finetune the combined model

I see no evidence that it makes a difference whether we add the image/text data as inputs to the model, or do some fancier combination deeper in the model, like CogVLM or Flamingo did. The more recent models, like Qwen or DeepSeek, do well just having the image features added to the sequence data.

<end>

1. my latest article for Artificial Fintelligence is up. i cover the evolution of Vision Language Models over the past few years, from complex architectures to surprisingly simple & effective ones.

2. what i found interesting: VLMs are way simpler than they first appear. current SOTA is basically:


- ViT encoder (init from SigLIP/CLIP)
- pretrained LLM base
- concat image features with text
- finetune together

3. open source VLMs use relatively little compute compared to what you might expect:

LLaVa: 768 A100 hours
DeepSeek-VL: 61,440 A100 hours
PaliGemma: ~12k A100 hours
for reference, Stable Diffusion used 150k A100 hours

seems like we're seeing convergence in VLM design. most recent models (Pixtral, PaliGemma, etc) are moving away from complex fusion techniques toward simpler approaches

4. as usual, the bitter lesson holds: better to learn structure than impose it
5. [link]
