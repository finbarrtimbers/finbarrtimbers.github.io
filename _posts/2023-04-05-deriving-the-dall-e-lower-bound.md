---
layout: page
title: Deriving the DALL-E lower bound
articles: True
math: True
---

<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  TeX: { equationNumbers: { autoNumber: "AMS" } }
});
</script>

In the [DALL-E paper](https://arxiv.org/abs/2102.12092), we want to model the joint likelihood of the model distribution over images $$x$$, captions $$y$$, and tokens $$z$$ for an encoded RGB image[^1].

[^1]: Encoded using a dVAE— see the DALL-E paper for details.

The joint likelihood is modelled using the factorization

\begin{equation}
\label{eq:factorization}
p_{\theta, \psi}(x, y, z) = p_\theta(x | y, z) p_\psi(y, z)
\end{equation}

The paper presents this lower bound

\begin{equation}
\label{eq:lower-bound}
\ln p_{\theta, \psi}(x, y) \geq \mathbb{E}\_{z \thicksim q\_\phi(z |x)} \left( \ln p_\theta (x | y, z) - D_{KL}(q_\phi(y, z | x), p_\psi(y, z))\right)
\end{equation}


It was unclear to me how this was derived (and apparently [unclear to others](https://github.com/openai/DALL-E/issues/20)), so I thought I’d try to derive it myself.

The [evidence lower bound](https://en.wikipedia.org/wiki/Evidence_lower_bound) lets us write

$$\ln p_{\theta, \psi}(x, y) \geq \mathbb{E}_{z \thicksim q_\phi}\left[ \ln \dfrac{p_{\theta, \psi}(x, y, z)}{q_\phi(z)}\right]$$

From the factorization of the joint likelihood, we can rewrite this as

$$\mathbb{E}_{z \thicksim q_\phi}\left[ \ln \dfrac{p_{\theta, \psi}(x, y, z)}{q_\phi(z)}\right] = \mathbb{E}_{z \thicksim q_\phi}\left[ \ln \dfrac{p_\theta(x | y, z) p_\psi(y, z)}{q_\phi(z)}\right]$$

Distributing the logarithms throughout gives us:

$$= \mathbb{E}_{z \thicksim q_\phi}\left[ \ln p_\theta(x | y, z) + \ln p_\psi(y, z) - \ln q_\phi(z)\right]$$

Now, we can do some mechanical substitutions here:

$$= \mathbb{E}_{z \thicksim q_\phi}\left[ \ln p_\theta(x | y, z)\right] + \mathbb{E}_{z \thicksim q_\phi}\left[\ln p_\psi(y, z) - \ln q_\phi(z)\right]$$

$$= \mathbb{E}_{z \thicksim q_\phi}\left[ \ln p_\theta(x | y, z)\right] + \mathbb{E}_{z \thicksim q_\phi}\left[\ln \dfrac{p_\psi(y, z)}{ q_\phi(z)}\right]$$

Now, note that the term on the right is precisely the KL-divergence between $$q_\phi$$ and $$p_\psi$$:

$$D_{KL}(q_\psi(y, z | x) || p_\psi(y, z)) = \mathbb{E}\left[\ln \dfrac{q_\psi(y, z | x)}{p_\psi(y, z)}\right] = -\mathbb{E}\left[\ln \dfrac{p_\psi(y, z)}{q_\psi(y, z | x)}\right]$$

So we can write:

$$\mathbb{E}_{z \thicksim q_\phi}\left[ \ln \dfrac{p_{\theta, \psi}(x, y, z)}{q_\phi(z)}\right] = \mathbb{E}_{z \thicksim q_\phi}\left[ \ln p_\theta(x | y, z)\right] - D_{KL}\left(q_\psi(y, z | x) || p_\psi(y, z)\right)$$

Which, when combined with Equation \eqref{eq:lower-bound}, gives us our lower bound.
