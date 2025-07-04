---
layout: page
title: "MFU Calculator"
permalink: /mfu-calculator
---

<!-- Paste everything below (after your Jekyll front‑matter) into a Markdown page -->

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
    Workload
    <select id="mfu-mode">
      <option value="inference">Inference</option>
      <option value="training">Training</option>
    </select>
  </label>

  <button id="mfu-calc">Calculate MFU</button>

  <div id="mfu-result" class="mfu-result"></div>
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
  .mfu-container button {
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    background: #0d6efd;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
  }
  .mfu-container button:hover {
    background: #0b5ed7;
  }
  .mfu-result {
    margin-top: 1.5rem;
    font-size: 1.25rem;
    font-weight: bold;
  }
</style>

<script>
  (function () {
    // Peak dense FP16/BF16 TFLOPS (per‑accelerator)
    const PEAK_TFLOPS = {
      A100: 312,
      H100: 1979,
      B200: 2250,
      v5p: 459,
      v5e: 197,
      v6e: 918,
      v7: 4614,
    };

    // FLOPs per token (approx.)
    function flopsPerToken(paramsB, mode) {
      const n = paramsB * 1e9;
      return (mode === "training" ? 6 : 2) * n;
    }

    const $ = (id) => document.getElementById(id);

    $("mfu-calc").addEventListener("click", () => {
      const paramsB = parseFloat($("mfu-params").value);
      const tps = parseFloat($("mfu-tps").value);
      const num = parseInt($("mfu-num").value, 10);
      const accel = $("mfu-accel").value;
      const mode = $("mfu-mode").value;

      if (isNaN(paramsB) || isNaN(tps) || isNaN(num) || num <= 0) {
        alert("Please fill all fields with valid numbers.");
        return;
      }

      const usedFlops = flopsPerToken(paramsB, mode) * tps;
      const peakFlops = PEAK_TFLOPS[accel] * 1e12 * num;
      const mfu = usedFlops / peakFlops;
      $("mfu-result").textContent = `Estimated MFU: ${(mfu * 100).toFixed(2)}%`;
    });
  })();
</script>
