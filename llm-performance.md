---
layout: page
title: "LLM Performance Tools"
permalink: /llm-performance
---

<div class="calculators-grid">
<div class="mfu-container">
  <h2>Model FLOPs Utilization (MFU) Calculator</h2>

  <label>
    Model size (parameters, billions)
    <input type="number" id="mfu-params" value="70" min="0" step="0.1" />
  </label>

  <label>
    Tokens per second
    <input type="number" id="mfu-tps" value="500" min="0" step="1" />
  </label>

  <label>
    Number of accelerators
    <input type="number" id="mfu-num" value="8" min="1" step="1" />
  </label>

  <label>
    Accelerator type
    <select id="mfu-accel">
      <option value="A100">NVIDIA A100</option>
      <option value="H100">NVIDIA H100</option>
      <option value="B200">NVIDIA B200</option>
      <option value="v5p">TPU v5p</option>
      <option value="v5e">TPU v5e</option>
      <option value="v6e">TPU v6e (Trillium)</option>
      <option value="v7">TPU v7 (Ironwood)</option>
    </select>
  </label>

  <label>
    Data type
    <select id="mfu-dtype">
      <option value="fp8">FP8</option>
      <option value="fp16" selected>FP16/BF16</option>
      <option value="fp32">FP32</option>
    </select>
  </label>

  <label>
    Workload
    <select id="mfu-mode">
      <option value="inference">Inference</option>
      <option value="training">Training</option>
    </select>
  </label>

  <div id="mfu-result" class="mfu-result"></div>

  <div class="mfu-info" markdown="0">
    <div class="assumptions-container">
      <p class="assumptions-label">
        ℹ️ Assumptions*
      </p>
      <div class="assumptions-tooltip">
        <strong>Assumptions:</strong>
        <ul>
          <li>Using dense (non-sparse) TFLOPS specs only</li>
          <li>Training uses 6N FLOPs per token (2N forward + 4N backward)</li>
          <li>Inference uses 2N FLOPs per token</li>
          <li>Does not account for memory bandwidth limitations</li>
          <li>Does not account for communication overhead</li>
          <li>Does not account for framework inefficiencies</li>
          <li>Does not account for Sliding Window Attention (SWA)</li>
          <li>Does not account for Grouped Query Attention (GQA)</li>
        </ul>
      </div>
    </div>
    <p class="issue-reporting">
      <strong>Found an issue?</strong> Please report it to finbarrtimbers at google's email service dot com or file an issue on <a href="https://github.com/finbarrtimbers/finbarrtimbers.github.io/issues" target="_blank">GitHub</a>. Include the inputs you used, expected vs. actual results, and any error messages.
    </p>
  </div>
</div>

<div class="mfu-container">
  <h2>KV Cache & Batch Size Calculator</h2>

  <label>
    Model size (parameters, billions)
    <input type="number" id="integrated-params" value="70" min="0" step="0.1" />
  </label>

  <label>
    Number of GPUs
    <input type="number" id="integrated-num-gpus" value="1" min="1" step="1" />
  </label>

  <label>
    GPU type
    <select id="integrated-gpu-type">
      <option value="A100-40">NVIDIA A100 40GB</option>
      <option value="A100-80">NVIDIA A100 80GB</option>
      <option value="H100" selected>NVIDIA H100 80GB</option>
      <option value="H200">NVIDIA H200 141GB</option>
      <option value="B200">NVIDIA B200 192GB</option>
    </select>
  </label>

  <label>
    Tensor Parallelism (TP) degree
    <input type="number" id="integrated-tp" value="1" min="1" step="1" />
  </label>

  <label>
    Sequence length
    <input type="number" id="integrated-seq-len" value="4096" min="1" step="1" />
  </label>

  <label>
    Number of full attention layers
    <input type="number" id="integrated-full-layers" value="80" min="0" step="1" />
  </label>

  <label>
    Number of sliding window attention layers
    <input type="number" id="integrated-swa-layers" value="0" min="0" step="1" />
  </label>

  <label>
    Sliding window size
    <input type="number" id="integrated-window-size" value="4096" min="1" step="1" />
  </label>

  <label>
    Number of KV heads
    <input type="number" id="integrated-kv-heads" value="8" min="1" step="1" />
  </label>

  <label>
    Head dimension
    <input type="number" id="integrated-head-dim" value="128" min="1" step="1" />
  </label>

  <label>
    Data type
    <select id="integrated-dtype">
      <option value="fp8">FP8 (1 byte)</option>
      <option value="fp16" selected>FP16/BF16 (2 bytes)</option>
      <option value="fp32">FP32 (4 bytes)</option>
    </select>
  </label>

  <div id="integrated-kv-result" class="mfu-result"></div>
  <div id="integrated-batch-result" class="mfu-result"></div>

  <div class="mfu-info" markdown="0">
    <div class="assumptions-container">
      <p class="assumptions-label">
        ℹ️ Assumptions*
      </p>
      <div class="assumptions-tooltip">
        <strong>Assumptions:</strong>
        <ul>
          <li>KV cache stores both key and value tensors (factor of 2)</li>
          <li>Full attention layers cache the entire sequence</li>
          <li>Sliding window attention layers only cache the window size</li>
          <li>Model weights are sharded across TP degree GPUs</li>
          <li>KV cache is replicated across TP degree GPUs</li>
          <li>Does not account for activation memory during forward pass</li>
          <li>Does not account for framework overhead or memory fragmentation</li>
        </ul>
      </div>
    </div>
  </div>
</div>
</div>

<style>
  .calculators-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(500px, 1fr));
    gap: 2rem;
    width: 100%;
    margin: 2rem auto;
    padding: 0 1rem;
    max-width: 1400px;
  }

  @media (max-width: 1100px) {
    .calculators-grid {
      grid-template-columns: 1fr;
    }
  }


  /* --- MFU calculator styles (scoped by the .mfu-container wrapper) --- */
  .mfu-container {
    font-family: system-ui, sans-serif;
    margin: 0;
    padding: 2rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  .mfu-container label {
    display: block;
    margin-top: 1rem;
    font-weight: 600;
  }
  .mfu-container input,
  .mfu-container select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    margin-top: 0.25rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    box-sizing: border-box;
  }
  .mfu-result {
    margin-top: 1.5rem;
    font-size: 1.25rem;
    font-weight: bold;
  }
  .mfu-info {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e0e0e0;
    font-size: 0.9rem;
  }
  .assumptions-container {
    position: relative;
    display: inline-block;
    margin-bottom: 0.75rem;
  }
  .assumptions-label {
    cursor: help;
    color: #666;
    margin: 0;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  .assumptions-label:hover {
    background-color: #f5f5f5;
  }
  .assumptions-tooltip {
    display: none;
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0.5rem;
    padding: 1rem;
    background: #ffffff;
    color: #333;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    width: 320px;
    max-width: 90vw;
    z-index: 1000;
    font-size: 0.85rem;
    line-height: 1.5;
  }
  .assumptions-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #ffffff;
  }
  .assumptions-container:hover .assumptions-tooltip {
    display: block;
  }
  .assumptions-tooltip ul {
    margin: 0.5rem 0 0 0;
    padding-left: 1.5rem;
  }
  .assumptions-tooltip li {
    margin: 0.25rem 0;
  }
  .issue-reporting {
    color: #666;
    line-height: 1.5;
  }
  .issue-reporting a {
    color: #0066cc;
    text-decoration: none;
  }
  .issue-reporting a:hover {
    text-decoration: underline;
  }
</style>

<script>
  (function () {
    /*
      Dense peak TFLOPS per‑accelerator, by data type.
      Numbers are rounded public spec values (dense only).
      We divide H100, 
    */
    const PEAK_TFLOPS = {
      A100: { fp32: 156, fp16: 312, fp8: 0 },
      H100: { fp32: 989/2, fp16: 1979/2, fp8: 3958/2 },
      v5p: { fp32: 28, fp16: 459},
      v5e: { fp32: 11, fp16: 197},
      v6e: { fp32: 55, fp16: 918},
      v7: { fp32: 277, fp16: 4614},
    };

    // Approx FLOPs per token
    function flopsPerToken(paramsB, mode) {
      const n = paramsB * 1e9;
      return (mode === "training" ? 6 : 2) * n;
    }

    const $ = (id) => document.getElementById(id);

    function calculate() {
      const paramsB = parseFloat($("mfu-params").value);
      const tps = parseFloat($("mfu-tps").value);
      const num = parseInt($("mfu-num").value, 10);
      const accel = $("mfu-accel").value;
      const dtype = $("mfu-dtype").value;
      const mode = $("mfu-mode").value;

      if (
        isNaN(paramsB) ||
        isNaN(tps) ||
        isNaN(num) ||
        num <= 0 ||
        paramsB <= 0 ||
        tps <= 0
      ) {
        $("mfu-result").textContent = "";
        return;
      }

      const peakDense = PEAK_TFLOPS[accel][dtype];
      if (!peakDense) {
        $("mfu-result").textContent = `No dense ${dtype.toUpperCase()} spec for ${accel}.`;
        return;
      }

      const usedFlops = flopsPerToken(paramsB, mode) * tps;
      const peakFlops = peakDense * 1e12 * num;
      const mfu = usedFlops / peakFlops;
      $("mfu-result").textContent = `Estimated MFU: ${(mfu * 100).toFixed(2)}%`;
    }

    // Live‑update on every change/input
    [
      "mfu-params",
      "mfu-tps",
      "mfu-num",
      "mfu-accel",
      "mfu-dtype",
      "mfu-mode",
    ].forEach((id) => {
      const el = $(id);
      el.addEventListener("input", calculate);
      el.addEventListener("change", calculate);
    });

    calculate(); // initial
  })();

  (function () {
    const $ = (id) => document.getElementById(id);

    const BYTES_PER_TYPE = {
      fp32: 4,
      fp16: 2,
      fp8: 1
    };

    const GPU_MEMORY = {
      "A100-40": 40,
      "A100-80": 80,
      "H100": 80,
      "H200": 141,
      "B200": 192
    };

    function calculateIntegrated() {
      const paramsB = parseFloat($("integrated-params").value);
      const numGPUs = parseInt($("integrated-num-gpus").value, 10);
      const gpuType = $("integrated-gpu-type").value;
      const tpDegree = parseInt($("integrated-tp").value, 10);
      const seqLen = parseInt($("integrated-seq-len").value, 10);
      const fullLayers = parseInt($("integrated-full-layers").value, 10);
      const swaLayers = parseInt($("integrated-swa-layers").value, 10);
      const windowSize = parseInt($("integrated-window-size").value, 10);
      const kvHeads = parseInt($("integrated-kv-heads").value, 10);
      const headDim = parseInt($("integrated-head-dim").value, 10);
      const dtype = $("integrated-dtype").value;

      if (
        isNaN(paramsB) || isNaN(numGPUs) || isNaN(tpDegree) || isNaN(seqLen) ||
        isNaN(fullLayers) || isNaN(swaLayers) || isNaN(windowSize) ||
        isNaN(kvHeads) || isNaN(headDim) ||
        paramsB <= 0 || numGPUs <= 0 || tpDegree <= 0 || seqLen <= 0 ||
        fullLayers < 0 || swaLayers < 0 || windowSize <= 0 ||
        kvHeads <= 0 || headDim <= 0
      ) {
        $("integrated-kv-result").textContent = "";
        $("integrated-batch-result").textContent = "";
        return;
      }

      if (tpDegree > numGPUs) {
        $("integrated-kv-result").textContent = "";
        $("integrated-batch-result").textContent = "Error: TP degree cannot exceed number of GPUs";
        return;
      }

      const bytesPerElement = BYTES_PER_TYPE[dtype];
      const memoryPerGPU = GPU_MEMORY[gpuType];
      const totalMemory = memoryPerGPU * numGPUs;

      const modelMemoryBytes = paramsB * 1e9 * bytesPerElement;
      const modelMemoryPerGPU = modelMemoryBytes / tpDegree;

      const fullAttentionCachePerSample = fullLayers * seqLen * kvHeads * headDim * 2 * bytesPerElement;
      const swaCachePerSample = swaLayers * Math.min(seqLen, windowSize) * kvHeads * headDim * 2 * bytesPerElement;
      const kvCachePerSample = fullAttentionCachePerSample + swaCachePerSample;

      const cacheGB = kvCachePerSample / (1024 ** 3);
      const cacheMB = kvCachePerSample / (1024 ** 2);

      if (cacheGB >= 1) {
        $("integrated-kv-result").textContent = `KV Cache per Sample: ${cacheGB.toFixed(2)} GB`;
      } else {
        $("integrated-kv-result").textContent = `KV Cache per Sample: ${cacheMB.toFixed(2)} MB`;
      }

      const availableMemoryPerGPU = (memoryPerGPU * (1024 ** 3)) - modelMemoryPerGPU;

      if (availableMemoryPerGPU <= 0) {
        $("integrated-batch-result").textContent = "Error: Model exceeds available memory per GPU";
        return;
      }

      if (kvCachePerSample <= 0) {
        $("integrated-batch-result").textContent = "Error: Invalid KV cache configuration";
        return;
      }

      const maxBatchSizePerGPU = Math.floor(availableMemoryPerGPU / kvCachePerSample);
      const maxBatchSize = maxBatchSizePerGPU * (numGPUs / tpDegree);

      $("integrated-batch-result").textContent = `Max Batch Size: ${maxBatchSize}`;
    }

    [
      "integrated-params", "integrated-num-gpus", "integrated-gpu-type", "integrated-tp",
      "integrated-seq-len", "integrated-full-layers", "integrated-swa-layers",
      "integrated-window-size", "integrated-kv-heads", "integrated-head-dim", "integrated-dtype"
    ].forEach((id) => {
      const el = $(id);
      el.addEventListener("input", calculateIntegrated);
      el.addEventListener("change", calculateIntegrated);
    });

    calculateIntegrated();
  })();
</script>
