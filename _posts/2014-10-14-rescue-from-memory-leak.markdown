---
layout: post
title:  "Rails and rescue from memory leak"
date:   2014-10-14 10:00:00 +0300
preview: "Lately, I've been trying to find possible memory leaks in a rails 3.2.x application..."
category: "rails"
comments: true
image: "http://iridakos.com/assets/images/irida-grey.png"
identifier: "rescue-from-memory-leak"
redirect_from:
  - /2014/10/14/rescue-from-memory-leak.html
---

Lately, I've been trying to find possible memory leaks in a rails 3.2.x application.

![](/assets/images/irida-small.jpeg)
NOT easy, believe me...

Anyway, after visiting almost every single result from googling *rails memory leak*, I learned something I didn't know. Symbols in ruby never die. (*Update 2016: No more [the case](http://www.infoq.com/news/2014/12/ruby-2.2.0-released) for the latest ruby versions)*.

Given that, I wrote some code to track the creation of symbols in the application by rendering a debugging kind of panel at the bottom of my application's layout which kept the previously generated symbols in an array and in each request, if new symbols where created, they were rendered as strings.

Something like this:

``` ruby
class Performance
  @@current_symbols = []

  def self.current_symbols
    @@current_symbols
  end

  def self.new_symbols
    all_symbols = Symbol.all_symbols
    result = all_symbols - @@current_symbols
    @@current_symbols = all_symbols
    result
  end
end
```

And in my partial something like:

``` erb
<% Performance.new_symbols.each do |symb| %>
  <%= symb %>
<% end %>
```

While browsing pages in my application, I noticed that a symbol with a specific pattern was being created:

`__bind_xxxxxxxxx`

Searching my code for this pattern had no results so I started searching in my application's gems. And there, it was in rails' active support [`Proc.rb`](http://apidock.com/rails/v3.2.13/Proc/bind).

``` ruby
# File activesupport/lib/active_support/core_ext/proc.rb, line 4
def bind(object)
  block, time = self, Time.now
  object.class_eval do
    method_name = "__bind_#{time.to_i}_#{time.usec}"
    define_method(method_name, &block)
    method = instance_method(method_name)
    remove_method(method_name)
    method
  end.bind(object)
end
```

After a lot of debugging, I found out that the cause if this symbol generation was caused by a

``` ruby
  rescue_from Exception do |exception|
    xxx
    xxx
  end
```

in my application controller.

The code above adds a rescue handler in the controller and when the time comes to handle, the following code from active support [`rescuable.rb`](https://github.com/rails/rails/blob/v3.2.13/activesupport/lib/active_support/rescuable.rb) is being executed:

``` ruby
def handler_for_rescue(exception)
  # We go from right to left because pairs are pushed onto rescue_handlers
  # as rescue_from declarations are found.
  _, rescuer = self.class.rescue_handlers.reverse.detect do |klass_name, handler|
    # The purpose of allowing strings in rescue_from is to support the
    # declaration of handler associations for exception classes whose
    # definition is yet unknown.
    #
    # Since this loop needs the constants it would be inconsistent to
    # assume they should exist at this point. An early raised exception
    # could trigger some other handler and the array could include
    # precisely a string whose corresponding constant has not yet been
    # seen. This is why we are tolerant to unknown constants.
    #
    # Note that this tolerance only matters if the exception was given as
    # a string, otherwise a NameError will be raised by the interpreter
    # itself when rescue_from CONSTANT is executed.
    klass = self.class.const_get(klass_name) rescue nil
    klass ||= klass_name.constantize rescue nil
    exception.is_a?(klass) if klass
  end

  case rescuer
  when Symbol
    method(rescuer)
  when Proc
    rescuer.bind(self)
  end
end
```

As you can see, if I didn't define my `rescue_from` part as a block but with a symbol of the method that would handle it, I wouldn't have the leak:

``` ruby
rescue_from Exception, :handle_my_exception

protected

def handle_my_exception
  xxx
  xxx
end
```
