---
layout: page 
title: About
permalink: /about/
---

I just finished a honours degree in mathematics at the [University of Alberta](http://www.ualberta.ca), and just updated my[cv](/cv.pdf).

I have strange tastes. I dig improvisational comedy, computational finance, and minimalist design. 

# Projects

   1. *Bug Deduplication:* For CMPUT 466/551, I worked with a team to create a system that uses contextual data to predict whether or not two bug reports are duplicates. We used two main features:
      * We compared the stack traces between the two reports. Unfortunately, as only 1\% of the reports had stack traces, 0.01\% of the pairs had reports, so the stack trace comparison was useless as a feature. 
      * A comparison between the text in each report and a number of different technical texts (e.g. cryptography textbooks, networking textbooks, etc.). The textual comparisons proved to be incredibly powerful predictors, and gave very accurate results by themselves. 

      The added features were used to train machine learning classifiers through Weka. We got fairly good results: ~95%. The code is available on [Github](https://github.com/tannner/dedup), but it's not very well documented. We wrote a paper on the project that has been submitted for publication in [ICSME](http://www.icsme.org/). 
 
   2. *Mathematical Economics:* I worked with [Dr. Christoph Frei](http://www.math.ualberta.ca/~cfrei/) to study the convergence of the set of Perfect Public Equilibria for the Prisoner's Dilemma in Continuous Time. The work was an extension of [Sannikov's](https://www.princeton.edu/~sannikov/gamesRRR.pdf) paper on *Imperfectly Observable Actions in Continuous Time,* and showed that the set of PPE in discrete time converges to the continuous time set defined by Sannikov as the distance between repetitions goes to zero. I wrote a simulation in Matlab to show this graphically.  

   3. *Law & Economics:* I worked with [Dr. Claudia Landeo](http://www.artsrn.ualberta.ca/econweb/landeo/) to reconcile economic and legal theory. I explored judicial decision making in anti-trust law, and compared judicial rulings to economic theory; the goal of the project was to discover whether or not judicial decisions are economically valid; we discovered that they were (at least in our sub-area). 
