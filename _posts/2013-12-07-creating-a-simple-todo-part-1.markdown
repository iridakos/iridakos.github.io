---
layout: post
title:  "Creating a simple ToDo application with Ruby on Rails - Part 1"
description: "First part of the tutorial creating a simple ToDo application with Ruby on Rails."
date:   2013-12-07 10:00:00 +0300
category: "tutorials"
comments: true
outline: true
image: "https://iridakos.com/assets/images/irida-favicon.png"
identifier: "todo-part-1"
popular: -6
tags: ruby rails tutorial todo application developers mvc
show_popular_inline_posts: true
redirect_from:
  - /2013/12/07/creating-a-simple-todo-part-1.html
related_posts:
  - learning-ruby
  - hello-ruby-rails
  - todo-part-2
  - todo-part-3
  - todo-part-4
  - todo-gtk-plus-ruby-tutorial
---

So, you learned [how to say "Hello world" with Ruby on Rails]({% post_url 2013-11-24-saying-hello-world-with-ruby-on-rails %}) and it's time to move on since that app is not something you will use unless you are the only one survived on earth.

In this part of the tutorial you will get familiar with the following items.

1.  saving objects (from now on we will use the rails term **model** for these)
2.  the rails console
3.  using haml for your views
4.  using Twitter Bootstrap CSS to make your application look nice

**You can find the complete code of the tutorial [here](https://github.com/iridakos/todo).**  

Let's start. Navigate to your workspaces directory from the command line and create the application:

{% highlight bash %}
rails new todo
{% endhighlight %}

Open the newly created directory **todo** with your favourite text editor (I use Sublime).

First, we will add the gems we will need. Open the Gemfile that is located at the root of the app's directory and add the following lines:
{% highlight ruby %}
gem 'haml'
gem 'bootstrap-sass', '~> 2.3.2.0'
gem 'simple_form'
{% endhighlight %}

and comment out the line:  

gem 'turbolinks'

adding a `#` at the beginning of the line (we won't use this gem for now).  

Also, open `application.js` which is located under `app/assets/javascripts` and **remove** the following line about turbolinks:  

{% highlight js %}
//= require turbolinks
{% endhighlight %}

If you "speak" Java, contents of the Gemfile are something like a classpath.
You define which libraries you are going to use.
Rails (**bundler** actually) is going to download and install these gems unless you already have them installed. We will do this now, from the command line:  

{% highlight ruby %}
cd todo
bundle install
{% endhighlight %}

Ok, let's see if we are good so far. Start the server:  

{% highlight ruby %}
rails server
{% endhighlight %}

From your browser navigate to `localhost:3000`. Are we OK?  

![Rails welcome aboard](https://3.bp.blogspot.com/-LKDXgX3VjUE/UqHlrYug95I/AAAAAAAAAew/rzpdLoPQ0m0/s1600/1.png)

Yes, we are.  

Open with your text editor the file `database.yml` which is located under the config directory:  
{% highlight bash %}
config/database.yml
{% endhighlight %}

As you can see, the application has already been configured to use the [SQLite](http://www.sqlite.org/) database engine for persistence.
This is ok for now but on an upcoming tutorial we are going to change this file in order to use MySQL.  

Our application is going to have a single model, **Task**, with the following properties:  

*   title: task's title
*   note: task's note (details etc)
*   completed: task's completion date

Let's create the model. From the command line:
{% highlight bash %}
rails generate model Task title:string note:text completed:date
{% endhighlight %}

![https://4.bp.blogspot.com/-kYYToZG0UAQ/UqJt6uRb09I/AAAAAAAAAkI/2joxfvGSkEI/s640/22.png](https://4.bp.blogspot.com/-kYYToZG0UAQ/UqJt6uRb09I/AAAAAAAAAkI/2joxfvGSkEI/s1600/22.png)

We decided to use:  

*   **string** for the title attribute (small data type)
*   **text** for the note attribute (longer pieces of textual data)
*   **date** for the completed attribute

From the command's output, we are currently interested for the first two files:

* `db/migrate/xxxxxxxxxxxxxxxxx_create_tasks.rb`
This is the migration.
Migrations are files which change your database's schema upon execution.
This specific file has the appropriate commands that will create the table for our tasks.
View the contents to get an idea of the commands.

* `app/models/task.rb`
This is the model.
Models are classes defining persistent objects.
This specific file defines our task model. If you open the file you will see that is actually an empty subclass of the `ActiveRecord::Base`.
We are going to add stuff there later on.  

At this point we are going to get familiar with the rails console - your best friend while developing rails applications.  

I suggest opening a new window/tab of the console application you're using (I use iTerm2) so that you can have access to both the rails console and the shell prompt of our application's root folder.
I have a third one for the `rails server` command.  

From the command line:  

{% highlight bash %}
rails console
{% endhighlight %}

or the equivalent

{% highlight bash %}
rails c
{% endhighlight %}

![Rails console)](https://2.bp.blogspot.com/-T0siYFO-30c/UqHwf9hAmwI/AAAAAAAAAfU/Z2XdDpO0SBo/s1600/3.png)

Imagine the rails console as an application in which you can directly execute your ruby code having all your application's files available (and some of them already loaded).  
Play a little with it, for example:  

![](https://3.bp.blogspot.com/-JYNL9tGcpoU/UqHx38tF17I/AAAAAAAAAfg/nP1LEN0Dw-Y/s1600/4.png)

Don't be scared by the example, read [here]({% post_url 2013-11-08-dont-give-up-on-ruby %}).  

Now, let's check our Task model. Just type `Task`:

![](https://4.bp.blogspot.com/-Jc8SR7bwgZM/UqH2uv3lDVI/AAAAAAAAAfw/NTygee5m4hg/s1600/5.png)

Hmmm.. Refresh your browser (at `http:://localhost:3000`).  

![](https://3.bp.blogspot.com/-df_owmXyYro/UqH3C7pupsI/AAAAAAAAAf4/ZbczJ-NAs-Y/s1600/6.png)

That's right. We generated the model migration but we didn't ask to apply it so that our database schema gets updated.

Let's do it now. From the command prompt:  
{% highlight bash %}
rake db:migrate RAILS_ENV=development
{% endhighlight %}

*Note: you may skip the `RAILS_ENV=development` part since this is the default*.

![](https://3.bp.blogspot.com/-Tc8AQLsmNoI/UqH4J_sz-BI/AAAAAAAAAgE/niZ8xqmDLE0/s1600/7.png)

Great. The table has been created. If you refresh your browser you'll see the default rails application page again.  

But re-typing `Task` in the rails console you'll see that you get the same error.
This happens because your environment was loaded the moment you executed the command `rails console` and at that moment the table indeed didn't exist.
You may reload the environment at any point using the command:  
{% highlight ruby %}
reload!
{% endhighlight %}

And there you have it:  

![](https://2.bp.blogspot.com/-LgRrfOB6o8w/UqJuVn3fAoI/AAAAAAAAAkQ/J1f8gFRckQ4/s1600/23.png)

Since our Task class is empty, what are all these properties? Where did they come from?

Well, `ActiveRecord` scans our table and automatically maps the column names to our model's attributes. Cool? Cool.  

As you may notice, there are two attributes there that we didn't ask for: `created_at` and `updated_at`
There were added automatically by our model generation command and `ActiveRecord` automatically assigns values to these columns upon creation & updates of a model. Cool? Cool.  

Let's create our first task. Within the rails console:

{% highlight ruby %}
Task.create(title:  'First task',  note:  'This task was created inside the rails console')
{% endhighlight %}

That's it. You just saved your first task. Now will load it in order to edit/update it and then to delete it.  
{% highlight ruby %}
task =  Task.first
{% endhighlight %}
![](https://2.bp.blogspot.com/-5NPBmgNGZp0/UqIAysW--YI/AAAAAAAAAgc/r52eoK-M5BI/s1600/9.png)

We loaded our task by selecting the first and only record of the Task model.  
Let's edit it:  
{% highlight ruby %}
task.title =  'First task - edited'
task.save
{% endhighlight %}

![](https://3.bp.blogspot.com/-rOx3Jpa4ah4/UqIBX18MbhI/AAAAAAAAAgk/a9v3uKaapl4/s1600/10.png)

And let's delete it:

{% highlight ruby %}
task.destroy
{% endhighlight %}
![](https://1.bp.blogspot.com/-UfkmaJr4PwI/UqIB4IWIbgI/AAAAAAAAAgw/FWFFlXsSBOc/s1600/11.png)

Confirm that we have no tasks anymore.
{% highlight ruby %}
Task.count
{% endhighlight %}
![](https://4.bp.blogspot.com/-tBhNgcfScoc/UqICKeGdfxI/AAAAAAAAAg4/BVeY9vsnWJc/s1600/12.png)

Ok, our model seems to be working fine. Time to start giving a face to our application.

The default views of a rails application are `erb` files that in the case of an html page you can imagine them as jsps but instead of Java you write ruby code.
We already have such a file in our application,  `application.html.erb`, open it in your text editor to view its contents (it's located under `app/views/layouts`).

![](https://1.bp.blogspot.com/-Qrj6fip6euY/UqIENujohVI/AAAAAAAAAhE/KPO_FoXqaEY/s1600/13.png)

This file is a layout meaning that you may use it to display content that you wish to be present to a lot (if not to all) of your application's pages. Each page you create will be `embedded` at line 11.
You may add whatever you want before & after the `yield` directive.

As you can see, the file contains both static and dynamic content (enclosed in `<%= %>` tags) and looks very much like a jsp page. We are going to change this now by using *[haml](http://haml.info/)*.
Why? Because our views will look clearer and more beautiful. It will be easier to read and update them.

The haml's general idea is:

*   use indentation to express hierarchy skipping end tags etc
*   ruby commands start with `-`
*   ruby embedded content starts with `=`
*   html tags start with `%`
*   use `#` for setting id's to your html elements
*   use `.` for setting css classes to your html elements

Now, rename the file to `application.html.haml` and replace the contents with the following:

{% highlight haml %}
!!!
%html
  %head
    %title Todo
    = stylesheet_link_tag    "application", media: "all"
    = javascript_include_tag "application"
    = csrf_meta_tags
  %body
    = yield
{% endhighlight %}

![](https://3.bp.blogspot.com/-ajux9zFSolg/UqIK2vzXwQI/AAAAAAAAAhU/weBiG4hToWQ/s1600/14.png)

As you can see we also removed the *turbolink* related stuff.

**IMPORTANT: Make sure to set your text editor to use 2 spaces instead of tabs!!!**

Got it? Isn't it simpler?
You'll see more haml code below that will help you understand it better but you may follow a simple [tutorial](http://haml.info/tutorial.html) later.

So, we will create our static pages controller now as we did at the previous tutorial. From the command line:
{% highlight bash %}
rails generate controller pages
{% endhighlight %}

Add a home action in the generated controller `pages_controller.rb` which is located under `app/controllers`:

{% highlight ruby %}
class PagesController < ApplicationController
  def home
  end
end
{% endhighlight %}

Create the corresponding (empty) home page file `home.html.haml` under `app/views/pages directory`.

Remove the comments from the `routes.rb` file which is located under the `config` directory and add the following line in order to have our home page being rendered as the root path of the application:
{% highlight ruby %}
root to:  'pages#home'
{% endhighlight %}

![](https://3.bp.blogspot.com/-gwItCMa5ZCs/UqIPWv2_qkI/AAAAAAAAAhg/GMCH_-BxWl4/s1600/15.png)

Refreshing your browser, you should now view an empty page (since our `home.html.haml` is empty).
**But** if you view the source of the page from your browser, you'll see the html of our layout.

![](https://2.bp.blogspot.com/-oFpofDqcJsU/UqIP9x2VsGI/AAAAAAAAAho/64Jl2mW-tj0/s1600/16.png)

Let's edit our layout to add some cool "bootstrapish" stuff.

We will add a hero unit with our application's name. If we didn't use haml, we would add something like:

{% highlight erb %}
<div class="row-fluid">
  <div class="span10 offset1">
    <div class="hero-unit">
      <h1>ToDo<h1>
      <p>Welcome to the tutorial's ToDo application</p>
    </div>
  </div>
</div>
{% endhighlight %}

The equivalent haml:

{% highlight haml %}
.row-fluid
  .span10.offset1
    .hero-unit.text-center
      %h1
        ToDo
      %p
        Welcome to the tutorial's ToDo application
{% endhighlight %}

So our `application.haml.html` now looks like:
![](https://4.bp.blogspot.com/-zJ_c6MVCtHg/UqJvjSeMqbI/AAAAAAAAAkk/z2nPrgAmn08/s1600/24.png)

In order to have the Boostrap magic enabled:

*   rename the `application.css` file which is located under `app/assets/stylesheets` to `application.css.scss`
*   add the following line to the bottom of the file:  

{% highlight css %}
@import  'bootstrap';
{% endhighlight %}

*   in `application.js` which is located under `app/assets/javascript` add the following before the line `//require_tree .`
{% highlight js %}
//= require bootstrap
{% endhighlight %}

Done. Refresh your browser and you should see this:

![](https://1.bp.blogspot.com/-wfC2D1m8tyo/UqJwI0YyDHI/AAAAAAAAAks/HpDO4VecwwA/s1600/1.png)

Time to add some task functionality.

In our home action of the pages controller we will keep all of our tasks in an instance variable named `@tasks`:

{% highlight ruby %}
def home
  @tasks = Task.all
end
{% endhighlight %}

and now we have them available to our view. We are going to show a table with all the tasks and an appropriate message if none exists. Add the following to your home.html.haml:
{% highlight haml %}
.container
  - if @tasks.empty?
    %span.text-warning There are no tasks!
  - else
    %table.table.table-hover.table-bordered
      %thead
        %tr
          %th Title
          %th Created at
          %th Completed
      %tbody
        - @tasks.each do |task|
          %tr
            %td
              %strong= task.title
            %td.text-info= task.created_at
            %td.text-success= task.completed
{% endhighlight %}

If you refresh you browser now, you should be seeing this:  

![](https://3.bp.blogspot.com/-lpIkTcD3vUI/UqJwI0s3qKI/AAAAAAAAAlA/5q86rQRP70k/s1600/2.png)

Add a task as we did before via the rails console just to see how it is being displayed:

![](https://1.bp.blogspot.com/-c_3QtYktkcc/UqJwI1JvtVI/AAAAAAAAAk8/1k5OPo47yC0/s1600/3.png)

We created our pages controller in order to handle the **static** pages of the application. The "static" word here doesn't mean static content but actions that do not belong in the context of a resource. This controller is described as a non-resourceful controller.

On the other hand, now, we need to create a controller for managing our model(resource) `Task`. We want this controller to handle actions (view, create, new, update & destroy) on our model. This kind of controllers is described as resourceful.

Rails helps us route these actions all at once with the resources method in our `routes.rb` file. By default, this method will route all available actions ([see here](http://guides.rubyonrails.org/routing.html#crud-verbs-and-actions)) but we can limit them to our needs as you'll see below. Add this line to `routes.rb`:
{% highlight ruby %}
resources :tasks
{% endhighlight %}

Now, from the command line execute this command to view the current routes:

{% highlight bash %}
rake routes
{% endhighlight %}

![](https://4.bp.blogspot.com/-AVUtMl8E_BI/UqIrZx38edI/AAAAAAAAAiw/XjJOuQwaJJo/s1600/21.png)

As you can see, a bunch of new routes have been created besides our root one. Notice the forth column of them. These are the actions that are mapped because of the addition of the resources method in `routes.rb`. 

We actually want all of them except the index since we are going to display our task index in the home page instead of a separate one. It's pretty clear what the others are supposed to do. So, let's remove the `index` action.

Change the resources call to the following:

{% highlight ruby %}
resources :tasks,  except:  [:index]
{% endhighlight %}

Gone.

![](https://4.bp.blogspot.com/-xlKrlUrVKT4/UqIttaNCOzI/AAAAAAAAAi8/HeKDjaDZMow/s1600/22.png)

Also notice that the actions are supposed to belong to a tasks controller(`tasks#action`). Guess what's next:

{% highlight bash %}
rails generate controller tasks
{% endhighlight %}

We created the tasks controller (`app/controllers/tasks_controller.rb`).

Now it's time to describe what we want to do. On the home page, we want to have the list of our tasks giving the ability to update/destroy each of them. We also want to give the ability to create new tasks.
We want all these actions to be executed the ajax way and not with redirects to new pages etc...

We will start with the `tasks#new` action. In the tasks controller:
{% highlight ruby %}
def new
  @task = Task.new
end
{% endhighlight %}

Here we initialize a Task and we keep it at the `@task` instance variable. In our home action, we were rendering a whole page but now we want just a modal with a form inside it to be shown. We will respond with javascript to accomplish this so the corresponding view of the new action won't be a `new.html.haml` but a `new.js.erb` one. Create it under `app/views/tasks`. 

Before continuing, we will add a modal window in the `home.html.haml` so that it is be available in the page for our scripts to access it. Add the following line to the end of you the file:
{% highlight haml %}
#modal.modal.fade
{% endhighlight %}

![](https://3.bp.blogspot.com/-nwVYK7VYcVs/UrHx6dnNLQI/AAAAAAAAAqE/GBIAxL5U6MU/s1600/1.png)

Edit the `new.js.erb` and add the following:
{% highlight js %}
m = $('#modal');
m.html('Foo');
m.modal('show');
{% endhighlight %}

We will correct the code above later but for the time being, let's see how does the modal appear in our page.

We need to add a button/link in the home page for the new action. We can add it to the layout actually so it is available on all pages (even though we are going to have only the home page in this tutorial). Edit the `application.html.haml` file in your text editor and add the following line in the hero unit:
{% highlight haml %}
= link_to 'New task', new_task_path,  class:  'btn btn-primary'
{% endhighlight %}

![](https://1.bp.blogspot.com/-8J-8tiTbj1Q/UqI0G50_MXI/AAAAAAAAAjU/6j1P2ol5PFY/s1600/24.png)

Now refresh your page in the browser:  

![](https://3.bp.blogspot.com/--MbGloCAfAQ/UqJwdms6NXI/AAAAAAAAAlE/VRt4mFargtY/s1600/4.png)

Nice. Press the button.

![](https://2.bp.blogspot.com/-gxwPxDqK80Q/UnxyAOQP4qI/AAAAAAAAAPg/Bpswk3rINEE/s1600/center.png)

Hmmm.. Error... Missing template...

What happened here since we have a view for the **new** action? In simple words, normal clicks of links are requesting the `html` format of our views. We have to request the `js` format and to do so change the link we added to the layout as below:
{% highlight haml %}
= link_to 'New task', new_task_path, class: 'btn btn-primary', remote: true
{% endhighlight %}

If you press the button now, you will see a modal with the word *Foo* as its content.

Before continuing, you should know what a **partial** is: a re-usable part of code (imagine it as a part of a view) which you may embed into other partials/pages/layouts etc.
So, if we have a part of a view that we want to use to other places too, we usually create a partial. 

In our case, we will create a partial that will be our form for creating a task. Then, in our `new.js.erb` we are going to replace the *Foo* string with this partial so the modal will display the Task form.
Partial files start with an underscore so create a file named `_task_form.html.haml` under `app/views/tasks` directory and add the following contents:
{% highlight haml %}
.modal-header
  %h1 New Task
= simple_form_for task, class: 'clearfix' do |f|
  .modal-body
    = f.input :title
    = f.input :note
    = f.input :completed
  .modal-footer
    = f.submit 'Save', class: 'btn btn-primary'
{% endhighlight %}

Also, open the `page.css.scss` file which is under `app/assets/stylesheets` and add the following rule to fix the bottom margin of the form displayed in a modal:
{% highlight scss %}
.modal form {
  margin-bottom: 0;
}
{% endhighlight %}

Finally, let's change the `new.js.erb` in order to render the partial in the modal:

{% highlight erb  %}
m = $('#modal');
m.html('<%= j(render partial: 'task_form', locals: {task: @task}) %>');
m.modal('show');
{% endhighlight %}

And now we can press the button *New task*:

![](https://1.bp.blogspot.com/-HWF3_ZYiBkk/UqJySZRwz-I/AAAAAAAAAlQ/w5frc1R0I_8/s1600/5.png)

As you can see, `simple_form` picked to render the title as a simple input text, note as a `textarea` and, well, the completed date field as a combination of three selects. Let's change the last one because it doesn't look nice.

To achieve this we will tell simple_form to render it as a simple text field, then we will add a specific class to this input and using javascript we are going to create a nice calendar.

First change the line of the task form from:

``` haml
= f.input :completed
```

to

``` haml
= f.input :completed, as: :string, input_html: {class: 'datepicker'}
```

We will need a new gem, so add it to the end of your `Gemfile`:

{% highlight ruby %}
gem  'bootstrap-datepicker-rails'
{% endhighlight %}

Edit `application.css.scss` which is under `app/assets/stylesheets` and add the following before line  `*= require_tree .`

``` scss
*=  require bootstrap-datepicker
```

Edit `application.js` and add the following before line `*//= require_tree .*`

``` javascript
//= require bootstrap-datepicker
```

Now, we have to create a javascript function that will apply the datepicker behaviour of the gem to the appropriate inputs. We'll do this in a fancy way. Open the `pages.js.coffee` file and add the following:

``` coffeescript
$.fn.extend {
  integrateDatepicker: (selector)->
    selector = selector || '.datepicker'
    $(@).find(selector).datepicker()
}
$(document).ready () ->
  $('body').integrateDatepicker()
```

What did we do here? 

We extended the jQuery prototype in order to add a function (`integrateDatepicker`) that will search the children of the current element with a given selector and apply the datepicker behaviour on them.
We also call this function when the document is ready on the body in order to avoid the explicit call on freshly rendered pages.
Now, since our form was not present during the `ready` callback of the document, the behaviour hasn't been added to our `completed` input. Thus, we must add the following line at the end of the `new.js.erb`:

``` js
$('#modal').integrateDatepicker();
```

Refresh and there it is:

![](https://2.bp.blogspot.com/-vSvB3qOWx8E/UqJ6HzPNnqI/AAAAAAAAAlg/gw9xz9uB36Y/s1600/6.png)

Since this form was created for the `@task` instance variable of the controller and since that `@task` does not exist but it is a new one, its action (the form's action) has automatically been resolved to the `create` action of the controller. Don't believe me? Press the save button:

![](https://1.bp.blogspot.com/-HECWR77_qYI/UqJ7FoFo8wI/AAAAAAAAAlo/uQmlyyrUakE/s1600/7.png)

Open the tasks controller and add the following:

``` ruby
def create
  @task = Task.create(task_params)
  redirect_to root_path
end
private
def task_params
  params.require(:task).permit(:title, :note, :completed)
end
```

Here we defined the `create` action that creates the task and then redirects to the root path aka our home page.
We also created the `task_params` private method so that we filter the params of the request in case someone tries to pass parameters that we don't expect.
We only allow values for the `title`, `note` and `completed` attributes of our model. There will be cases that your model will have attributes you don't want to be set by the user and this is the way to control them.

![](https://2.bp.blogspot.com/-pGsV25stbqI/UqJ_oUclJlI/AAAAAAAAAl0/x2cdjwjwt04/s1600/8.png)

It's about time to end this part of the tutorial here. Very soon I will write the [next part]({% post_url 2013-12-17-creating-a-simple-todo-part-2 %}) in which we will:

*   refactor the `create` action so that it doesn't redirect to the root path but it closes the modal and re-renders the table of the tasks
*   add validation to our model so that empty titles are not allowed for the tasks showing the appropriate messages to the user
*   implement the edit/update and delete functionality
