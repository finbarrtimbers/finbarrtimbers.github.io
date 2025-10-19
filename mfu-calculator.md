---
layout: page
title: "MFU Calculator"
permalink: /mfu-calculator
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
</script>
