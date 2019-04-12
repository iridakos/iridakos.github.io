---
layout: default
title:  "Creating a chat application from scratch using Rails and WebSockets"
description: "A step by step tutorial for creating a chat application from scratch using Rails and WebSockets (ActionCable)."
preview: "A step by step tutorial for creating a chat application with Rails and WebSockets (ActionCable)."
date: 2019-04-04 23:00:00 +0300
image: "https://iridakos.com/assets/images/posts/rails-chat-tutorial/post.png"
category: "tutorials"
identifier: "rails-chat-websockets"
outline: true
tags:
  - rails
  - websockets
  - devise
  - bootstrap
  - chat
  - actioncable
  - redis
popular: -1
related_posts:
  - dockerize-a-rails-application
  - todo-gtk-plus-ruby-tutorial
  - todo-part-1
  - hello-ruby-rails
  - bash-completion-script
---

Hey! It's been a while since my last post.

I recently familiarized myself with the awesomeness of WebSockets and I finally found the time to write a tutorial about it. I hope you find it helpful.

**Update**: I also published another post for dockerizing the application of this tutorial, you can find it [**here**]({% post_url 2019-04-07-dockerizing-a-rails-application %}).

## Introduction

In this tutorial we are going to create a **chat** web application from scratch using Rails and WebSockets.

![Rails chat tutorial gif]({{site.url}}/assets/images/posts/rails-chat-tutorial/rails-chat-tutorial.gif)

<div class="alert alert-primary">
  <div class="alert-heading"><i class="fa fa-comments"></i> Code and comments</div>

  You can find the code of this tutorial on <a class="alert-link" href="https://github.com/iridakos/rails-chat-tutorial"><i class="fa fa-github"></i> GitHub</a>.

  <hr />

  For feedback, comments, typos etc. please open an <a class="alert-link" href="https://github.com/iridakos/rails-chat-tutorial/issues">issue</a> in the repository.
</div>

### What are WebSockets

WebSocket is actually a protocol that enables bidirectional communication between the client and the server of a web application over a single long living TCP connection.

> The WebSocket protocol enables interaction between a web browser (or other client application) and a web server **with lower overheads, facilitating real-time data transfer from and to the server**.
<br><br>This is made possible by providing a standardized way for the server to send content to the client without being first requested by the client, and allowing messages to be passed back and forth while keeping the connection open. In this way, a two-way ongoing conversation can take place between the client and the server.<br><br>The communications are done over TCP port number 80 (or 443 in the case of TLS-encrypted connections), which is of benefit for those environments which block non-web Internet connections using a firewall. Similar two-way browser-server communications have been achieved in non-standardized ways using stopgap technologies such as Comet.
> <cite>-- <a href="https://en.wikipedia.org/wiki/WebSocket">WebSocket @ Wikipedia</a></cite>

### Why WebSockets

Suppose you have to create a web page that shows the statuses of running processes.
Without WebSockets you would have to either:
- Use AJAX with Javascript intervals to request and render the latest state of the processes or
- Automatically reload the page every x seconds (`<meta http-equiv="refresh" content="x">`) or
- Add a message on the page *"The statuses are not updated automatically <span class="text-nowrap">¯\\\_(ツ)\_/¯</span> Press [here]({{page.url}}) to reload the page."*

All of these methods would request the process statuses from the server even if nothing has changed.

WebSockets are here to allow this communication to take place on demand. The cost is having to keep alive TCP connections between the server and all its clients (each for every open browser tab).

## Building the application

We are going to build the web application using:

- **Ruby**: version **2.6.2**
- **Rails**: version **5.2.3**

### Setting up the environment

We are going to install the proper ruby and rails versions.

#### Install ruby

I use [rvm](https://rvm.io/) to manage the **Ruby** versions installed on my system. To install the desired ruby version use:

```bash
rvm install ruby 2.6.2
```

#### Install rails

Create a directory in your system with the name `rails-chat-tutorial`.

**Navigate to that directory** and create the following two files:

*.ruby-version*

```
ruby-2.6.2
```

*.ruby-gemset*

```
rails-chat-tutorial
```

With these file we are letting *rvm* know that when working on this directory, we want to use the specific ruby version (`.ruby-version`) and the gems from the specific gemset (`.ruby-gemset`)

Now, re-entering in the directory you should see something like this:

```
$ cd .

ruby-2.6.2 - #gemset created /home/iridakos/.rvm/gems/ruby-2.6.2@rails-chat-tutorial
ruby-2.6.2 - #generating rails-chat-tutorial wrappers...........
```

Install the desired rails version with:

```
gem install rails -v 5.2.3
```

#### Create the rails application

We are ready to create our new *rails* application:

```
rails new .
```

**Note**: We didn't define a name for the application and rails will resolve it using the directory name: `rails-chat-tutorial`.

Rails will create all the application's files and install the required gems.

Let's start the application to make sure that everything if fine.

```
rails server
```

You should see something like:

```
=> Booting Puma
=> Rails 5.2.3 application starting in development
=> Run `rails server -h` for more startup options
Puma starting in single mode...
* Version 3.12.1 (ruby 2.6.2-p47), codename: Llamas in Pajamas
* Min threads: 5, max threads: 5
* Environment: development
* Listening on tcp://localhost:3000
Use Ctrl-C to stop
```

Open a browser and visit `http://localhost:3000`, if you see this we are good to go.

![Rails new application]({{site.url}}/assets/images/posts/rails-chat-tutorial/01-rails-new.png)

### Users and devise

We are going to use the awesome [devise](https://github.com/plataformatec/devise) solution for authentication.

Append the following gem requirement at the bottom of the `Gemfile` file located at the root of the application's directory.

```ruby
gem 'devise'
```

On your terminal, install the new gem by executing:

```
bundle
```

Finish integration with devise using:

```
rails generate devise:install
```

We will create the model representing our uses using the devise generators.

On your terminal, execute:

```
rails generate devise User username:string
```

**Note**: we have added an extra attribute `username` to our model (besides the defaults generated by devise) so that we have something more friendly to present when displaying users instead of their email.

Open the generated migration which you will find under `db/migrate/<datetime>_devise_create_users.rb` and append the username's unique index definition with<sup><a href="#acknowledgments">[4]</a></sup>:

```ruby
  add_index :users,  :username,             unique: true
```

Find the line in the file that defines the `username` column and change it to:

```ruby
t.string :username, null: false
```

to make the attribute required.

Then in the User model which is located at `app/models/user.rb` add the validation rule for uniqueness and presence:

```ruby
  validates :username, uniqueness: true, presence: true
```

Finally, apply the database migration using:

```
rails db:migrate
```

We want all users to be authenticated before start chatting, so we are going to add the following line in the `ApplicationController` located at *app/controllers/application_controller.rb*:

```ruby
  before_action :authenticate_user!
```

### Rooms and messages

Each chat message is going to take place in the context of a room.

Let's build them all.

Use the following command to create the `Room`:

```
rails generate resource Room name:string:uniq
```

and the following command to create the `RoomMessage`:

```
rails generate resource RoomMessage room:references user:references message:text
```

Migrate the database with:

```
rails db:migrate
```

We can now setup our routes so that the root request is served by the `RoomsController#index` action.

Open your `config/routes.rb` file and change its contents to:

```ruby
Rails.application.routes.draw do
  devise_for :users

  root controller: :rooms, action: :index

  resources :room_messages
  resources :rooms
end
```

Restart the server and try to navigate to the application's root url.

You should see an error message, no worries:

![No action index for the RoomsController]({{site.url}}/assets/images/posts/rails-chat-tutorial/02.png)

We have to create the `index` action in the `RoomsController`. Open the controller `app/controllers/rooms_controller.rb` and change its contents to the following:

```ruby
class RoomsController < ApplicationController
  def index
  end
end
```

Then create the file `app/views/rooms/index.html.erb` and for now just add the following:
```erb
<h1>Rooms index</h1>
```

Reload and voilà.

![Rooms index]({{site.url}}/assets/images/posts/rails-chat-tutorial/03.png)

### Adding authentication

In order to require only signed in user to access the application, add the following line to the `app/controllers/application_controller.rb`

```ruby
  before_action :authenticate_user!
```

If we navigate to `http://localhost:3000` now we should be redirected to the sign in page.

![Sign in]({{site.url}}/assets/images/posts/rails-chat-tutorial/04.png)

Before continuing with the good stuff, let's gear up the application with some good features.

### Add bootstrap

We are going to use [Bootstrap](https://getbootstrap.com/) and we will integrate it in the application using the [bootstrap-rubygem](https://github.com/twbs/bootstrap-rubygem) gem.

Following the instructions of the gem, append the dependencies in your `Gemfile`.

```ruby
gem 'bootstrap', '~> 4.3.1'
gem 'jquery-rails'
```
and execute `bundle` to fetch and install it.

Change the `app/assets/stylesheets/application.css` files extension to `scss` and **replace its contents** with:

```css
@import "bootstrap";
```

Append the following lines to the `app/assets/javascript/application.js`

```js
//= require jquery3
//= require popper
//= require bootstrap-sprockets
```

### Add simple_form

We are going to use this great gem to generate forms easily.

Append the gem dependency in your `Gemfile` and bundle to install it.

```ruby
gem 'simple_form'
```

Then complete the integration using:

```bash
rails generate simple_form:install --bootstrap
```

**Note**: We used the *--bootstrap* directive since that's the framework we are using.

### Devise views with bootstrap and simple form

Devise uses its own views for sign in, register etc. But we do have a way to customize these views and now that we have ended up using bootstrap and simple forms, we can generate these views in a way that our choices are respected.

In your terminal:

```bash
rails generate devise:views
```

Before viewing our changes, let's do one last thing in our default layout.

Open `app/views/layouts/application.html.erb` and replace its contents with:

```erb
<!DOCTYPE html>
<html>
  <head>
    <title>RailsChatTutorial</title>
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>

    <%= stylesheet_link_tag    'application', media: 'all', 'data-turbolinks-track': 'reload' %>
    <%= javascript_include_tag 'application', 'data-turbolinks-track': 'reload' %>
  </head>

  <body>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <%= yield %>
        </div>
      </div>
    </div>
  </body>
</html>
```

This last one was to use [Bootstrap's grid](https://getbootstrap.com/docs/4.0/layout/grid/) in our views.

Navigate to `http://localhost:3000` and view what we have created.

![Sign in with Devise and simple form]({{site.url}}/assets/images/posts/rails-chat-tutorial/05.png)

Let's try to sign up following the `Sign up` link of the form:

![Sign up without username]({{site.url}}/assets/images/posts/rails-chat-tutorial/06.png)

As you can see, there is no field to fill in the username. For that to work we have to:

- Add the field in the sign up form
- Configure devise to accept the new attribute (`username`) or else the `ApplicationController` will [ignore it](https://api.rubyonrails.org/classes/ActionController/Parameters.html) once submitted from the form.

To add the field in the sign up form, open `app/views/devise/registrations/new.html.erb` and add these lines between the email and password fields.

```erb
  <%= f.input :username,
              required: true %>
```

Then, open the `app/controllers/application_controller.rb` file to configure the new attribute. Change the contents to:

```ruby
class ApplicationController < ActionController::Base
  before_action :authenticate_user!

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:email, :username])
  end
end
```

Done, reload and sign up<sup><a href="#acknowledgments">[5]</a></sup>.

![Sign up with username]({{site.url}}/assets/images/posts/rails-chat-tutorial/07.png)

### Cleanup unused components

We will not be using `coffee script` or `turbolinks` so let's remove all the related stuff.

Open `Gemfile` and remove the following lines:

```ruby
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
```

Open `app/assets/javascripts/application.js` and remove the following line:

```js
//= require turbolinks
```

Open `app/views/layouts/application.html.erb` and change the following lines <sup><a href="#acknowledgments">[3]</a></sup>:

```erb
    <%= stylesheet_link_tag    'application', media: 'all', 'data-turbolinks-track': 'reload' %>
    <%= javascript_include_tag 'application', 'data-turbolinks-track': 'reload' %>
```

to

```erb
    <%= stylesheet_link_tag    'application', media: 'all' %>
    <%= javascript_include_tag 'application' %>
```

Check that your `app/assets/javascripts` folder doesn't have any files with extension `.coffee` and if you find any, remove them.<sup><a href="#acknowledgments">2</a><sup>

Done. Restart you server.

### Adding a navigation bar

To improve the usability of the web pages will add a top [navigation bar](https://getbootstrap.com/docs/4.0/components/navbar/).

Create the directory `app/views/shared` and a file inside it named `_navigation_bar.html.erb`. This is going to be the partial responsible for rendering the navigation bar and which later on we will add to the application's default layout in order to be rendered on all web pages. Add these contents:

```erb
<nav class="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between">
  <a class="navbar-brand" href="#">Rails chat tutorial</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#nav-bar-collapse" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <% if current_user %>
    <div class="dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <img class="avatar" src="<%= gravatar_url(current_user) %>">
        <%= current_user.username %>
      </a>

      <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
        <%= link_to 'Logout', destroy_user_session_path, method: :delete, class: 'dropdown-item' %>
      </div>
    </div>
  <% end %>
</nav>
```

Mind the `gravatar_url(current_user)` line. This is a helper method that we are going to use in order to resolve the gravatar url of the signed in user. This is not a builtin method, we have to defined it but it's pretty straightforward.

Edit `app/helpers/application_helper.rb` and add the following method:

```ruby
def gravatar_url(user)
  gravatar_id = Digest::MD5::hexdigest(user.email).downcase
  url = "https://gravatar.com/avatar/#{gravatar_id}.png"
end
```

**Note**:
- As you can see, the user's username, avatar and sign out link will only be rendered if the user is signed in.

The avatar image has a css class `avatar`. We have to define this class in the application's stylesheets. Create a css file in which we will gather all css class that we will use in the application under the name `app/assets/stylesheets/rails-chat-tutorial.scss`.

For now add the rule for the avatar:

```css
.avatar {
  max-height:30px;
  border-radius: 15px;
  width:auto;
  vertical-align:middle;
}
```

and open `application.scss` to import the newly created stylesheet. Add the line:

```
@import "rails-chat-tutorial"
```

We have to add this partial in the application layout. Edit `app/views/layouts/application.html.erb` and change its contents to:

```erb
<!DOCTYPE html>
<html>
  <head>
    <title>RailsChatTutorial</title>
    <%= csrf_meta_tags %>
    <%= csp_meta_tag %>

    <%= stylesheet_link_tag    'application', media: 'all' %>
    <%= javascript_include_tag 'application' %>
  </head>

  <body>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <%= render partial: 'shared/navigation_bar' %>
          <div class="my-3">
            <%= yield %>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

Reload to view the bar.

![Sign up with navigation bar]({{site.url}}/assets/images/posts/rails-chat-tutorial/08.png)

Awesome. Fill in with your desired credentials and submit the form.

![Signed in]({{site.url}}/assets/images/posts/rails-chat-tutorial/09.png)

### Room management

We are going to create a simple layout for groups.

- One narrow column displaying vertically all the available rooms
- One wide column which is going to host the chat messages and form.

The rooms index page will have the second column empty since this column will be present only when user is inside a specific room.

In the index page we will provide the option to create a room.

#### Room index

First we have to load all rooms in the `RoomsController`. Open `app/controllers/rooms_controller.rb` and change the index action as:

```ruby
def index
  @rooms = Room.all
end
```

Open `app/views/rooms/index.html.erb` and change its contents to:

```erb
<div class="col-12 col-md-3 text-cebter">
  <div class="mb-3">
    <%= link_to new_room_path, class: "btn btn-primary" do %>
      Create a room
    <% end %>
  </div>

  <% if @rooms.present? %>
    <nav class="nav flex-column">
      <% @rooms.each do |room| %>
        <%= link_to room.name, room_path(room), class: "nav-link room-nav-link" %>
      <% end %>
    </nav>
  <% else %>
    <div class="text-muted">
      The are no rooms
    </div>
  <% end %>
</div>

<div class="col">
  <div class="alert alert-primary">
    <h4 class="alert-heading">
      Welcome to the RailsChatTutorial!
    </h4>

    <p>
      We need to talk.
    </p>

    <hr />

    <p>
      You can create or join a room from the sidebar.
    </p>
  </div>
</div>
```

If there are rooms, the left column of the page will render a vertical navigation with links leading to each room's page. The right column displays a simple welcome message.

![Room index]({{site.url}}/assets/images/posts/rails-chat-tutorial/10.png)

Pressing the `Create a room` button we get the expected error for the non-existent action.

#### Room new/edit

We have to define the actions for creating and updating a room.

Open the `app/controllers/rooms_controller.rb` and change its contents to:

```ruby
class RoomsController < ApplicationController
  # Loads:
  # @rooms = all rooms
  # @room = current room when applicable
  before_action :load_entities

  def index
    @rooms = Room.all
  end

  def new
    @room = Room.new
  end

  def create
    @room = Room.new permitted_parameters

    if @room.save
      flash[:success] = "Room #{@room.name} was created successfully"
      redirect_to rooms_path
    else
      render :new
    end
  end

  def edit
  end

  def update
    if @room.update_attributes(permitted_parameters)
      flash[:success] = "Room #{@room.name} was updated successfully"
      redirect_to rooms_path
    else
      render :new
    end
  end

  protected

  def load_entities
    @rooms = Room.all
    @room = Room.find(params[:id]) if params[:id]
  end

  def permitted_parameters
    params.require(:room).permit(:name)
  end
end
```

**Note**: we preload the `@rooms` and the `@room` variables making them available to all actions with the `before_action :load_entities` hook.

We will create a simple form for the `Room` object and we will use it both when creating and editing a room. Create the `app/views/rooms/_form.html.erb` and add:

```erb
<%= simple_form_for @room do |form| %>
  <%= form.input :name %>
  <%= form.submit "Save", class: 'btn btn-success' %>
<% end %>
```

Then, create the views for the `new`/`edit` action accordingly:

*app/views/rooms/new.html.erb*
```erb
<h1>
  Creating a room  
</h1>

<%= render partial: 'form' %>
```

*app/views/rooms/edit.html.erb*
```erb
<h1>
  Editing room <%= @room.name %>
</h1>

<%= render partial: 'form' %>
```

Time to create the first room. From the rooms' index page, press the `Create a room`

![New room]({{site.url}}/assets/images/posts/rails-chat-tutorial/11.png)

Save and here it is.

![Room index with rooms]({{site.url}}/assets/images/posts/rails-chat-tutorial/12.png)

Add this class in `app/assets/stylesheets/rails-chat-tutorial.scss` to improve the display of the rooms.

```css
.room-nav-link {
  border: 1px solid lighten($primary, 40%);
  background: lighten($primary, 45%);

  & + .room-nav-link {
    border-top: 0 none;
  }
}
```

![Room index with improved rooms]({{site.url}}/assets/images/posts/rails-chat-tutorial/13.png)

**Note**: We will add the `edit` link in the room's page a.k.a. `show` action.

Before moving on to the Room page, we will refactor the index page so as to be able to use the left column's content inside the room page as well.

Create the partial `app/views/rooms/_rooms.html.erb` with contents:

```erb
<div class="mb-3">
  <%= link_to new_room_path, class: 'btn btn-primary' do %>
    Create a room
  <% end %>
</div>

<% if @rooms.present? %>
  <nav class="nav flex-column">
    <% @rooms.each do |room| %>
      <%= link_to room.name, room_path(room), class: 'nav-link room-nav-link' %>
    <% end %>
  </nav>
<% else %>
  <div class="text-muted">
    The are no rooms
  </div>
<% end %>
```

and change the `app/views/rooms/index.html.erb` to use it:

```erb
<div class="row">
  <div class="col-12 col-md-3 text-cebter">
    <%= render partial: 'rooms' %>
  </div>

  <div class="col">
    <div class="alert alert-primary">
      <h4 class="alert-heading">
        Welcome to the RailsChatTutorial!
      </h4>

      <p>
        We need to talk.
      </p>

      <hr />

      <p>
        You can create or join a room from the sidebar.
      </p>
    </div>
  </div>
</div>
```

#### Room page

Add the `show` action in the `app/controllers/rooms_controller.rb`:

```ruby
def show
  @room_message = RoomMessage.new room: @room
  @room_messages = @room.room_messages.includes(:user)
end
```

**Notes:**
- We construct a new room message which we are going to use in the view to build a form for creating the chat messages.
- When displaying the room message, we access its user's email attribute to resolve the gravatar hash. We used `.includes(:user)` in the query for the `@room_messages` to fetch them along with their users avoiding [N+1 queries](https://medium.com/@bretdoucette/n-1-queries-and-how-to-avoid-them-a12f02345be5)<sup><a href="#acknowledgments">[1]</a></sup>.

Create the view `app/views/rooms/show.html.erb`:

```erb
<h1>
  <%= @room.name %>
</h1>

<div class="row">
  <div class="col-12 col-md-3">
    <%= render partial: 'rooms' %>
  </div>

  <div class="col">
    <div class="chat">
      <% @room_messages.each do |room_message| %>
        <%= room_message %>
      <% end %>
    </div>

    <%= simple_form_for @room_message, remote: true do |form| %>
      <div class="input-group mb-3">
        <%= form.input :message, as: :string,
                                 wrapper: false,
                                 label: false,
                                 input_html: {
                                   class: 'chat-input'
                                 } %>
        <div class="input-group-append">
          <%= form.submit "Send", class: 'btn btn-primary chat-input' %>
        </div>
      </div>

      <%= form.input :room_id, as: :hidden %>
    <% end %>
  </div>
</div>
```

**Notes:**
- We reused the `app/views/rooms/_rooms.html.erb` partial that we created in the previous step
- We added a `div` with class `.chat` and this is where the room's messages are renderer.
- We added a form for the `@room_message` that we instantiated in the controller. We also used the directive `remote: true` when we instantiated the form thus the form is going to be submitted by **Ajax**.
- We added a hidden field for the attribute `:room_id` so that the value reaches the `RoomMessagesController` once we submit the form.

Style the chat components by adding the following lines to the `app/assets/stylesheets/rails-chat-tutorial.scss`:

```css
.chat {
  border: 1px solid lighten($secondary, 40%);
  background: lighten($secondary, 50%);
  height: 50vh;
  border-radius: 5px 5px 0 0;
  overflow-y: auto;
}

.chat-input {
  border-top: 0 none;
  border-radius: 0 0 5px 5px;
}
```

Navigate to a room to see what has been done.

![Room page with chat]({{site.url}}/assets/images/posts/rails-chat-tutorial/14.png)

Pressing the `Send` button nothing happens on the page but if you check the server's console you will notice:

```
AbstractController::ActionNotFound (The action 'create' could not be found for RoomMessagesController):
```

Let's fix that.

#### Creating room messages

This is going to be easy. All we have to do is implement the `create` action in the `RoomMessagesController`.

*app/controllers/room_messages_controller.rb*
```ruby
class RoomMessagesController < ApplicationController
  before_action :load_entities

  def create
    @room_message = RoomMessage.create user: current_user,
                                       room: @room,
                                       message: params.dig(:room_message, :message)
  end

  protected

  def load_entities
    @room = Room.find params.dig(:room_message, :room_id)
  end
end
```

**Notes:**
- we preload the room using the `room_id` parameter that we added as a hidden field in the form in the previous step
- we create a new message for the room setting its user to currently signed in user

If you try to submit a message now, again you will see nothing but in the server console you can see from the log that the room message has been created.

```
Started POST "/room_messages" for ::1 at 2019-04-04 19:24:33 +0300
Processing by RoomMessagesController#create as JS
  Parameters: {"utf8"=>"✓", "room_message"=>{"message"=>"My first message", "room_id"=>"8"}, "commit"=>"Send"}
  User Load (0.2ms)  SELECT  "users".* FROM "users" WHERE "users"."id" = ? ORDER BY "users"."id" ASC LIMIT ?  [["id", 1], ["LIMIT", 1]]
  ↳ /home/iridakos/.rvm/gems/ruby-2.6.2@rails-chat-tutorial/gems/activerecord-5.2.3/lib/active_record/log_subscriber.rb:98
  Room Load (0.2ms)  SELECT  "rooms".* FROM "rooms" WHERE "rooms"."id" = ? LIMIT ?  [["id", 8], ["LIMIT", 1]]
  ↳ app/controllers/room_messages_controller.rb:13
   (0.1ms)  begin transaction
  ↳ app/controllers/room_messages_controller.rb:5
  RoomMessage Create (0.7ms)  INSERT INTO "room_messages" ("room_id", "user_id", "message", "created_at", "updated_at") VALUES (?, ?, ?, ?, ?)  [["room_id", 8], ["user_id", 1], ["message", "My first message"], ["created_at", "2019-04-04 16:24:33.456641"], ["updated_at", "2019-04-04 16:24:33.456641"]]
  ↳ app/controllers/room_messages_controller.rb:5
   (4.0ms)  commit transaction
  ↳ app/controllers/room_messages_controller.rb:5
No template found for RoomMessagesController#create, rendering head :no_content
Completed 204 No Content in 88ms (ActiveRecord: 5.1ms)
```

A user would expect to have the message field cleared after sending a new message. We don't disappoint users.

Create a file `app/assets/javascripts/room.js` and add the following:

```js
$(function() {
  $('#new_room_message').on('ajax:success', function(a, b,c ) {
    $(this).find('input[type="text"]').val('');
  });
});
```

We bind to the `ajax:success` event triggered by [Rails](https://guides.rubyonrails.org/working_with_javascript_in_rails.html#form-with) on successful submission of the form and all we want to do is clear the text field's value.

Reload the page and try submitting again and check it out. The field value should be emptied after sending the message.

#### Displaying room messages

If you reload the page you will see something like this:

![Room message to string]({{site.url}}/assets/images/posts/rails-chat-tutorial/15.png)

Let's beautify the messages.

Replace the contents of `app/views/rooms/show.html.erb` with:

```erb
<h1>
  <%= @room.name %>
</h1>

<div class="row">
  <div class="col-12 col-md-3">
    <%= render partial: 'rooms' %>
  </div>

  <div class="col">
    <div class="chat">
      <% @room_messages.each do |room_message| %>
        <div class="chat-message-container">
          <div class="row no-gutters">
            <div class="col-auto text-center">
              <img src="<%= gravatar_url(room_message.user) %>" class="avatar" alt="">
            </div>

            <div class="col">
              <div class="message-content">
                <p class="mb-1">
                  <%= room_message.message %>
                </p>

                <div class="text-right">
                  <small>
                    <%= room_message.created_at %>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      <% end %>
    </div>

    <%= simple_form_for @room_message, remote: true do |form| %>
      <div class="input-group mb-3">
        <%= form.input :message, as: :string,
                                 wrapper: false,
                                 label: false,
                                 input_html: {
                                   class: 'chat-input'
                                 } %>
        <div class="input-group-append">
          <%= form.submit "Send", class: 'btn btn-primary chat-input' %>
        </div>
      </div>

      <%= form.input :room_id, as: :hidden %>
    <% end %>
  </div>
</div>
```

and add the following css classes **inside the .chat class**:

```css
.chat-message-container {
  padding: 5px;

  .avatar {
    margin: 5px;
  }

  .message-content {
    padding: 5px;
    border: 1px solid $primary;
    border-radius: 5px;
    background: lighten($primary, 10%);
    color: $white;
  }

  & + .chat-message-container {
    margin-top: 10px;
  }
}
```

Reload the page. Magic.

![Improved display of room messages]({{site.url}}/assets/images/posts/rails-chat-tutorial/16.png)

## Introducing WebSockets - ActionCable

Time to start using WebSockets with ActionCable.

> Action Cable seamlessly integrates WebSockets with the rest of your Rails application. It allows for real-time features to be written in Ruby in the same style and form as the rest of your Rails application, while still being performant and scalable. It's a full-stack offering that provides both a client-side JavaScript framework and a server-side Ruby framework. You have access to your full domain model written with Active Record or your ORM of choice.
> <cite>-- <a href="https://guides.rubyonrails.org/action_cable_overview.html">Action Cable Overview @ Ruby on Rails Guides (v5.2.3)</a></cite>

### Install redis

We are going to use the `redis` adapter which is [a safe option for production environments](https://guides.rubyonrails.org/action_cable_overview.html#redis-adapter) unlike the `async` one.

You first must install [redis](https://redis.io/) on your system.

To install it on Ubuntu you just have to execute the following commands in your terminal:

```bash
sudo apt update
sudo apt install redis-server
```

To check that installation is successful, in your terminal make sure you get a PONG:

```
$ redis-cli
127.0.0.1:6379> ping
PONG
```

### Configure ActionCable

Since we are working on the development environment, open your `config/cable.yml` and replace its contents with:

```yml
development:
  adapter: redis
  url: <%= ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" } %>
  channel_prefix: rails-chat-tutorial_development

test:
  adapter: async

production:
  adapter: redis
  url: <%= ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" } %>
  channel_prefix: rails-chat-tutorial_production
```

**Note:** we have added an option `channel_prefix` because:

> Additionally, a channel_prefix may be provided to avoid channel name collisions when using the same Redis server for multiple applications
> <cite>-- <a href="https://guides.rubyonrails.org/action_cable_overview.html#redis-adapter">Action Cable Overview # Redis Adapter @ Ruby on Rails Guides (v5.2.3)</a></cite>

Finally, we are going to add the dependency in the `Gemfile`:

```ruby
gem 'redis'
```

Don't forget to bundle after altering the `Gemfile`.

### Configure Devise for authenticating websocket connections

When establishing a websocket connection, we don't have access to the user session but we do have access to the cookies. So, in order to be able to authenticate the user we need to do some devise related stuff first ([credits to Greg Molnar](https://rubytutorial.io/actioncable-devise-authentication/)).

Create an initializer for warden hooks under the name `config/initializers/warden_hooks.rb` and add the following lines:

```ruby
Warden::Manager.after_set_user do |user,auth,opts|
  scope = opts[:scope]
  auth.cookies.signed["#{scope}.id"] = user.id
end

Warden::Manager.before_logout do |user, auth, opts|
  scope = opts[:scope]
  auth.cookies.signed["#{scope}.id"] = nil
end
```

**Explain:** We add a cookie with the user's id upon successful sign in and we remove it once the user logs out.

### Configure the websocket connection

Open `app/channels/application_cable/connection.rb` and change its contents to the following:

```ruby
module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      if verified_user = User.find_by(id: cookies.signed['user.id'])
        verified_user
      else
        reject_unauthorized_connection
      end
    end
  end
end
```

**Explain:**

> Here identified_by is a connection identifier that can be used to find the specific connection later. Note that anything marked as an identifier will automatically create a delegate by the same name on any channel instances created off the connection.
> <cite>-- <a href="https://guides.rubyonrails.org/action_cable_overview.html#connection-setup">Action Cable Overview # Connection setup @ Ruby on Rails Guides (v5.2.3)</a></cite>

In the `find_verified_user` method we access the cookie that we previously set in the warden hook.

### Create the room channel

> A channel encapsulates a logical unit of work, similar to what a controller does in a regular MVC setup.
> <cite>-- <a href="https://guides.rubyonrails.org/action_cable_overview.html#channelsp">Action Cable Overview # Channels @ Ruby on Rails Guides (v5.2.3)</a></cite>

We will create the `RoomChannel` in which all Room pages will subscribe to.

Create `app/channels/room_channel.rb` with the following contents:

```ruby
class RoomChannel < ApplicationCable::Channel
  def subscribed
    room = Room.find params[:room]
    stream_for room

    # or
    # stream_from "room_#{params[:room]}"
  end
end
```

**Explain**:

- The `subscribed` method gets called once a subscription to the channel is established and it is responsible to setup the stream from which data will be sent back and forth.

We are going to configure the room page code later on to request subscriptions to this channel passing the `room` parameter.

We have two options:

- Use `stream_for`: this way Rails automatically generates a stream name for the given object (`room` in our case), for example: "room:asdfwer234". When we want afterwards to broadcast data to the stream, all we have to do is call `RoomChannel.broadcast_to(room_object, data)` in which case Rails resolves the stream name from the `room_object`. In other words, we don't have to manually resolve the stream name in which the data have to be send (see next item).
  * This option is available when the channel handles subscriptions bound to models like in our case, a specific room

- Use `stream_from`: we manually define the name of the stream and later on, when we want to broadcast to the stream, we have to use: `ActionCable.server.broadcast("room_#{a_room_id_here}", data)`.

Read more [here](https://guides.rubyonrails.org/action_cable_overview.html#streams).

### Broadcast room messages

Every time a room message is being created, we just need to broadcast to the message's room stream.
To do so, alter the `create` action of the `app/controllers/room_messages_controller.rb` to this:

```ruby
def create
  @room_message = RoomMessage.create user: current_user,
                                     room: @room,
                                     message: params.dig(:room_message, :message)

  RoomChannel.broadcast_to @room, @room_message
end
```

**Explain**: we added the line `RoomChannel.broadcast_to @room, @room_message` which will broadcast to the room's specific stream (as explained above) the `@room_message` transformed to json via the `to_json` method.

So, on the other side, the client side, we are going to be receiving the json representation of the `RoomMessage` model. Let's see what that is:

```json
{
  "id":29,
  "room_id":8,
  "user_id":1,
  "message":"My first message",
  "created_at":"2019-04-04T17:09:00.637Z",
  "updated_at":"2019-04-04T17:09:00.637Z"
}
```

We plan to add the new messages in the room's page via Javascript and this information is not adequate. The only thing we are missing is the user avatar. Time to refactor.

Open `app/models/user.rb` and add the following method:

```
def gravatar_url
  gravatar_id = Digest::MD5::hexdigest(email).downcase
  "https://gravatar.com/avatar/#{gravatar_id}.png"
end
```

We had already implemented this in the `app/helpers/application_helper.rb` file and we won't be using it anymore so **remove it**.

Update `app/views/shared/_navigation_bar.html.erb` and change the previous gravatar resolution to this:

```erb
<img class="avatar" src="<%= current_user.gravatar_url %>">
```

Update `app/views/rooms/show.html.erb` and change it there too, with:

```erb
<img src="<%= room_message.user.gravatar_url %>" class="avatar" alt="">
```

Finally, we will change the `JSON` representation of the `RoomMessage` to include the user's url:

*app/models/room_message.rb*
```ruby
def as_json(options)
  super(options).merge(user_avatar_url: user.gravatar_url)
end
```

Let's confirm that the new JSON transformation is valid:

```json
{
  "id":29,
  "room_id":8,
  "user_id":1,
  "message":"My first message",
  "created_at":"2019-04-04T17:09:00.637Z",
  "updated_at":"2019-04-04T17:09:00.637Z",
  "user_avatar_url":"https://gravatar.com/avatar/02a28db6886d578f75a820b50f2dd334.png"
}
```

Great, moving on.

### Subscribe to the room stream

We are going to add some data in the room page in order to use them via Javascript to subscribe to the appropriate streams each time we visit a room.

Open the file `app/views/rooms/show.html.erb` and alter the line in which we define the chat div, to this:

```erb
<div class="chat" data-channel-subscribe="room" data-room-id="<%= @room.id %>">
```

**Explain**: We added two data attributes, one defining to which channel we want to subscribe and one defining to which room we are.

At the end of the file, add the following snippet:

```html
<div class="d-none" data-role="message-template">
  <div class="chat-message-container">
    <div class="row no-gutters">
      <div class="col-auto text-center">
        <img src="" class="avatar" alt="" data-role="user-avatar">
      </div>

      <div class="col">
        <div class="message-content">
          <p class="mb-1" data-role="message-text"></p>

          <div class="text-right">
            <small data-role="message-date"></small>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

This snippet is going to be used as a template for each incoming message. Every time a message arrives, we will

- clone this html
- alter the appropriate elements' values and
- append the resulting html to the end of the chat div.

Now we will create the Javascript that will do the work of subscribing and handling incoming channel data.

Create the file `app/assets/javascripts/channels/room_channel.js` and add the following code:

```js
$(function() {
  $('[data-channel-subscribe="room"]').each(function(index, element) {
    var $element = $(element),
        room_id = $element.data('room-id')
        messageTemplate = $('[data-role="message-template"]');

    $element.animate({ scrollTop: $element.prop("scrollHeight")}, 1000)        

    App.cable.subscriptions.create(
      {
        channel: "RoomChannel",
        room: room_id
      },
      {
        received: function(data) {
          var content = messageTemplate.children().clone(true, true);
          content.find('[data-role="user-avatar"]').attr('src', data.user_avatar_url);
          content.find('[data-role="message-text"]').text(data.message);
          content.find('[data-role="message-date"]').text(data.updated_at);
          $element.append(content);
          $element.animate({ scrollTop: $element.prop("scrollHeight")}, 1000);
        }
      }
    );
  });
});
```

**Explain**:

* For each element that has a data attribute `channel-subscribe` with value `room`
  * Create a subscription to the "RoomChannel" passing the element's `room-id` data attribute as a parameter with name `room` (remember this line of the `RoomChannel`: `Room.find params[:room]` ?)
    * When data is received, clone the template snippet and alter its contents based on the incoming object attributes.
    * Append the newly generated content to the chat div and finally
    * Do some animation to impress by scrolling smoothly to the bottom of the div.

## Acknowledgments

Thank you for your feedback.

* [1] [Armando Andini - N+1 queries](https://github.com/iridakos/rails-chat-tutorial/issues/3)
* [2] [Rodolfo Ruiz - Coffeescript leftovers](https://github.com/iridakos/rails-chat-tutorial/issues/5)
* [3] [Felix Wolfsteller - Turbolinks leftovers](https://github.com/iridakos/rails-chat-tutorial/issues/1)
* [4] [Maria Kravtsova - Migration typo](https://github.com/iridakos/rails-chat-tutorial/issues/2)
* [5] [Tony Dehnke - Sign up step](https://github.com/iridakos/rails-chat-tutorial/issues/6)

That's all! Long post, tired cat photo.

![Tired cat photo]({{site.url}}/assets/images/posts/rails-chat-tutorial/irida.jpg)

<div class="alert alert-primary">
  <div class="alert-heading"><i class="fa fa-comments"></i> Code and comments</div>

  You can find the code of this tutorial on <a class="alert-link" href="https://github.com/iridakos/rails-chat-tutorial"><i class="fa fa-github"></i> GitHub</a>.

  <hr />

  For feedback, comments, typos etc. please open an <a class="alert-link" href="https://github.com/iridakos/rails-chat-tutorial/issues">issue</a> in the repository.

  <hr>

  <strong>Thanks for visiting!</strong>
</div>
