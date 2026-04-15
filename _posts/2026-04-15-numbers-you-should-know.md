---
layout: page
title: "Latency numbers everyone should know"
articles: True
---


There's a [Google PDF](https://static.googleusercontent.com/media/sre.google/en//static/pdf/rule-of-thumb-latency-numbers-letter.pdf) with a bunch of useful latency numbers that software engineers should know. I asked ChatGPT to make it into a markdown file for me.

## Latency Table

| Operation                                      | Time (ns)   | Time (ms) |
|-----------------------------------------------|------------|-----------|
| L1 cache reference                            | 1          |           |
| Branch misprediction                          | 3          |           |
| L2 cache reference                            | 4          |           |
| Mutex lock/unlock                             | 17         |           |
| Main memory reference                         | 100        |           |
| Compress 1 kB with Zippy                      | 2,000      | 0.002     |
| Read 1 MB sequentially from memory            | 10,000     | 0.010     |
| Send 2 kB over 10 Gbps network                | 1,600      | 0.0016    |
| SSD 4kB Random Read                           | 20,000     | 0.020     |
| Read 1 MB sequentially from SSD               | 1,000,000  | 1         |
| Round trip within same datacenter             | 500,000    | 0.5       |
| Read 1 MB sequentially from disk              | 5,000,000  | 5         |
| Read 1 MB sequentially from 1 Gbps network    | 10,000,000 | 10        |
| Disk seek                                     | 10,000,000 | 10        |
| TCP packet round trip between continents      | 150,000,000| 150       |

---

## Derived Throughput Estimates

- Sequential read from HDD: ~200 MB/s
- Sequential read from SSD: ~1 GB/s
- Sequential read from main memory: ~100 GB/s (burst)
- Sequential read from 10 Gbps Ethernet: ~1000 MB/s

Additional observations:

- ~6–7 round trips per second between Europe and the US
- ~2000 round trips per second within a datacenter

---

## Back of the Envelope Calculations

**Quick tip:**
Use decimal-based approximations to simplify mental math.

---

## Sample Calculation

**Problem:**
What is the overall latency of retrieving 30 × 256 kB images from one server?

**Naïve design:**
Do all work on one machine → dominated by disk seek time.

---

### Step 1: Reads Required

30 images / 2 disks per machine = 15 reads

---

### Step 2: Time to Read One Image from HDD

(256 KB / 1 MB) * 5 ms + 10 ms seek
= 1.28 ms + 10 ms
= 11.28 ms

---

### Step 3: Total Time

15 reads * 11.28 ms = 169.2 ms

---

### Step 4: Throughput

1000 ms / 169.2 ms ≈ 5 result pages per second
