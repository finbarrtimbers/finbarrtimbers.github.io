---
layout: post
title: Data science architecure
tags: machine learning statistics python
---

How do I approach data science problems?

Split the problem into the logically separate sub-problems and create functions
for each of the sub-problems that have a consistent interfeace. For a typical
application, this might look like:

1. Get the data
2. Pre-process the data
3. Classify the data
4. Save/upload the predictions.

So I would write a main function that looks something like:

```{python}
def main():
    X, y = get_data()
    X, y = preprocess(X, y)
    predictions = predict(X, y)
    save_predictions(predictions, "filename.csv")
```
