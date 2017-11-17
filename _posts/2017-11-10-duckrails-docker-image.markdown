---
layout: post
title:  "DuckRails v2.0.0 docker image"
description: "News: DuckRails can now be used via its own docker image."
date:   2017-11-10 00:05:00 +0300
image: "https://camo.githubusercontent.com/063ef000c181d49fb2f6a8f70ffcc5125755a577/687474703a2f2f692e696d6775722e636f6d2f33686d3047616a2e706e67"
preview: "DuckRails can now be used via its own docker image."
category: "news"
redirect_from:
  - /2017/11/10/duckrails-docker-image.html
---

[DuckRails](https://github.com/iridakos/duckrails) now has its own docker image.

[https://hub.docker.com/r/iridakos/duckrails/](https://hub.docker.com/r/iridakos/duckrails/)

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

![DuckRails home page](https://i.imgur.com/EINIB2h.png)

For a detailed guide, check the repository's [wiki page](https://github.com/iridakos/duckrails/wiki/Setup-DuckRails-via-Docker).

## Note
This was my first attempt to create a docker image so if you have any notes/improvements, you are more than welcomed to contribute. The Dockerfile is located at the root folder of the [DuckRails](https://github.com/iridakos/duckrails/blob/master/Dockerfile) repo.
