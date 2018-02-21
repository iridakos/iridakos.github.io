---
layout: post
title:  "Rails radio buttons and required boolean attributes"
description: "How to deal with required boolean attributes and radio buttons in Ruby on Rails."
date:   2014-10-14 10:00:00 +0300
preview: "Lately, I was trying to create a form for one of my models which had a required boolean attribute."
category: "tips"
comments: true
image: "https://iridakos.com/assets/images/irida-favicon.png"
identifier: "rails-radio-buttons-required-boolean"
outline: true
popular: 4
redirect_from:
  - /2014/10/14/rails-radio-buttons-required-boolean.html
related_posts:
  - testing-exec-filters-rspec
  - rescue-from-memory-leak
---

Lately, I was trying to create a form for one of my models which had a required boolean attribute.

#### The model

``` ruby
class Foo < ActiveRecord::Base

  validates_presence_of :a_flag

end
```

#### The form

``` erb
<h1>Foos#new</h1>

<%= form_for @foo do |form| %>
    <% if @foo.errors %>
        <% @foo.errors.full_messages.each do |message| %>
            <%= message %>
            <br />
        <% end %>
    <% end %>
    <table>
        <tr>
            <td><%= form.label 'a_flag_true', 'Yes' %></td>
            <td><%= form.radio_button :a_flag, true %></td>
        </tr>

        <tr>
            <td><%= form.label 'a_flag_false', 'No' %></td>
            <td><%= form.radio_button :a_flag, false %></td>
        </tr>
    </table>

    <%= form.submit 'Answer' %>
<% end %>
```

So far so good.
Back to the browser now, everything seemed fine till the moment I tried to submit the **No** value.

![](https://1.bp.blogspot.com/-X73vr-AiqOk/VN70XfW0AXI/AAAAAAAABAY/F6o4ZzhrcAk/s1600/no-blank-error.png)

I googled around to find some answers on this and some suggested that I should use the inclusion validator. And so did I.

#### The updated model

``` ruby
class Foo < ActiveRecord::Base

  validates :a_flag,
            :inclusion => { :in => [true, false] }

end
```

Back to the browser everything seemed fine. I could submit both Yes and No values but there was a problem when I was trying to submit the form without selecting a value.

![](https://1.bp.blogspot.com/-EXTVFLg_Ht0/VN743cdp_GI/AAAAAAAABAw/E1WrcVJGagY/s1600/nil-list-error.png)

The error message was not quite what I wanted... And for sure, I wanted to find a solution that won't make me override default error messages.

And then I thought, what if I forced the presence validation only when the value was nil?

#### The model

``` ruby
class Foo < ActiveRecord::Base

  validates :a_flag,
            :presence => { :if => 'a_flag.nil?' }

end
```

I could now submit both values and the desired message was showing up if no selection was made.

![](https://1.bp.blogspot.com/-0XoIwnwcmCo/VN78ZLVK-kI/AAAAAAAABBQ/fK8PVq3pSfA/s1600/solution.png)

Done. Problem solved.
