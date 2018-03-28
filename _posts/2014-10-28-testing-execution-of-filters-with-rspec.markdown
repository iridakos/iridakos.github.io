---
layout: post
title:  "Testing execution of filters with RSpec"
description: "How to test the execution of controller filters with RSpec."
date:   2014-10-14 10:00:00 +0300
preview: "I was working on my application and I wanted to write some RSpec tests for some controllers having `before_filter` for some actions...."
category: "how-to"
comments: true
image: "https://iridakos.com/assets/images/irida-favicon.png"
identifier: "testing-exec-filters-rspec"
outline: true
tags: rspec rails ruby controllers mvc testing
popular: -1
show_popular_inline_posts: true
redirect_from:
  - /2014/10/14/testing-execution-of-filters-with-rspec.html
  - /testing/2014/10/14/testing-execution-of-filters-with-rspec
related_posts:
  - rails-radio-buttons-required-boolean
  - rescue-from-memory-leak
---

**UPDATE**: I created a gem to cover the functionality of this post. Visit its homepage [here](https://github.com/iridakos/rspec-matchers-controller_filters).

I was working on my application and I wanted to write some RSpec tests for some controllers having `before_filter` for some actions.

I didn't want to explicitly test the behaviour of the filter since it was already tested in another context. I only wanted to test that it is being executed.

Let's assume that this is our controller:

``` ruby
class FooController < ApplicationController
  before_filter :first_filter
  before_filter :second_filter, :only => [:edit, :update]

  def index
    # some code
  end

  def edit
    #some code
  end

  def update
    # some code
  end

  protected

  def first_filter
    # do something
  end

  def second_filter
    # do something
  end
end
```

So, we can write the following custom matcher (I placed it under `spec/support/matchers/filters.rb`):

``` ruby
RSpec::Matchers.define :execute_before_filter do |filter_name, options|
  match do |controller|
    controller.stubs(filter_name).raises(StandardError.new("Filter executed: #{filter_name}"))

    if options[:stub_filters]
      options[:stub_filters].each do |filter|
        controller.stubs(filter).returns(true)
      end
    end

    result = begin
      send(options[:via], options[:on], options[:with])
      false
    rescue StandardError => e
      e.message == "Filter executed: #{filter_name}"
    rescue
      false
    end
    result
  end

  failure_message do |actual|
    filter = expected[0]
    options = expected[1]
    action = options[:on]
    with = options[:via]
    params = options[:with]
    message = "expected #{actual.class} to execute filter #{filter}"
    message << " before action #{action}"
    message << " [requested via #{with} with params '#{params}']."
  end

  failure_message_when_negated do |actual|
    filter = expected[0]
    options = expected[1]
    action = options[:on]
    with = options[:via]
    params = options[:with]
    message = "expected #{actual.class} not to execute filter #{filter}"
    message << " before action #{action}"
    message << " [requested via #{with} with params '#{params}']"
  end
end
```

and then in our controller's spec we test the filter execution with the following code:

``` ruby
require 'rails_helper'

RSpec.describe FooController, :type => :controller do

  it { should execute_before_filter :first_filter, :on => :index, :via => :get }

  it { should execute_before_filter :first_filter, :on => :edit, :via => :get, :with => { :id => '1' } }
  it { should execute_before_filter :second_filter,
                                    :on => :edit,
                                    :via => :get,
                                    :with => { :id => '1' },
                                    :stub_filters => [:first_filter] }

  it { should execute_before_filter :first_filter, :on => :update, :via => :put, :with => { :id => '1' } }
  it { should execute_before_filter :second_filter,
                                    :on => :update,
                                    :via => :put,
                                    :with => { :id => :'1' },
                                    :stub_filters => [:first_filter] }
end
```

We use the `:ignore_filters` to stub possible prepended filters so that in case they brake due to missing stubbings etc, they don't mess with our test.

If we comment the `before_filter` declarations in the `FooController` => tadaaaaa:

![](https://1.bp.blogspot.com/-bQn2QNa2khs/VE_hB6TVtpI/AAAAAAAAA7Y/vnRKVmXyXJ0/s1600/irida.png)
