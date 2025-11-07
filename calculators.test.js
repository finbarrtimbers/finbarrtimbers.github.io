import { test, expect, describe } from "bun:test";
import {
  flopsPerToken,
  calculateMFU,
  calculateKVCacheSize,
  calculateMaxBatchSize,
  BYTES_PER_TYPE,
  PEAK_TFLOPS
} from "./calculators.js";

describe("MFU Calculator", () => {
  test("flopsPerToken calculates correctly for training", () => {
    const result = flopsPerToken(70, "training");
    expect(result).toBe(70e9 * 6);
  });

  test("flopsPerToken calculates correctly for inference", () => {
    const result = flopsPerToken(70, "inference");
    expect(result).toBe(70e9 * 2);
  });

  test("calculateMFU returns correct percentage for A100 FP16", () => {
    const mfu = calculateMFU(70, 500, 8, "A100", "fp16", "inference");
    const expectedUsedFlops = 70e9 * 2 * 500;
    const expectedPeakFlops = 312 * 1e12 * 8;
    const expectedMFU = (expectedUsedFlops / expectedPeakFlops) * 100;
    expect(mfu).toBeCloseTo(expectedMFU, 2);
  });

  test("calculateMFU returns correct percentage for H100 FP16 training", () => {
    const mfu = calculateMFU(70, 1000, 8, "H100", "fp16", "training");
    const expectedUsedFlops = 70e9 * 6 * 1000;
    const expectedPeakFlops = (1979/2) * 1e12 * 8;
    const expectedMFU = (expectedUsedFlops / expectedPeakFlops) * 100;
    expect(mfu).toBeCloseTo(expectedMFU, 2);
  });

  test("calculateMFU returns null for unsupported dtype", () => {
    const mfu = calculateMFU(70, 500, 8, "A100", "fp8", "inference");
    expect(mfu).toBeNull();
  });

  test("calculateMFU returns correct percentage for TPU v5p", () => {
    const mfu = calculateMFU(70, 500, 8, "v5p", "fp16", "inference");
    const expectedUsedFlops = 70e9 * 2 * 500;
    const expectedPeakFlops = 459 * 1e12 * 8;
    const expectedMFU = (expectedUsedFlops / expectedPeakFlops) * 100;
    expect(mfu).toBeCloseTo(expectedMFU, 2);
  });

  test("calculateMFU scales linearly with number of accelerators", () => {
    const mfu8 = calculateMFU(70, 500, 8, "A100", "fp16", "inference");
    const mfu16 = calculateMFU(70, 500, 16, "A100", "fp16", "inference");
    expect(mfu8).toBeCloseTo(mfu16 * 2, 2);
  });
});

describe("KV Cache Size Calculator", () => {
  test("calculates cache size for full attention only", () => {
    const cacheSize = calculateKVCacheSize(4096, 32, 0, 4096, 8, 128, "fp16", 1);
    const expected = 32 * 4096 * 8 * 128 * 2 * 2;
    expect(cacheSize).toBe(expected);
  });

  test("calculates cache size with sliding window attention", () => {
    const cacheSize = calculateKVCacheSize(8192, 16, 16, 4096, 8, 128, "fp16", 1);
    const fullCache = 16 * 8192 * 8 * 128 * 2 * 2;
    const swaCache = 16 * 4096 * 8 * 128 * 2 * 2;
    expect(cacheSize).toBe(fullCache + swaCache);
  });

  test("sliding window attention uses min of seq_len and window_size", () => {
    const cacheSize1 = calculateKVCacheSize(2048, 0, 16, 4096, 8, 128, "fp16", 1);
    const cacheSize2 = calculateKVCacheSize(4096, 0, 16, 4096, 8, 128, "fp16", 1);
    expect(cacheSize1).toBeLessThan(cacheSize2);

    const expected1 = 16 * 2048 * 8 * 128 * 2 * 2;
    expect(cacheSize1).toBe(expected1);
  });

  test("scales linearly with batch size", () => {
    const cacheSize1 = calculateKVCacheSize(4096, 32, 0, 4096, 8, 128, "fp16", 1);
    const cacheSize4 = calculateKVCacheSize(4096, 32, 0, 4096, 8, 128, "fp16", 4);
    expect(cacheSize4).toBe(cacheSize1 * 4);
  });

  test("different dtypes use correct byte sizes", () => {
    const cacheFP32 = calculateKVCacheSize(4096, 32, 0, 4096, 8, 128, "fp32", 1);
    const cacheFP16 = calculateKVCacheSize(4096, 32, 0, 4096, 8, 128, "fp16", 1);
    const cacheFP8 = calculateKVCacheSize(4096, 32, 0, 4096, 8, 128, "fp8", 1);

    expect(cacheFP32).toBe(cacheFP16 * 2);
    expect(cacheFP16).toBe(cacheFP8 * 2);
  });

  test("returns correct size in bytes for realistic Llama 2 70B config", () => {
    const cacheSize = calculateKVCacheSize(4096, 80, 0, 4096, 8, 128, "fp16", 1);
    const cacheSizeGB = cacheSize / (1024 ** 3);
    expect(cacheSizeGB).toBeGreaterThan(0);
    expect(cacheSizeGB).toBeLessThan(100);
  });
});

describe("Max Batch Size Calculator", () => {
  test("calculates max batch size correctly", () => {
    const maxBatch = calculateMaxBatchSize(200, 70, 4096, 32, 0, 4096, 8, 128, "fp16");
    expect(maxBatch).toBeGreaterThan(0);
  });

  test("returns -1 when model exceeds memory", () => {
    const maxBatch = calculateMaxBatchSize(10, 100, 4096, 32, 0, 4096, 8, 128, "fp16");
    expect(maxBatch).toBe(-1);
  });

  test("returns -1 for invalid KV cache config", () => {
    const maxBatch = calculateMaxBatchSize(200, 70, 0, 0, 0, 4096, 8, 128, "fp16");
    expect(maxBatch).toBe(-1);
  });

  test("larger memory allows larger batch size", () => {
    const maxBatch200 = calculateMaxBatchSize(200, 70, 4096, 32, 0, 4096, 8, 128, "fp16");
    const maxBatch400 = calculateMaxBatchSize(400, 70, 4096, 32, 0, 4096, 8, 128, "fp16");
    expect(maxBatch400).toBeGreaterThan(maxBatch200);
  });

  test("smaller sequence length allows larger batch size", () => {
    const maxBatch4k = calculateMaxBatchSize(200, 70, 4096, 32, 0, 4096, 8, 128, "fp16");
    const maxBatch2k = calculateMaxBatchSize(200, 70, 2048, 32, 0, 4096, 8, 128, "fp16");
    expect(maxBatch2k).toBeGreaterThan(maxBatch4k);
  });

  test("handles sliding window attention", () => {
    const maxBatchFull = calculateMaxBatchSize(200, 70, 4096, 32, 0, 4096, 8, 128, "fp16");
    const maxBatchSWA = calculateMaxBatchSize(200, 70, 4096, 16, 16, 2048, 8, 128, "fp16");
    expect(maxBatchSWA).toBeGreaterThan(maxBatchFull);
  });

  test("realistic 8xA100 80GB scenario with smaller model", () => {
    const maxBatch = calculateMaxBatchSize(640, 70, 2048, 80, 0, 4096, 8, 128, "fp16");
    expect(maxBatch).toBeGreaterThan(0);
    expect(maxBatch).toBeLessThan(1000);
  });
});
