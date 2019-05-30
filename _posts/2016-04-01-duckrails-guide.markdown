---
layout: default
title:  "DuckRails - Open source development tool for easily and dynamically mocking API endpoints"
preview: "An introduction and a guide for installing and using DuckRails, a development tool for mocking API endpoints easily and dynamically. Docker image available."
description: "An introduction and a guide for installing and using DuckRails, a development tool for mocking API endpoints easily and dynamically. Docker image available."
image: "https://3.bp.blogspot.com/-pmI-NvE9zv0/VuaG8aAk9pI/AAAAAAAABss/OFNa5S2LCncihZyMV1O7DrmEVCW6r9X9A/s640/new-mock-general.png"
date:   2016-04-01 10:00:00 +0300
category: "guides"
comments: true
outline: true
tags:
  - opensource
  - tools
  - developers
  - github
  - api
featured:
  state: true
  publications:
    - site: Ruby Weekly
      discriminator: ruby-weekly
      logo: <i class="fa fa-diamond"></i>
      data:
        - type: issue
          issue: "289"
          link: https://rubyweekly.com/issues/289
        - type: issue
          issue: "329"
          link: https://rubyweekly.com/issues/329
        - type: issue
          issue: "376"
          link: https://rubyweekly.com/issues/376
popular: -1
show_popular_inline_posts: true
identifier: "duckrails-guide"
redirect_from:
  - /2016/04/01/duckrails-guide.html
related_posts:
  - duckrails-docker-image
---

#### Update - Nov. 18, 2017
Please visit the updated [wiki pages](https://github.com/iridakos/duckrails/wiki) of the project at GitHub. This post is old and does not reflect any changes being made to the application.

***

[DuckRails](https://github.com/iridakos/duckrails) is a development tool.

Its main purpose is to allow developers to quickly and dynamically mock API endpoints.

## Why mock?

Some reasons to mock endpoints:

* The service you want to consume:
  * is still **under development**
  * is **not available**

and you don't want to implement the mocking inside your code.

There's also another interesting point which transforms the **DuckRails** from a development tool to an actual API (the tool needs a lot of improvements though in order to be used like this in production):
Since the mocks can be configured to be dynamic, you can actually wrap your actual endpoint and enhance it with new data, transformations on the original data and whatever else you can think of.


## Installation

First of all, you will need to clone the repo:

``` bash
git clone https://github.com/iridakos/duckrails.git
```

Then, you have to do some basic stuff pretty common for a Rails application:

``` bash
cd duckrails
bundle install
```

This will install all the required gems (libraries) the application needs.

You can use DuckRails either in development (quick setup) or production (better performance) mode.

### Development mode

``` bash
bundle exec rake db:setup
```

This will setup your database. **DuckRails** is configured to use MySQL as a database. You can change the file `config/database.yml` to make it match your custom database setup.
[Here's a guide](http://guides.rubyonrails.org/configuring.html#configuring-a-database) if this is your case.

``` bash
bundle exec rails server
```

This will start the application in development mode.

### Production mode

For production mode, you will need to do some extra steps.

Your env needs to have a `SECRET_KEY_BASE` variable (used to secure your sessions from tampering).

To generate a key, you can use:

``` bash
bundle exec rake secret
```

Then export the variable with the previous' command output.

``` bash
export SECRET_KEY_BASE="your_secret_key_base_here"
```

Setup the database:

``` bash
RAILS_ENV=production bundle exec rake db:setup
```

Precompile the assets (images, stylesheets & javascripts):

``` bash
RAILS_ENV=production bundle exec rake assets:precompile
```

Start the server:

``` bash
bundle exec rails s -e production
```

That's all. Navigate to `http://localhost:3000` and you should be seeing this:

![](https://1.bp.blogspot.com/-udj57BEmvSA/VuZ7PbsLCuI/AAAAAAAABsk/Akpnxf8OnlAV_5m2H6pl8YVvU7jZnx4lw/s640/welcome.png)

## Using DuckRails

The tool's functionality is pretty straight forward:
* you can view all your mocks
* create new mocks
* edit existing mocks
* delete mocks

### Mock configuration

Create a new mock by pressing the related button in the application home page.

![](https://3.bp.blogspot.com/-pmI-NvE9zv0/VuaG8aAk9pI/AAAAAAAABss/OFNa5S2LCncihZyMV1O7DrmEVCW6r9X9A/s640/new-mock-general.png)

There are 4 main sections allowing to configure a mock.

#### General

---

Here you can configure the general properties of the mock.

![](https://3.bp.blogspot.com/-pmI-NvE9zv0/VuaG8aAk9pI/AAAAAAAABss/OFNa5S2LCncihZyMV1O7DrmEVCW6r9X9A/s640/new-mock-general.png)

* **Name**: a name for this mock
* **Description**: a general description for the mock, other users using the tool may want to understand your mock and this is a good place to explain it
* **Method**: select the HTTP method this mock matches to. This value along with the route path is going to create a unique "endpoint" serving your mock.
* **Status**: fill in the HTTP Status code this mock will respond with upon call (you can set dynamic status, view the Advance section of this document).
* **Route path**: fill in the path of the mock.
  You can use path variables, example: `/authors/:author_id/posts/:post_id` and these will be available later on, when you configure the mock's body via the `@parameters` variable (see below).

#### Response body

---

In this tab, you configure the response's body.

![](https://2.bp.blogspot.com/-zeliz0PhFLE/VuaI92fkQXI/AAAAAAAABs4/7HartGwm3Sc04GKWgIgrqry2TH0tqL3og/s640/response-body.png)

* **Body type**: select the type of the body's content. You can either select:
  * *Static*: implying that the response body will always be the same, no further process
  * *Embedded ruby*: the response's body will be dynamic and what you fill in the Body content field will be evaluated as embedded ruby script (See the Advanced section of the document for an example).
  * *Javascript*: the response's body will be dynamic and what you fill in the Body content field will be evaluated as Javascript (See the Advanced section of the document for an example).
* **Content type**: select the content type of the response. The content type can be dynamic, I will explain later on.
* **Body content**: fill in the response's body (static or embedded ruby depending on your previous selection).

#### Headers

---

In this tab you can add headers to the mock's response.

![](https://1.bp.blogspot.com/-tahkHpsyIjM/VuaKcnmfcjI/AAAAAAAABtE/2Xgf6bzA6kU1TSGAds0QBCkVXFstM4jUg/s640/headers.png)

* **add header**: click the link to add new header
* **Name**: fill in the header's name
* **Value**: fill in the header's value
* **x**: remove the header

You can set dynamic headers, see the Advanced section of this document.

#### Advanced

---

In this tab you can set some advanced configuration for the mock.

![](https://1.bp.blogspot.com/-YL_Ej-Ccnvw/VuaNbvy3oQI/AAAAAAAABtQ/Svmw8XUmp5cYVMTo3h8nfFDF58PaVYeGA/s640/advanced.png)

The script field is expected to be evaluated to a JSON.
The evaluated JSON's keys can have values that will override previously (un)defined values:

* **headers**: an array of hashes with keys:
  * **name**: the name of the header
  * **value**: the value of the header
* **status_code**: the HTTP status of the response
* **content_type**: the content type of the response
* **body**: the response body

Besides the evaluated JSON, here is the place to add code to do stuff like simulating a delay.

Here's an example script:

``` erb
<% sleep 5 %>
<%=
  {
    headers: [
      {name: 'Dynamic-Header', value: SecureRandom.uuid},
      {name: 'Foo-Date', value: Date.today}
    ],
    status_code: @parameters[:whatever].present? ? 200 : 400,
    content_type: @parameters[:format].present? ? "application/#{@parameters[:format]}" : 'text/plain',
    body: '<h1>New response body</h1>'
  }
%>
```

The `sleep 5` above is going to delay the response for 5 seconds.
The evaluated JSON is going to add two dynamic headers and set the status code & content type of the response based on the `@parameters` variable values.

#### Embedded ruby

---

Both in "Body content" of the Response body tab & in "Script" of the Advanced tab, you can access the following variables:

* `@parameters`: a hash containing the request's parameters (including the path parameters of your route)
* `@request`: the request itself
* `@response`: the response

Example:

Using the following code in the Response body content field:

``` erb
<div>This is a text mock</div>
<h1>Author id: <%= @parameters[:author_id] %></h1>
<h2>Post id: <%= @parameters[:post_id] %></h2>
```

and setting your route path to:

```
/authors/:author_id/posts/:post_id
```

your mock will be served like this:

![](https://2.bp.blogspot.com/-Ieo859uBINw/VuaTrpVHR4I/AAAAAAAABtg/qG-13iamFZMKyXDrNPEddCKl_tztL_dNw/s1600/mock-serve.png)

Feel free to open issues for the tool [here](https://github.com/iridakos/duckrails/issues).

If you need some help regarding the documentation, make sure to label your issue as `help wanted`
