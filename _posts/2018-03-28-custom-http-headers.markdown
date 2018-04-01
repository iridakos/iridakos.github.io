---
layout: post
title:  "How to add a custom HTTP header in Rails"
description: "Set custom HTTP headers in responses of a Ruby on Rails application."
date:   2018-03-28 00:15:00 +0300
image: "http://iridakos.com/assets/images/irida-grey.png"
preview: "Set custom HTTP headers in responses of a Ruby on Rails application."
category: "how-to"
popular: -1
tags: ruby rails how-to http headers
identifier: "custom-http-headers"
comments: true
redirect_from:
  - /how to/2018/03/27/custom-http-headers
  - /how%20to/2018/03/27/custom-http-headers
related_posts:
  - hello-ruby-rails
  - todo-part-1
hidden: true
---

If you need to add a custom HTTP header in your responses in a Ruby on Rails application, all you have to do is to add the following:

```ruby
response.headers['<header name>'] = '<header value>'
```

either in a specific **action** or inside a **filter** of your application controller depending on whether you need this to be added in a specific or to all of your responses.

**Example**

```ruby
response.headers['CUSTOM'] = 'CUSTOM VALUE'
```

## Rails 5

From [Rails 5 and on](http://api.rubyonrails.org/classes/ActionDispatch/Response.html#method-i-set_header), you can also use the following:

```ruby
response.set_header('HEADER NAME', 'HEADER VALUE')
```
