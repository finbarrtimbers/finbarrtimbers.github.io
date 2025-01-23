---
layout: page
title: "Request for research: Monte Carlo Tree Search for reasoning, with PUCT"
articles: True
math: True
---

In the recent wave of research studying reasoning models, by which we means models like O1 which are able to use long streams of tokens to "think" and thereby generate better results, MCTS has been discussed a lot as a potentially useful tool. However, some papers, like the [DeepSeek R1 paper](https://github.com/deepseek-ai/DeepSeek-R1/blob/main/DeepSeek_R1.pdf), have tried MCTS without any success.

I worked closely with MCTS for several years while at DeepMind, and there are a number of implementation details that I think researchers (such as DeepSeek) are either getting wrong or not discussing clearly. Here, I will discuss these, and issue a **Request for Research** in the hopes that some intrepid researcher will implement these so I can finally stop ~~complaining~~ suggesting that someone study this.

## Use PUCT, and not UCT

In the DeepSeek paper, they had a section discussing MCTS:

 ![DeepSeek discussion of MCTS](/static/images/deepseek-r1-mcts.png)

 In the section, the authors said "MCTS guided by a pre-trained value model." They repeated the phrase "value model" repeatedly, concluding that "while MCTS can improve performance during inference when paired with a pre-trained value model, iteratively boosting model performance through self-search remains a significant challenge." To me, the phrasing indicates that the authors are not using a learned prior function, as AlphaGo/Zero/MuZero did. If true, this is a mistake.

 In classic MCTS, an action-value function ( $Q(s, a)$) is used to estimate the value of each candidate action:

$$UCT(s,a) = Q(s,a) + c \sqrt{\frac{\ln N(s)}{N(s,a)}} = Q(s, a) + c E_{\text{uct}}(s, a)$$

 In the UCT equation, there are two terms: $Q(s, a)$ and the exploration term, which is the right side of the equation ($c$ is a hyper-parameter), and is solely a function of how many times the (state, action) pair has been visited. If the current node has been visited a small fraction of the times that the parent node N(s) has been visited, the exploration term is large, but it grows smaller as it is visited more.

In AlphaGo/AlphaZero/MuZero style MCTS, they use PUCT, where the exploration term is weighted by a learned prior function:

$$PUCT(s,a) = Q(s,a) + c P(s,a) \frac{\sqrt{N(s)}}{1 + N(s,a)} = Q(s, a) + c E_{\text{puct}}(s, a)$$

The weight is learned by having the network predict $N(s, a)/N(s)$, i.e. the % of times that the child node is visited during search.
By using the prior, MCTS is able to go much deeper. Consider chess, which has, on average,
[35 legal moves at any point in the game](https://en.wikipedia.org/wiki/Branching_factor). If you are doing N searches, and you visit
every legal move at a given state before moving on to a child state, you will only be able to explore $N^{\frac{1}{35}}$, which is tiny.
Most of these moves are obviously bad, so by using the prior to prune those nodes, search goes much deeper.

Consider also the form of the exploration term. $E_{\text{uct}}(s, a)$ assigns infinite weight to a (state, action) pair that hasn't been visited before,
while $E_{\text{puct}}(s, a)$ assigns it a value of 0 (or, in some implementations, different fixed values to allow for e.g. optimistic initialization).

As such, UCT will do a breadth first search, while PUCT will perform a depth-first search. Neither is superior to the other in a general sense, but in a domain
that has a large number of potential actions to take, like, say, language modelling, breadth-first search will not do much of anything.

My suggestion would be to use the standard logit head as the prior and train a value head on the same embeddings that the logit head gets.
Then, update this during the RL phase of training. While the experiments are inherently expensive, you can do the experiments on a small model, such as Llama 1B,
to see if they help.

## Parallel evaluations are required for action diversity

With MCTS, it is very easy to harm the diversity of your search if you don't search in parallel.
If using sequential search, make sure that you are using virtual visit counts as done in the ["Mastering Board Games by External and Internal Planning with Language Models"](https://deepmind.google/research/publications/139455/) paper, where they state:

"Parallel MCTS implementations usually rely on virtual losses (Chaslot et al., 2008; Mirsoleimani et al., 2017) to avoid multiple threads choosing
the same simulation paths down due to deterministic action choices."

Otherwise, search in parallel. The lack of parallelism is, in my mind, a big reason why the [Student of Games](https://arxiv.org/abs/2112.03178) struggled to beat AlphaZero in Chess/Go.

Generally the way that MCTS works is that you have two phases:

- search
- action selection

During search you have another two phases:

- simulation
- evaluation

An example is the [OpenSpiel MCTS implementation](https://github.com/google-deepmind/open_spiel/blob/master/open_spiel/algorithms/mcts.cc#L351),
although it is single-threaded and synchronous. In the simulation phase, you are
traversing the search tree and continuing to go down the search tree until you
 find a new node to add to the tree or until you reach a terminal state. In the
  evaluation phase you are running a neural network inference to say how good
  the given state is. Both of these can be done asynchronously and in parallel.

  So, you have some number of threads running simulations in parallel and each
  of them is queuing up evaluations which themselves are evaluated in parallel by a
  separate threadpool. The literature has shown that the exact number of threads used
   for both is critical and doing these asynchronously is also critical; both should be considered hyperparameters.

   When you are implementing the search tree you should make sure not to use locks.
    You want to use locks only when you are actually adding to the search tree.
    For the search tree itself, use atomics or some sort of structure that lets you
     add or modify the search statistics concurrently.

When you reach the action selection phase there's a bunch of different rules that you can use to choose the action that you're actually going to take
(there's obviously any number of action selection rules you could use, but here are 3 I've found useful):

1) Normalize the search visits and sample from the resulting probability distribution
2) Softmax the visit counts and sample from the resulting probability distribution
3) Choose the most visited action during search.

In the [approximate best response paper](https://arxiv.org/abs/2004.09677), my experience was that
some games, particularly the stochastic games, required the softmax rule to get the
best response, while others (particularly chess/go) required the "most visited" rule to get the best response.
