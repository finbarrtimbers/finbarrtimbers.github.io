export const PEAK_TFLOPS = {
  A100: { fp32: 156, fp16: 312, fp8: 0 },
  H100: { fp32: 989/2, fp16: 1979/2, fp8: 3958/2 },
  v5p: { fp32: 28, fp16: 459},
  v5e: { fp32: 11, fp16: 197},
  v6e: { fp32: 55, fp16: 918},
  v7: { fp32: 277, fp16: 4614},
};

export const BYTES_PER_TYPE = {
  fp32: 4,
  fp16: 2,
  fp8: 1
};

export const GPU_MEMORY = {
  "A100-40": 40,
  "A100-80": 80,
  "H100": 80,
  "H200": 141,
  "B200": 192
};

export function flopsPerToken(paramsB, mode) {
  const n = paramsB * 1e9;
  return (mode === "training" ? 6 : 2) * n;
}

export function calculateMFU(paramsB, tps, num, accel, dtype, mode) {
  const peakDense = PEAK_TFLOPS[accel]?.[dtype];
  if (!peakDense) {
    return null;
  }

  const usedFlops = flopsPerToken(paramsB, mode) * tps;
  const peakFlops = peakDense * 1e12 * num;
  const mfu = usedFlops / peakFlops;
  return mfu * 100;
}

export function calculateKVCacheSize(seqLen, fullLayers, swaLayers, windowSize, kvHeads, headDim, dtype) {
  const bytesPerElement = BYTES_PER_TYPE[dtype];
  const fullAttentionCache = fullLayers * seqLen * kvHeads * headDim * 2 * bytesPerElement;
  const swaCache = swaLayers * Math.min(seqLen, windowSize) * kvHeads * headDim * 2 * bytesPerElement;
  return fullAttentionCache + swaCache;
}

export function calculateMaxBatchSize(paramsB, numGPUs, gpuType, tpDegree, seqLen, fullLayers, swaLayers, windowSize, kvHeads, headDim, dtype) {
  if (tpDegree > numGPUs) {
    return -1;
  }

  const bytesPerElement = BYTES_PER_TYPE[dtype];
  const memoryPerGPU = GPU_MEMORY[gpuType];

  if (!memoryPerGPU) {
    return -1;
  }

  const modelMemoryBytes = paramsB * 1e9 * bytesPerElement;
  const modelMemoryPerGPU = modelMemoryBytes / tpDegree;

  const fullAttentionCachePerSample = fullLayers * seqLen * kvHeads * headDim * 2 * bytesPerElement;
  const swaCachePerSample = swaLayers * Math.min(seqLen, windowSize) * kvHeads * headDim * 2 * bytesPerElement;
  const kvCachePerSample = fullAttentionCachePerSample + swaCachePerSample;

  const availableMemoryPerGPU = (memoryPerGPU * (1024 ** 3)) - modelMemoryPerGPU;

  if (availableMemoryPerGPU <= 0) {
    return -1;
  }

  if (kvCachePerSample <= 0) {
    return -1;
  }

  const maxBatchSizePerGPU = Math.floor(availableMemoryPerGPU / kvCachePerSample);
  return maxBatchSizePerGPU * (numGPUs / tpDegree);
}
