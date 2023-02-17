---
layout: page
title: ARIMA, ARMA, what's the difference? 
tags: time-series ARMA
---

I'm working through [TSA]([1]), and I noticed that some of my classmates are struggling to understand the difference between an ARIMA process, an AR process, and a MA process, not to mention seasonal version of the above.

Using $$B$$ as the lag operator, i.e. $$BX_t = X_{t-1}$$, an *ARIMA(p, d, q) process* is a discrete time stochastic process of the form

$$
\phi(B) (1 - B)^d X_t = \theta(B)w_t,
$$

where $$\phi$$ is a polynomial of degree *p*, and $$\theta$$ is a polynomial of degree *q*. An *AR(p)* process is an ARIMA(*p, 0, 0*) process, and a MA(*q*) process is an ARIMA(*0, 0, q*) process. To make life even more complicated, we introduce the notion of seasonality:

An ARIMA$$(p, d, q) \times (P, D, Q)_s$$ model is a s.p. of the form 

$$
\Phi(B^s) \phi(B) (1 - B^s)^D (1 - B)^d X_t = \Theta(B^s)\theta(B)w_t,
$$

where $$\Phi(B)$$ is a polynomial of degree $$P$$, and $$\Theta(B)$$ is a polynomial of degree $$Q$$.

#### Example

Suppose we have the stochastic process 

$$
X_t = \frac 1 2 X_{t-1} + X_{t-4} - \frac 1 2 X_{t-5} + w_t - \frac 1 4 w_{t-4}.
$$

How can we write this as an ARIMA$$(p, d, q) \times (P, D, Q)_s$$ model? Note that 

$$
(1 - B^4) X_t = \frac 1 2 X_{t-1} - \frac 1 2 X_{t-5} + w_t - \frac 1 4 w_{t-4}.
$$

We can rewrite this as 

$$
(1 - B^4) X_t - \frac{1}{2} B (1 - B^4)X_t = (1 - \frac 1 4 B^4) w_t,
$$

or, more concisely,

$$
(1 - B^4) (1 - \frac 1 2 B) X_t = (1 - \frac 1 4 B^4) w_t.
$$

Consequently, we can see that $$X_t$$ is an ARIMA$$(1, 0, 0) \times (0, 1, 1)_4$$ process. 

[1]: http://www.stat.pitt.edu/stoffer/tsa3/
