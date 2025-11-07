---
layout: page
title: "LLM Performance Tools"
permalink: /llm-performance
---

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
  <h2>KV Cache Size Calculator</h2>

  <label>
    Sequence length
    <input type="number" id="kv-seq-len" value="4096" min="1" step="1" />
  </label>

  <label>
    Number of full attention layers
    <input type="number" id="kv-full-layers" value="32" min="0" step="1" />
  </label>

  <label>
    Number of sliding window attention layers
    <input type="number" id="kv-swa-layers" value="0" min="0" step="1" />
  </label>

  <label>
    Sliding window size
    <input type="number" id="kv-window-size" value="4096" min="1" step="1" />
  </label>

  <label>
    Number of KV heads
    <input type="number" id="kv-heads" value="8" min="1" step="1" />
  </label>

  <label>
    Head dimension
    <input type="number" id="kv-head-dim" value="128" min="1" step="1" />
  </label>

  <label>
    Data type
    <select id="kv-dtype">
      <option value="fp8">FP8 (1 byte)</option>
      <option value="fp16" selected>FP16/BF16 (2 bytes)</option>
      <option value="fp32">FP32 (4 bytes)</option>
    </select>
  </label>

  <label>
    Batch size
    <input type="number" id="kv-batch-size" value="1" min="1" step="1" />
  </label>

  <div id="kv-result" class="mfu-result"></div>

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
          <li>Does not account for quantization overhead or alignment</li>
          <li>Does not account for framework overhead</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div class="mfu-container">
  <h2>Max Batch Size Calculator</h2>

  <label>
    Available memory (GB)
    <input type="number" id="batch-memory" value="80" min="1" step="1" />
  </label>

  <label>
    Model size (parameters, billions)
    <input type="number" id="batch-params" value="70" min="0" step="0.1" />
  </label>

  <label>
    Sequence length
    <input type="number" id="batch-seq-len" value="4096" min="1" step="1" />
  </label>

  <label>
    Number of full attention layers
    <input type="number" id="batch-full-layers" value="32" min="0" step="1" />
  </label>

  <label>
    Number of sliding window attention layers
    <input type="number" id="batch-swa-layers" value="0" min="0" step="1" />
  </label>

  <label>
    Sliding window size
    <input type="number" id="batch-window-size" value="4096" min="1" step="1" />
  </label>

  <label>
    Number of KV heads
    <input type="number" id="batch-kv-heads" value="8" min="1" step="1" />
  </label>

  <label>
    Head dimension
    <input type="number" id="batch-head-dim" value="128" min="1" step="1" />
  </label>

  <label>
    Data type
    <select id="batch-dtype">
      <option value="fp8">FP8 (1 byte)</option>
      <option value="fp16" selected>FP16/BF16 (2 bytes)</option>
      <option value="fp32">FP32 (4 bytes)</option>
    </select>
  </label>

  <div id="batch-result" class="mfu-result"></div>

  <div class="mfu-info" markdown="0">
    <div class="assumptions-container">
      <p class="assumptions-label">
        ℹ️ Assumptions*
      </p>
      <div class="assumptions-tooltip">
        <strong>Assumptions:</strong>
        <ul>
          <li>Assumes model weights and KV cache are the primary memory consumers</li>
          <li>Does not account for activation memory during forward pass</li>
          <li>Does not account for framework overhead</li>
          <li>Does not account for memory fragmentation</li>
          <li>Assumes uniform data type for model weights and KV cache</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<style>
  /* --- MFU calculator styles (scoped by the .mfu-container wrapper) --- */
  .mfu-container {
    font-family: system-ui, sans-serif;
    max-width: 640px;
    margin: 2rem auto;
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

    function calculateKVCache() {
      const seqLen = parseInt($("kv-seq-len").value, 10);
      const fullLayers = parseInt($("kv-full-layers").value, 10);
      const swaLayers = parseInt($("kv-swa-layers").value, 10);
      const windowSize = parseInt($("kv-window-size").value, 10);
      const kvHeads = parseInt($("kv-heads").value, 10);
      const headDim = parseInt($("kv-head-dim").value, 10);
      const dtype = $("kv-dtype").value;
      const batchSize = parseInt($("kv-batch-size").value, 10);

      if (
        isNaN(seqLen) || isNaN(fullLayers) || isNaN(swaLayers) ||
        isNaN(windowSize) || isNaN(kvHeads) || isNaN(headDim) || isNaN(batchSize) ||
        seqLen <= 0 || fullLayers < 0 || swaLayers < 0 ||
        windowSize <= 0 || kvHeads <= 0 || headDim <= 0 || batchSize <= 0
      ) {
        $("kv-result").textContent = "";
        return;
      }

      const bytesPerElement = BYTES_PER_TYPE[dtype];
      const fullAttentionCache = fullLayers * seqLen * kvHeads * headDim * 2 * bytesPerElement;
      const swaCache = swaLayers * Math.min(seqLen, windowSize) * kvHeads * headDim * 2 * bytesPerElement;
      const totalCachePerSample = fullAttentionCache + swaCache;
      const totalCache = totalCachePerSample * batchSize;

      const cacheGB = totalCache / (1024 ** 3);
      const cacheMB = totalCache / (1024 ** 2);

      if (cacheGB >= 1) {
        $("kv-result").textContent = `KV Cache Size: ${cacheGB.toFixed(2)} GB`;
      } else {
        $("kv-result").textContent = `KV Cache Size: ${cacheMB.toFixed(2)} MB`;
      }
    }

    [
      "kv-seq-len", "kv-full-layers", "kv-swa-layers", "kv-window-size",
      "kv-heads", "kv-head-dim", "kv-dtype", "kv-batch-size"
    ].forEach((id) => {
      const el = $(id);
      el.addEventListener("input", calculateKVCache);
      el.addEventListener("change", calculateKVCache);
    });

    calculateKVCache();
  })();

  (function () {
    const $ = (id) => document.getElementById(id);

    const BYTES_PER_TYPE = {
      fp32: 4,
      fp16: 2,
      fp8: 1
    };

    function calculateMaxBatchSize() {
      const memoryGB = parseFloat($("batch-memory").value);
      const paramsB = parseFloat($("batch-params").value);
      const seqLen = parseInt($("batch-seq-len").value, 10);
      const fullLayers = parseInt($("batch-full-layers").value, 10);
      const swaLayers = parseInt($("batch-swa-layers").value, 10);
      const windowSize = parseInt($("batch-window-size").value, 10);
      const kvHeads = parseInt($("batch-kv-heads").value, 10);
      const headDim = parseInt($("batch-head-dim").value, 10);
      const dtype = $("batch-dtype").value;

      if (
        isNaN(memoryGB) || isNaN(paramsB) || isNaN(seqLen) ||
        isNaN(fullLayers) || isNaN(swaLayers) || isNaN(windowSize) ||
        isNaN(kvHeads) || isNaN(headDim) ||
        memoryGB <= 0 || paramsB <= 0 || seqLen <= 0 ||
        fullLayers < 0 || swaLayers < 0 || windowSize <= 0 ||
        kvHeads <= 0 || headDim <= 0
      ) {
        $("batch-result").textContent = "";
        return;
      }

      const bytesPerElement = BYTES_PER_TYPE[dtype];
      const modelMemoryBytes = paramsB * 1e9 * bytesPerElement;
      const availableMemoryBytes = memoryGB * (1024 ** 3);
      const memoryForKVCache = availableMemoryBytes - modelMemoryBytes;

      if (memoryForKVCache <= 0) {
        $("batch-result").textContent = "Error: Model exceeds available memory";
        return;
      }

      const fullAttentionCachePerSample = fullLayers * seqLen * kvHeads * headDim * 2 * bytesPerElement;
      const swaCachePerSample = swaLayers * Math.min(seqLen, windowSize) * kvHeads * headDim * 2 * bytesPerElement;
      const kvCachePerSample = fullAttentionCachePerSample + swaCachePerSample;

      if (kvCachePerSample <= 0) {
        $("batch-result").textContent = "Error: Invalid KV cache configuration";
        return;
      }

      const maxBatchSize = Math.floor(memoryForKVCache / kvCachePerSample);
      $("batch-result").textContent = `Max Batch Size: ${maxBatchSize}`;
    }

    [
      "batch-memory", "batch-params", "batch-seq-len", "batch-full-layers",
      "batch-swa-layers", "batch-window-size", "batch-kv-heads",
      "batch-head-dim", "batch-dtype"
    ].forEach((id) => {
      const el = $(id);
      el.addEventListener("input", calculateMaxBatchSize);
      el.addEventListener("change", calculateMaxBatchSize);
    });

    calculateMaxBatchSize();
  })();
</script>
