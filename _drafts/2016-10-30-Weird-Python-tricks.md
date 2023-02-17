---
layout: post
title: Weird (but useful) Python tricks
tags: python
---

## Sets

One of the most useful data structurers that people don't use:

```{python}
>>> from sets import Set
>>> engineers = Set(['John', 'Jane', 'Jack', 'Janice'])
>>> programmers = Set(['Jack', 'Sam', 'Susan', 'Janice'])
>>> managers = Set(['Jane', 'Jack', 'Susan', 'Zack'])
>>> employees = engineers | programmers | managers           # union
>>> engineering_management = engineers & managers            # intersection
>>> fulltime_management = managers - engineers - programmers # difference
>>> engineers.add('Marvin')                                  # add element
>>> print engineers
Set(['Jane', 'Marvin', 'Janice', 'John', 'Jack'])
>>> employees.issuperset(engineers)     # superset test
False
>>> employees.update(engineers)         # update from another set
>>> employees.issuperset(engineers)
True
```

## Defaultdict

Defaultdict can be used to create a graph (the data structure, not the
visualization) very easily:

```{python}
graph = collections.defaultdict(set)
for element in row[1:]:
    if row_type == 'friend_ids':
        graph[element].add(user)
    if row_type == 'follower_ids':
        graph[user].add(element)
```

### Sort a dict

Sort dict by the length of the list (which is the value)

```{python}
sorted_graph = sorted(friend_graph.items(),
                      key=lambda x: len(operator.itemgetter(1)(x)),
                      reverse=True)
```
