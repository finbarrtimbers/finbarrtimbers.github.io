---
layout: page
title: "Colocated vs distributed RL workloads"
articles: True
---

I was recently asked about colocated vs distributed RL architectures

generally everyone uses distributed

except kimi, who uses colocated

"colocated" here means that we switch between inference and training on the same engines

using the terminology from the replay buffer paper, we have mu, which is the ratio of the time for the inference engines to generate the sequences to train on to the time for a single training step

the total cost of running a single training step in a colocated setup is

inference setup time + inference time + training setup time + training step time

in a distributed setup, we can avoid all of this, and the only time is the training step time

so the ratio is

training step time / (inference setup time + inference time + training setup time + training step time)

assuming setup time is 0, then we have that the slowdown is 1/mu, so the more expensive inference is, the less the slowdown is.

For the runs we did for Olmo 3, timing is below.

| Experiment | time/training (s) | time/getting_response (s) | inference/training (μ) | response_length | Script | Wandb |
|---|---:|---:|---:|---:|---|---|
| 7B Instruct RL | 30.38 | 304.63 | 10.03 | 8192 | [`7b_instruct_rl.sh`](https://github.com/allenai/open-instruct/blob/main/scripts/train/olmo3/7b_instruct_rl.sh) | [p0l9m3ri](https://wandb.ai/ai2-llm/open_instruct_internal/runs/p0l9m3ri) |
| 7B Think RL | 83.42 | 495.97 | 5.95 | 32768 | [`7b_think_rl.sh`](https://github.com/allenai/open-instruct/blob/main/scripts/train/olmo3/7b_think_rl.sh) | [buq6ny46](https://wandb.ai/ai2-llm/open_instruct_internal/runs/buq6ny46) |
| 7B Think RL (no pipeline) | 256.63 | 743.08 | 2.90 | 32768 | [`7b_think_rl_no_pipeline.sh`](https://github.com/allenai/open-instruct/blob/main/scripts/train/olmo3/7b_think_rl_no_pipeline.sh) | [pvb181bq](https://wandb.ai/ai2-llm/open_instruct_internal/runs/pvb181bq) |
| 7B RL Zero Math | 92.86 | 43.09 | 0.46 | 12000 | [`7b_rlzero_math.sh`](https://github.com/allenai/open-instruct/blob/main/scripts/train/olmo3/7b_rlzero_math.sh) | [w0ql4f5r](https://wandb.ai/ai2-llm/open_instruct_internal/runs/w0ql4f5r) |
| 7B RL Zero Code | 37.04 | 44.82 | 1.21 | 16384 | [`7b_rlzero_code.sh`](https://github.com/allenai/open-instruct/blob/main/scripts/train/olmo3/7b_rlzero_code.sh) | [o40rwmu8](https://wandb.ai/ai2-llm/open_instruct_internal/runs/o40rwmu8) |
| 7B RL Zero IF | 5.66 | 6.97 | 1.23 | 16384 | [`7b_rlzero_instruction_following.sh`](https://github.com/allenai/open-instruct/blob/main/scripts/train/olmo3/7b_rlzero_instruction_following.sh) | [hk80a60o](https://wandb.ai/ai2-llm/open_instruct_internal/runs/hk80a60o) |
| 7B RL Zero General | 33.53 | 2.64 | 0.08 | 16384 | [`7b_rlzero_general.sh`](https://github.com/allenai/open-instruct/blob/main/scripts/train/olmo3/7b_rlzero_general.sh) | [0tscl05k](https://wandb.ai/ai2-llm/open_instruct_internal/runs/0tscl05k) |
| 32B Instruct RL | 27.93 | 507.01 | 18.15 | 16384 | [`32b_instruct_rl.sh`](https://github.com/allenai/open-instruct/blob/main/scripts/train/olmo3/32b_instruct_rl.sh) | [9gzo45lx](https://wandb.ai/ai2-llm/open_instruct_internal/runs/9gzo45lx) |
| 32B Think RL | 142.19 | 833.94 | 5.87 | 32768 | [`32b_think_rl.sh`](https://github.com/allenai/open-instruct/blob/main/scripts/train/olmo3/32b_think_rl.sh) | [29h723j6](https://wandb.ai/ai2-llm/open_instruct_internal/runs/29h723j6) |
