---
layout: page
title: "What, exactly, is the GIL?"
articles: True
---

Most ML code is Python. This is surprising to many performance oriented engineers coming from
non-ML communities. Python is, notably slow and has the GIL, which forces it to only execute a single
thread at a time.

The GIL is a source of confusion for many Python developers, including myself! To refresh my
understanding, I wanted to write this article.

In short, the Global Interpreter Lock (GIL) is a lock that exists within the CPython interpreter, guaranteeing that only one thread is executing Python code at any given time. This prevents multiple threads from running Python code in parallel.

Of course, much useful code requires executing multiple threads in parallel, so this is a big problem. The GIL can be released, however, by using the Python C API. So the GIL is released by code which calls the Python C API to release it.

Notably, all of Python's blocking I/O primitives release the GIL while waiting for the I/O block to resolve. There's nothing magical about I/O here! It's simply a (relatively) slow operation implemented in a lower-level language which releases the GIL.

There are many other operations that release the GIL.

## When does Torch release the GIL?

From one of the maintainers: ["We do release the GIL as soon as we get out of python code. So for pytorch ops, it’s more or less all of them. The backward, unless you implement custom Functions, will run completely out of the GIL."](https://discuss.pytorch.org/t/can-pytorch-by-pass-python-gil/55498). If we look at a typical PyTorch training loop:

```
for batch, (X, y) in enumerate(train_dataloader): # Typically heavy Python code, holds the GIL.
    logits = model(X) # GIL is released during a bunch of the operations here.
    loss = loss_fn(logits, y) # GIL is released during a bunch of the operations here.

    optimizer.zero_grad() # Backend ops should release GIL.
    loss.backward() # Assuming it uses autograd, almost entirely outside of the GIL.
    optimizer.step() # Much of the ops that make up the bulk of the work here happen outside of the GIL.

    if batch % 100 == 0: # Python, holds the GIL.
        print(f"loss: {loss.item():>7f}") # Python, holds the GIL (and `loss.item()` triggers a host-device sync).
```

## When does Ray release the GIL?[^1]

Calls to `ray.get` or `ray.wait` will typically release the GIL, although it depends on the specifics, and it's not guaranteed. The concrete call chain for `ray.get` is:

public `ray.get(...)` in `worker.py`
which calls `worker.get_objects(...)`
which calls `self.core_worker.get_objects(...)`
whose Cython implementation in `_raylet.pyx` wraps the underlying `CCoreWorkerProcess.GetCoreWorker().Get(...)` call in `with nogil:`.

This is a typical example of the GIL! The GIL is released when you can Python code which ends in a call chain that calls the Python C API to release the GIL. There's no magic. This is why a typical pattern that I like to employ in async RL works; I like to have a single process orchestrating my job using Ray, and I'll spin up a bunch of threads on the process. Because the threads are constantly making calls to `ray.get`, they're constantly releasing and acquiring the GIL, so they work well together and don't starve each other of resources.

## When does vLLM release the GIL?

vLLM is largely a Python orchestrator around heavy accelerator operations. The GIL is released whenever threads execute:

- PyTorch tensor ops (ATen / CUDA kernels)
- NCCL communication calls
- Custom CUDA kernels (PagedAttention, FlashAttention, etc.)

These are implemented in native code and explicitly release the GIL in the same way as Torch.

[1]: Funnily enough, if you google "when does Ray release the GIL?" one of the top results is from the Beyblade wiki.
