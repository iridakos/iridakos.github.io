---
layout: default
title:  "Elasticsearch bucket aggregations and faceted navigation"
description: "A step by step tutorial for using Elasticsearch bucket aggregations to implement faceted navigation a.k.a. facets."
preview: "A step by step tutorial for using Elasticsearch bucket aggregations to implement faceted navigation a.k.a. facets."
date: 2018-09-22 20:00:00 +0300
image: "https://iridakos.com/assets/images/posts/elasticsearch-bucket-aggregations/post.jpg"
category: "tutorials"
identifier: "elasticsearch-bucket-aggregations"
outline: true
tags:
  - elasticsearch
  - aggregations
  - facets
  - search
popular: -1
related_posts:
  - elasticsearch-rails-tutorial
  - elasticsearch-linux-man-pages
---

## Introduction

I decided to write a series of tutorials for Elasticsearch aggregations since I recently used the feature for the first time and I found it amazing.
In this first post of the series, we are going to deal with the **bucket aggregations** that allows us to implement faceted navigation.

### What is Elasticsearch
[Elasticsearch](https://www.elastic.co/products/elasticsearch) is an opensource JSON-based search engine that allows us to search indexed data quickly and with options that are not provided by classic data stores.

> Elasticsearch is a distributed, RESTful search and analytics engine capable of solving a growing number of use cases. As the heart of the Elastic Stack, it centrally stores your data so you can discover the expected and uncover the unexpected.
> <cite>-- <a href="https://www.elastic.co/products/elasticsearch">official Elasticsearch product page</a></cite>

### What is Kibana

[Kibana](https://www.elastic.co/products/kibana) is a tool mainly allowing visualization of Elasticsearch data. In our case, we will use Kibana because it provides a very convenient way for writing and executing our queries supporting autocompletion.

> Kibana lets you visualize your Elasticsearch data and navigate the Elastic Stack, so you can do anything from learning why you're getting paged at 2:00 a.m. to understanding the impact rain might have on your quarterly numbers.
> <cite>-- <a href="https://www.elastic.co/products/kibana">official Kibana product page</a></cite>

### What are Elasticsearch bucket aggregations

Before familiarizing myself with the term **aggregations** in the Elasticsearch world, what I was actually trying to learn was how to implement the widely known feature of **facets** for my indexed data.

Chances are that you know about facets, you have seen it in many sites. They are usually placed as a sidebar in search results landing pages and they are rendered as links or checkboxes that act as filters to help you narrow the results based on their properties.

A section of Elasticsearch's [aggregations framework](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html) named **bucket aggregations** provides the functionality we need to implement a faceted navigation.

> Bucket aggregations don’t calculate metrics over fields like the metrics aggregations do, but instead, they create buckets of documents. Each bucket is associated with a criterion (depending on the aggregation type) which determines whether or not a document in the current context "falls" into it. In other words, the buckets effectively define document sets. In addition to the buckets themselves, the bucket aggregations also compute and return the number of documents that "fell into" each bucket.
> <cite>-- <a href="https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket.html">official elasticsearch bucket aggregations reference</a></cite>

## Prerequisites

In order to be able to execute the tutorial's commands and queries, you must first:

### Install Elasticsearch

Providing instructions for installing elasticsearch is out of scope. I recommend visiting the product's related [documenation site](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html). After the installation, just make sure to start the service if it's not started. You can check that with
```bash
curl http://localhost:9200
```

It should give something like:

```javascript
{
  "name" : "blabla",
  "cluster_name" : "elasticsearch",
  "cluster_uuid" : "blabla",
  "version" : {
    "number" : "6.4.2",
    "build_flavor" : "default",
    "build_type" : "deb",
    "build_hash" : "04711c2",
    "build_date" : "2018-09-26T13:34:09.098244Z",
    "build_snapshot" : false,
    "lucene_version" : "7.4.0",
    "minimum_wire_compatibility_version" : "5.6.0",
    "minimum_index_compatibility_version" : "5.0.0"
  },
  "tagline" : "You Know, for Search"
}
```

As you can see, we will use elasticsearch **version 6.4.2** in this tutorial.

### Install Kibana

I recommend following the [official instructions](https://www.elastic.co/guide/en/kibana/current/install.html) for installing kibana at your machine's OS. I followed [this guide](https://www.elastic.co/guide/en/kibana/current/deb.html) for installing the product via a repository in Ubuntu.

Start the kibana service and navigate to its home page at [http://localhost:5601](http://localhost:5601). We will use heavily the **Dev Tools** which is a powerful console talking to our elasticsearch engine.

![Kibana Dev tools]({{site.url}}/assets/images/posts/elasticsearch-bucket-aggregations/01-kibana-welcome.png)

## What we will cover

We are going to deal with:

- Simple (terms) aggregations and sub-aggregations
- Nested aggregations
- Global aggregations

Don't be afraid, everything will become very clear once we start playing with the data.

## Hands on

Let the fun begin.

### The model

Suppose that we want to implement a web application for city pet registrations.
We will define the following entities:

* **City office**: a city pet registration office
  * **city**: the city in which the office is located
  * **office_type**: the type of the office (central, district)
* **Citizen**: a citizen with registered pets
  * **occupation**: the occupation of the citizen
  * **age**: the age of the citizen
* **Pet**: a citizen's pet
  * **kind**: the kind of the pet (cat, dog etc)
  * **name**: the name of the pet
  * **age**: the age of the pet

Our entities relations are:

* One _city office_ **has many** _citizens_
* One _citizen_ **has many** registered pets

### Prepare the data

Before starting explaining the aggregations, we first have to create the index to store our data and then we have to feed this index with sample data.

#### Create the index

Navigate to Kibana's Dev Tools page and execute the following request:

```json
PUT city_offices
{
  "settings": {
    "number_of_shards": 1
  },
  "mappings": {
    "_doc": {
      "properties": {
        "city": {
          "type": "keyword"
        },
        "office_type": {
          "type": "keyword"
        },
        "citizens": {
          "type": "nested",
          "properties": {
            "occupation": {
              "type": "keyword"
            },
            "age": {
              "type": "integer"
            },
            "pets": {
              "type": "nested",
              "properties": {
                "kind": {
                  "type": "keyword"
                  },
                "name": {
                  "type": "keyword"
                },
                "age": {
                  "type": "integer"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

In the output section, you should see:

```json
{
  "acknowledged": true,
  "shards_acknowledged": true,
  "index": "city_offices"
}
```

We created an index with name `city_offices` with the [aforementioned properties](#the-model).

**Important note**: we chose to define the entity relations as **nested objects**. Why?

> The nested type is a specialised version of the object datatype that allows arrays of objects to be indexed in a way that they can be queried independently of each other ... Lucene has no concept of inner objects, so Elasticsearch flattens object hierarchies into a simple list of field names and values
> <cite>-- [official elasticsearch nested datatype reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html)</cite>

I will explain this with an example.

Suppose we had a city office with two citizens. One **35** year old **Dentist** and one 30 year old Developer.
If we used the **object** datatype, Elasticsearch would merge all sub-properties of the entity relation resulting to something like this:
```json
{
  "citizens": {
    "occupation": ["Dentist", "Developer"],
    "age": ["35", "30"]
  }
}
```
Thus, if we wanted to search the index for offices that have a **Dentist** citizen with age **30**, this document would fullfil the criteria even though the Dentist is 35 years old.

Mapping the relation as **nested** overcomes this problem since

> Internally, nested objects index each object in the array as a separate hidden document, meaning that each nested object can be queried independently of the others
> <cite>-- [official elasticsearch nested datatype reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html#_using_literal_nested_literal_fields_for_arrays_of_objects)</cite>

#### Feed sample data

I have created some sample data with random cities, occupations, pet names etc. You can find it at this tutorial's [GitHub repo](https://github.com/iridakos/iridakos-posts/tree/master/2018-09-22-elasticsearch-bucket-aggregations).

Download the file `sample-data.json` and from within the download folder execute:

```bash
curl -s -H "Content-Type: application/x-ndjson" -XPOST http://localhost:9200/_bulk --data-binary "@sample-data.json"; echo
```

**Note**: The data were generated with [this ruby script](https://github.com/iridakos/iridakos-posts/blob/master/2018-09-22-elasticsearch-bucket-aggregations/generate-random-data.rb). You can alter it as you please and execute it to produce your desired sample data json file.

That's it. Aggregations time.

### Terms aggregations

#### Sub-bucket aggregations

### Nested aggregations

### Global aggregations

## What's next

- Metric aggregations
- Post for rails facets
