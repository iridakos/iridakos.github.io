---
layout: post
title:  "How to get away with code you don't understand"
description: ""
date:   2016-09-24 23:00:00 +0300
preview: "Sometimes it's hard to understand other people's code. There are many reasons for this. Here are some of them and some advice on how to handle them..."
category: "humor"
redirect_from:
  - /2016/09/24/get-away-with-code.html
---

Sometimes it's hard to understand other people's code. There are many reasons for this. Here are some of them and some advice on how to handle them.

#### **- Author thought Google will see it someday and tried to impress them**

In this case, you have to talk with the author.

More or less, in a calm way, you have to shout "OUR CODE IS NEVER GOING PUBLIC". You can do this while flipping a table if there is one nearby.

#### **- The names for variables & methods were chosen with a cat pressing random keys or when in a bad time**

Examples:
<pre>
int _at3_;
</pre>
<pre>
var vARIAbleNameinCamelCase;
</pre>
<pre>
function asdf3() { ... }
</pre>
<pre>
function justCallMe() { ... }
</pre>

In this case you should start referring to this author with another name including a number and special character.

For example:

[**Before**]

>Hi Mark

[**After**]

>Hi Mark2_


#### **- The comments were irrelevant**

Example:

<pre><code class="ruby"># Add a flash message informing user for the successful creation
counter++
return
</code></pre>

In this case you can append something irrelevant too.

Example:

<pre><code class="ruby"> # Add a flash message informing user for the successful creation
 # Buy milk & oranges from the super market
 counter++
 return
</code></pre>

#### **-The comments were not helpful**

In this case, you have to try to make them helpful.

Examples:

[**Before**]
<pre><code class="ruby"># TODO: document this
def whatever
  @data.inject({}) { |a, b| b._what?; a }
end
</code></pre>
[**After**]
<pre><code class="ruby"> # Injecting data and asking from b "what" so it returns a
def whatever
  @data.inject({}) { |a, b| b._what?; a }
end
</code></pre>

Don't forget to inform the author that you documented his/her code.

[**Before**]
<pre><code class="ruby"># WIP
def whatever
  @data.inject({}) { }
end
</code></pre>
[**After**]
<pre><code class="ruby"># I've pasted the following part that I saw
# somewhere else, it seems legit.
# Injecting data and asking from b "what" so it returns a
def whatever
  @data.inject({}) { |a, b| b._what?; a }
end
</code></pre>

Don't forget to inform the author that you resolved his/her WIP.

[**Before**]
<pre><code class="ruby"># FIXME
@data.inject({}) { |a, b| b; a }
</code></pre>
[**After**]
<pre><code class="ruby"># I fixed this, since it is ABCD... the
# order of the variables was incorrect, duh.
@data.inject({}) { |a, b| a; b }
</code></pre>

#### **- The comments were too many and made you sleepy**

Sleeping is a good thing, take the day off and go home.

![Irida (cat) sleeping](http://i.imgur.com/3q4YTHY.jpg)

### Important note

This is supposed to be a fun post, DO NOT TRY THIS AT WORK.
