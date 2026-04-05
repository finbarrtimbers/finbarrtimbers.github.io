# Blog

This is the second iteration of my blog.

It's inspired by the design brilliance of [Patrick Collison](https://patrickcollison.com/) and [Nat Friedman](https://nat.org/).

## LLM Performance Tools

This repository includes interactive calculators for LLM performance analysis:

- **MFU Calculator**: Calculate Model FLOPs Utilization for different accelerators (A100, H100, B200, TPU v5p/v5e/v6e/v7)
- **KV Cache Size Calculator**: Estimate KV cache memory requirements with support for full attention and sliding window attention
- **Max Batch Size Calculator**: Determine maximum batch size given memory constraints

### Running Tests

The calculators have comprehensive unit tests. To run them:

```bash
bun test
```

All calculator logic is in `calculators.js` with tests in `calculators.test.js`.
