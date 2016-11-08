---
layout: post
title: Minimal example of how to do model selection in Python
tags: python machine learning
---

I've had a few people ask me how to do model selection correctly. Here's a
minimal example with `sklearn` in Python.

```{python}
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import Ridge

import numpy as np
import pandas as pd

# Load and process the data. In production, I'd split this into a function.
df = pd.read_csv('data.csv')
X = df[['import_val', 'origin_export_rca', 'origin_import_rca',
        'origin_eci', 'dest_export_rca', 'dest_import_rca', 'dest_eci']]
y = df['export_val']
X = X.as_matrix()
y = y.as_matrix()

# Train the model. Again, in production, I'd make this a function.
model = Ridge()
scores = cross_val_score(model, X, y, cv=5, scoring='mean_squared_error')
mean_mse, std_mse = np.mean(scores), np.std(scores)
print("mean MSE: %.2E, std MSE: %.2E" %(K, mean_mse, std_mse))
model.fit(X, y)
print("Writing predictions to file...")
df['Predicted'] = pd.Series(model.predict(X), index=df.index)
df.to_csv('pred_file.csv')
```

## Extensions

There are a number of ways you can modify this to make it ready for production.
I'll talk about a few of the most obvious ones:

1. Running the cross validation in parallel.
2. Using a grid search to find the optimal parameters to use in the model.
3. Pass the types of the columns to Pandas to load the data quicker and with
less memory. If you pass the types, you also have the added benefit of checking
that the data is the right type, and that there aren't any sneaky `None` in
your dataframe.


Pass `n_jobs=-1` to `cross_val_score` to run the cross validation in parallel:

```{python}
scores = cross_val_score(model, X, y, cv=5, scoring='mean_squared_error',
                         n_jobs=-1)
```

Use `grid search CV to determine the optimal parameters to use:

```{python}
from sklearn.model_selection import GridSearchCV

parameters = {'normalize': [True, False],
              'fit_intercept': [True, False],
              'alpha': [0, 0.2, 0.4, 0.6, 0.8, 1.0]}
model = GridSearchCV(Ridge(), parameters, cv=5,
                     scoring='mean_squared_error')
```

Tell Pandas what the types of the columns are to *massively* speed up loading
the data and to use significantly less memory:

```{python}
df = pd.read_csv('data.csv', dtype={var: float for var in ['import_val',
                                                           'origin_export_rca',
                                                           'origin_import_rca',
                                                           'origin_eci',
                                                           'dest_export_rca',
                                                           'dest_import_rca',
                                                           'dest_eci',
                                                           'export_val']})
```
