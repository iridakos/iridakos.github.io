---
layout: post
title:  "DuckRails v2.0.0 docker image"
description: "News: DuckRails can now be used via its own docker image."
date:   2017-11-10 00:05:00 +0300
image: "https://github.com/iridakos/duckrails/blob/master/documentation/readme/resources/duckrails-home-page.png?raw=true"
category: "news"
comments: true
identifier: "duckrails-docker-image"
outline: true
show_popular_inline_posts: true
popular: -1
tags: opensource developers tools github api
redirect_from:
  - /2017/11/10/duckrails-docker-image.html
related_posts:
  - duckrails-guide
---

[DuckRails](https://github.com/iridakos/duckrails) now has its own docker image and so you can run the application without having to setup anything related to databases, secret keys etc. [https://hub.docker.com/r/iridakos/duckrails/](https://hub.docker.com/r/iridakos/duckrails/)

## Usage

You can now use:

```bash
docker pull iridakos/duckrails
```

to download the image and then you can start the application with:

```bash
docker run -p <port>:80 iridakos/duckrails
```
(replace `<port>` with the port you want to access the application locally).

Test that everything works as expected by navigating to
`http://localhost:<port>`

You should be seeing the DuckRails home page!

![DuckRails home page](https://github.com/iridakos/duckrails/blob/master/documentation/readme/resources/duckrails-home-page.png?raw=true)

For a detailed guide, check the repository's [wiki page](https://github.com/iridakos/duckrails/wiki/Setup-DuckRails-via-Docker).

## Note
This was my first attempt to create a docker image so if you have any notes/improvements, you are more than welcomed to contribute. The Dockerfile is located at the root folder of the [DuckRails](https://github.com/iridakos/duckrails/blob/master/Dockerfile) repo.
