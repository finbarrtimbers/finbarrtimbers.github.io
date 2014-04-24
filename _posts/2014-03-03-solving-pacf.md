---
layout: post
title: Solving Partial Autocorrelation Functions
tags: time-series statistics ARMA
---

I've been studying time series through [TSA][1]. The book presents a structured approach to time series analysis, and covers the material fairly well; I was impressed with the description of what a partial autocorrelation function (PACF) is, as the book explained it more intuitively than the lecture notes did. I did find the description of how to actually solve for the PACF a bit confusing, so I wrote my own explanation. 

## Partial Autocorrelation Functions

What are PACFs, and why would one want to use one? As explained in TSA, the PACF is useful as it provides an analog to the autocorrelation function, or ACF, but for autoregressive processes. The ACF is particularly useful as for an $$ MA(q)$$, the autocorrelation function $$\gamma(m)$$ has the nice property that

$$
\begin{align*}
  \gamma(m) = 0 \text{ for } m > q.
\end{align*}
$$

Consequently, by plotting the ACF (as can be done [easily](http://bl.ocks.org/timbers/9318155) in R), we can detect the order of the $$MA(q)$$ process.

The property fails for the ACF of an $$ AR(p) $$ process. However, the PACF is here to step in and save the day. With the PACF defined as

$$
\begin{align*}
\phi_{mm} := \alpha^{\star}_{m, m},
\end{align*}
$$

where the $$ \alpha^{\star}_{j, k} $$ are defined as

$$
\begin{align*}
\alpha_{1, m}, \cdots, \alpha_{m, m} = \text{argmin} E(X_{t} - \alpha_{1, m} X_{t-1} - \cdots - \alpha_{m, m} X_{t-m})^2.
\end{align*}
$$

Then, the PACF exhibits the property that for an $$ AR(p) $$ process, $$ \phi_{pp} = \phi_{p}$$, and $$ \phi_{mm} = 0$$ for $$ m > p$$; consequently, by calculating the PACF of a process, we can easily detect the order of it if it is autoregressive.

## Example 1

Suppose we have the process

$$
\begin{align*}
X_{t} = \phi_1 X_{t-1} + \phi_2 X_{t-2} + w_t,
\end{align*}
$$

where $$ w_t $$ is a sequence of uncorrelated variables with zero mean and constant variance. What is the PACF for this process? As the AR polynomial $$ \phi(B) $$ has no roots with $$ |B| \leq 1, X_{t} $$ is a weakly stationary process; consequently,  we know that $$ \phi_{22} = \phi_2, \phi_{mm} = 0 $$ for $$ m > p $$. Consequently, we only need to figure out $$\phi_{11}$$. To find it, we must solve

$$

\begin{align*}
\text{argmin} E(X_{t} - \phi_{11} X_{t-1})^2\\
\end{align*}

$$

To do so, we take the derivative with respect to $$ \phi_{11} $$ and set it equal to zero:

$$
\begin{align*}
 &E[-2X_{t-1}(X_{t} - \phi_{11} X_{t-1})] = 0 \\
\iff &-2 \gamma(1) + 2 \phi_{11} \gamma(0) = 0 \\
\iff & \phi_{11} = \rho(1)
\end{align*}
$$

Now, we need to solve for $$ \rho $$ in terms of $$ \phi_{1}, \phi_{2} $$. To do this, we exploit the Yule-Walker equations:

$$
\begin{align*}
\gamma(1) - \phi_{1} \gamma(0) - \phi_{2} \gamma(1) &= 0\\
\rho(1) &= \phi_{1} + \phi_{2} \rho(1) \\
\longrightarrow \phi_{11} = \rho(1) &= \frac{ \phi_{1} }{ 1 - \phi_{2} }
\end{align*}

$$


[1]: http://www.stat.pitt.edu/stoffer/tsa3/
