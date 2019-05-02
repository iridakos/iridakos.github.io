---
layout: default
title:  "Manage nested objects in Elasticsearch documents"
description: "How to add, update and delete nested objects in Elasticsearch documents using the Update API and painless scripts."
preview: "How to add, update and delete nested objects in Elasticsearch documents using the Update API and painless scripts."
date: 2019-05-02 15:30:00 +0300
image: "https://iridakos.com/assets/images/posts/manage-nested-elasticsearch-objects/post.png"
category: "how-to"
identifier: "manage-elasticsearch-nested-objects"
outline: true
tags:
  - elasticsearch
  - opensource
  - scripts
  - "nested datatypes"
popular: -1
related_posts:
  - elasticsearch-bucket-aggregations
  - elasticsearch-linux-man-pages
  - elasticsearch-rails-tutorial
---

In this post we are going to manage [nested objects](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html) of a document indexed with Elasticsearch.

> The nested type is a specialised version of the object datatype that allows arrays of objects to be indexed in a way that they can be queried independently of each other.
> <cite>-- <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html">Nested datatype - Official Elasticsearch reference</a></cite>

## Prerequisites

To follow this post you need:

* an up and running [Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/6.7/setup.html) instance
  * *I use 6.7 here*
* an up and running [Kibana](https://www.elastic.co/guide/en/kibana/6.7/setup.html) instance to interact with Elasticsearch

## Preparation

The document of our index will represent a **human** and its nested objects will be **cats** (no surprises).

### Create the index

Open your Kibana dev console and type the following to create the index.

```json
# Create the index
PUT iridakos_nested_objects
{
  "mappings": {
    "human": {
      "properties": {
        "name": {
          "type": "text"
        },
        "cats": {
          "type": "nested",
          "properties": {
            "colors": {
              "type": "integer"
            },
            "name": {
              "type": "text"
            },
            "breed": {
              "type": "text"
            }
          }
        }
      }
    }
  }
}
```

Human has:
* a **`name`** property of type `text`
* a **`cats`** property of type `nested`

Each cat has:
* a **`colors`** property of type `integer`
* a **`name`** property of type `text`
* a **`breed`** property of type `text`

### Add a human

In the Kibana console, execute the following to add a human with three cats.

```json
# Index a human
POST iridakos_nested_objects/human/1
{
  "name": "iridakos",
  "cats": [
    {
      "colors": 1,
      "name": "Irida",
      "breed": "European Shorthair"
    },
    {
      "colors": 2,
      "name": "Phoebe",
      "breed": "European"
    },
    {
      "colors": 3,
      "name": "Nino",
      "breed": "Aegean"
    }
  ]
}
```

Confirm the insertion with:

```json
GET iridakos_nested_objects/human/1
```

You should see something like this:

```json
{
  "_index": "iridakos_nested_objects",
  "_type": "human",
  "_id": "1",
  "_version": 1,
  "found": true,
  "_source": {
    "name": "iridakos",
    "cats": [
      {
        "colors": 1,
        "name": "Irida",
        "breed": "European Shorthair"
      },
      {
        "colors": 2,
        "name": "Phoebe",
        "breed": "European"
      },
      {
        "colors": 3,
        "name": "Nino",
        "breed": "Aegean"
      }
    ]
  }
}
```

Done, moving on.

## Managing nested objects

### Add a new nested object

Suppose that `iridakos` got a new Persian cat named `Leon`. To add it in iridakos' collection of cats we will use the [Update API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html).

In Kibana:

```json
# Add a new cat
POST iridakos_nested_objects/human/1/_update
{
  "script": {
    "source": "ctx._source.cats.add(params.cat)",
    "params": {
      "cat": {
        "colors": 4,
        "name": "Leon",
        "breed": "Persian"
      }
    }
  }
}
```

**Notes**:

* We accessed the nested cat objects of our human with `ctx._source.cats`. This gave us a [collection](https://www.elastic.co/guide/en/elasticsearch/painless/6.7/painless-api-reference.html#painless-api-reference-Collection)
* We executed the [add](https://docs.oracle.com/javase/8/docs/api/java/util/Collection.html#add-java.lang.Object-) method on the collection to add a new cat
* The properties of the new cat (`params.cat`) were passed as parameters in the `params` attribute of the request under the attribute `cat`.

Confirm the addition with:

```json
GET iridakos_nested_objects/human/1
```

Cat added:

```json
{
  "_index": "iridakos_nested_objects",
  "_type": "human",
  "_id": "1",
  "_version": 2,
  "found": true,
  "_source": {
    "name": "iridakos",
    "cats": [
      {
        "colors": 1,
        "name": "Irida",
        "breed": "European Shorthair"
      },
      {
        "colors": 2,
        "name": "Phoebe",
        "breed": "European"
      },
      {
        "colors": 3,
        "name": "Nino",
        "breed": "Aegean"
      },
      {
        "colors": 4,
        "name": "Leon",
        "breed": "Persian"
      }
    ]
  }
}
```

### Remove a nested object

Suppose we want to remove `Nino` from the human's cat collection.

In Kibana:

```json
# Remove Nino
POST iridakos_nested_objects/human/1/_update
{
  "script": {
    "source": "ctx._source.cats.removeIf(cat -> cat.name == params.cat_name)",
    "params": {
      "cat_name": "Nino"
    }
  }
}
```

**Notes**:

* We accessed the nested cat objects of our human with `ctx._source.cats`. This gave us a [collection](https://www.elastic.co/guide/en/elasticsearch/painless/6.7/painless-api-reference.html#painless-api-reference-Collection)
* We executed the [removeIf](https://docs.oracle.com/javase/8/docs/api/java/util/Collection.html#removeIf-java.util.function.Predicate-) method on the collection to conditionally remove an item
* We provided a [Predicate](https://www.elastic.co/guide/en/elasticsearch/painless/6.7/painless-api-reference.html#painless-api-reference-Predicate) to the `removeIf` method in which we specify which items we want to remove. This predicate will be executed on each item of the collection and resolves to a Boolean value. If the resolution is `true` then the item will be removed. In our case, the condition is a simple equality check on the `cat`'s name attribute.
* The `cat_name` was passed as a parameter (`params.cat_name`) instead of fixing it to the script source.

Confirm the addition with:

```json
GET iridakos_nested_objects/human/1
```

Cat removed:

```json
{
  "_index": "iridakos_nested_objects",
  "_type": "human",
  "_id": "1",
  "_version": 3,
  "found": true,
  "_source": {
    "name": "iridakos",
    "cats": [
      {
        "colors": 1,
        "name": "Irida",
        "breed": "European Shorthair"
      },
      {
        "colors": 2,
        "name": "Phoebe",
        "breed": "European"
      },
      {
        "colors": 4,
        "name": "Leon",
        "breed": "Persian"
      }
    ]
  }
}
```

### Update a nested object

Suppose we want to change all cat breeds from `European` to `European Shorthair` (Phoebe is the only one in our case).

```json
# Update breed
POST iridakos_nested_objects/human/1/_update
{
  "script": {
    "source": "def targets = ctx._source.cats.findAll(cat -> cat.breed == params.current_breed); for(cat in targets) { cat.breed = params.breed }",
    "params": {
      "current_breed": "European",
      "breed": "European Shorthair"
    }
  }
}
```

**Notes:**

* We accessed the nested cat objects of our human with `ctx._source.cats`. This gave us a [collection](https://www.elastic.co/guide/en/elasticsearch/painless/6.7/painless-api-reference.html#painless-api-reference-Collection)
* We executed the [findAll](https://artifacts.elastic.co/javadoc/org/elasticsearch/painless/lang-painless/6.7.1/org/elasticsearch/painless/api/Augmentation.html#findAll%2Djava.util.Collection%2Djava.util.function.Predicate%2D) method on the collection to select specific items
* We provided a [Predicate](https://www.elastic.co/guide/en/elasticsearch/painless/6.7/painless-api-reference.html#painless-api-reference-Predicate) to the `findAll` method in which we specify which items we want to select. This predicate will be executed on each item of the collection and resolves to a Boolean value. If the resolution is `true` then the item will be selected. In our case, the condition is a simple equality check on the `cat`'s breed attribute.
* The `current_breed` was passed as a parameter (`params.current_breed`) instead of fixing it to the script source.
* We then loop on the selected cats (whose `breed` attribute has value `European`) and change their breed to the new value which we passed by another parameter `breed`.

Confirm the change:

```json
GET iridakos_nested_objects/human/1
```

Cat updated:

```json
{
  "_index": "iridakos_nested_objects",
  "_type": "human",
  "_id": "1",
  "_version": 5,
  "found": true,
  "_source": {
    "name": "iridakos",
    "cats": [
      {
        "colors": 1,
        "name": "Irida",
        "breed": "European Shorthair"
      },
      {
        "colors": 2,
        "name": "Phoebe",
        "breed": "European Shorthair"
      },
      {
        "colors": 4,
        "name": "Leon",
        "breed": "Persian"
      }
    ]
  }
}
```

#### Update multiple attributes of nested objects fulfilling multiple conditions

Now, in a more advanced example, we are going to use a more flexible script to:

* target objects based on multiple conditions (here colors and breed)
* update more than one attributes (here colors and breed)

Suppose we want to change the breed of cats who have `4 colors` and their breed is `Persian` to `Aegean` and their colors to `3`.

The script we will use is the following:

```json
# Update multiple attributes with multiple conditions
POST iridakos_nested_objects/human/1/_update
{
  "script": {
    "source": "def targets = ctx._source.cats.findAll(cat -> { for (condition in params.conditions.entrySet()) { if (cat[condition.getKey()] != condition.getValue()) { return false; } } return true; }); for (cat in targets) { for (change in params.changes.entrySet()) { cat[change.getKey()] = change.getValue() } }",
    "params": {
      "conditions": {
        "breed": "Persian",
        "colors": 4
      },
      "changes": {
        "breed": "Aegean",
        "colors": 3
      }
    }
  }
}
```

For convenience, here's the script source with proper indentation.
```java
def targets = ctx._source.cats.findAll(cat -> {
                                         for (condition in params.conditions.entrySet()) {
                                           if (cat[condition.getKey()] != condition.getValue()) {
                                             return false;
                                           }
                                         }
                                         return true; });
for (cat in targets) {
 for (change in params.changes.entrySet()) {
   cat[change.getKey()] = change.getValue()
 }
}
```

**Notes:**

* We select which cats we want to update by checking that their properties have the value specified in the `params.conditions` parameter.
* For each selected cat, we change its attributes' values as specified in the `params.changes` parameter.

Confirm:

```json
GET iridakos_nested_objects/human/1
```

Cat updated.

```json
{
  "_index": "iridakos_nested_objects",
  "_type": "human",
  "_id": "1",
  "_version": 5,
  "found": true,
  "_source": {
    "name": "iridakos",
    "cats": [
      {
        "colors": 1,
        "name": "Irida",
        "breed": "European Shorthair"
      },
      {
        "colors": 2,
        "name": "Phoebe",
        "breed": "European Shorthair"
      },
      {
        "name": "Leon",
        "colors": 3,
        "breed": "Aegean"
      }
    ]
  }
}
```

### Useful links

- [Elasticsearch reference - Mapping - Field datatypes - Nested datatype](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html)
- [Elasticsearch reference - Document APIs - Update API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update.html)
- [Elasticsearch reference - Painless API reference](https://www.elastic.co/guide/en/elasticsearch/painless/6.7/painless-api-reference.html)


That's all! Cat photo.

![I'll be back](https://iridakos.com/assets/images/programming-cat/terminator.png)


<div class="alert alert-light">
  <div class="alert-heading"><i class="fa fa-comments"></i> Comments and feedback</div>

  For feedback, comments, typos etc. please use this <a class="alert-link" href="https://github.com/iridakos/iridakos-posts/issues/2">issue</a>.

  <hr>

  <strong>Thanks for visiting!</strong>
</div>
