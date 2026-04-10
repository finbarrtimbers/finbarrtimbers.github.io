---
layout: page
title: "What, exactly, is the GIL?"
articles: True
---

Most ML code is Python. This is surprising to many performance oriented engineers coming from
non-ML communities. Python is, notably slow and has the GIL, which forces it to only execute a single
thread at a time. The GIL primarily exists to make CPython’s memory management thread-safe. It has also become a load-bearing part of Python's API, as, in a classic example of [Hyrum's Law](https://www.hyrumslaw.com/), much Python code relies on the thread safety that it has created.

It is also both critically important _and_ a constant source of confusion for many Python developers, including myself! To refresh my understanding, I wrote this article.

In short, the Global Interpreter Lock (GIL) is a lock that exists within the CPython interpreter, guaranteeing that only one thread is executing Python bytecode at any given time. This prevents multiple threads from running Python bytecode in parallel. Note the language: "Python bytecode in parallel." Pure Python is interpreted into bytecode and executed. That cannot run concurrently.

Of course, much useful code requires concurrent execution, so this is a big problem. The GIL can be released, however, by using the Python C API, which provides primitives to explicitly release it. So the GIL is released by code which calls the relevant bits from the Python C API to release it.

A common refrain in Python is that "I/O releases the GIL." This is because all of Python's blocking I/O primitives release the GIL (i.e. call the relevant bits of the Python C API!) while waiting for the I/O block to resolve. There's nothing magical about I/O here! It's simply a (relatively) slow operation implemented in a lower-level language which releases the GIL.

There are many other slow operations implemented in a lower-level language that release the GIL.

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

Of course, all of the Python code executing between the pytorch ops will hold the GIL.

## When does Ray release the GIL?[^1]

Calls to `ray.get` or `ray.wait` will typically release the GIL, although it depends on the specifics, and it's not guaranteed. The concrete call chain for `ray.get` is:

public `ray.get(...)` in `worker.py`
which calls `worker.get_objects(...)`
which calls `self.core_worker.get_objects(...)`
whose Cython implementation in `_raylet.pyx` wraps the underlying `CCoreWorkerProcess.GetCoreWorker().Get(...)` call in `with nogil:`.

This is a typical example of the GIL! The GIL is released when you call Python code which ends up calling native code which calls the relevant bits of the Python C API to release the GIL. There's no magic!

This is why a typical pattern that I like to employ in async RL works; I like to have a single process orchestrating my job using Ray, and I'll spin up a bunch of threads on the process to handle other operations. Because the threads are constantly making calls to `ray.get`, they're constantly releasing and acquiring the GIL, so they work well together and don't starve each other of resources.

## When does vLLM release the GIL?

vLLM is largely a Python orchestrator around heavy accelerator operations. The GIL is released whenever threads execute:

- PyTorch tensor ops (ATen / CUDA kernels)
- NCCL communication calls
- Custom CUDA kernels (PagedAttention, FlashAttention, etc.)

These are implemented in native code and explicitly release the GIL in the same way as Torch (because they mostly are Torch). So, conveniently, you can have multiple threads running concurrently on your vLLM server, perhaps executing tool calls.

[1]: Funnily enough, if you google "when does Ray release the GIL?" one of the top results is from the Beyblade wiki.
