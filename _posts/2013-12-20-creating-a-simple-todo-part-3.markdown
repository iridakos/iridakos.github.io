---
layout: post
title:  "Creating a simple ToDo application with Ruby on Rails - Part 3"
date:   2013-12-20 10:00:00 +0300
---

This is the third part of the tutorial. In this part, we are going to use [Devise][2] &amp; [CanCan][3] in order to add authentication and authorization features to the application.   

In order to continue, you must complete the previous two parts if you haven't done this already:  

Done? Cool, let's start.

**You can find the complete code of the tutorial [here][4].**  

###  MailCatcher

Our users will register to the application using their email address and they will receive a confirmation email in order to activate their account.

Before introducing Devise, you'll get to know MailCatcher which is an awesome gem for simulating a real smtp server. We will configure the application to use it when in development mode.

Install the gem from the command line:

``` bash
gem install 'mailcatcher'
```

![][5]

and start the *smtp server*:

``` bash
mailcatcher
```

![][6]

As you can see from the output, we will be sending our mail through:

```
smtp://127.0.0.1:1025
```

and we will browse the sent emails via the web interface at:

```
http://127.0.0.1:1080
```

Visit the last one, you should be seeing something like this:  

![][7]

Now open the `development.rb` file which is located under `config/environments` and add the following lines:

``` ruby
config.action_mailer.default_url_options = { :host => 'localhost:3000' }
config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {:address => "localhost", :port => 1025}
```

The first line defines which host is going to be used while converting the relative paths in our emails to absolute ones.

The second ones defined the protocol to be used and the last one sets the settings of the smtp server.

###  Devise

Devise is a gem that will provide us with almost anything about authentication.

Open your `Gemfile` with your text editor and add the devise gem:

``` ruby
gem 'devise'
```

and then, from the command line execute the bundle installer:

``` bash
bundle install
```    

In order to have the gem's initialization stuff automatically generated for us, execute from the command line again:

``` bash
rails generate devise:install
```

This command will create two files:

```
config/initializer/devise.rb
```

and

```
config/locales/devise.en.yml
```

The first one configures the devise and second one has localized messages used by the gem.  
Open the first one and comment out the line since we won't be using this option:

``` ruby
# config.reconfirmable = true
```

Now, we are going to instruct devise to generate the model that will be used for our users:

``` bash
rails generate devise User
```

![][8]

With this command, we created our User model & the migration that will create the table for the model and we also added automatically the appropriate routes for registration/sign in/confirmation etc.

Before applying the migration, we will create another one because we want to enable the [confirmable][9] option so that our users confirm their account before start doing anything with the application.

To do so, we will generate a custom migration:

``` bash
rails generate migration add_confirmable_to_users
```

![][10]

Now open the generated file (`xxxx_add_confirmable_to_users.rb`) with your text editor and change its contents to the following:

``` ruby
    class AddConfirmableToUsers < ActiveRecord::Migration
      # Note: You can't use change, as User.update_all with fail in the down migration
      def self.up
        add_column :users, :confirmation_token, :string
        add_column :users, :confirmed_at, :datetime
        add_column :users, :confirmation_sent_at, :datetime
        # add_column :users, :unconfirmed_email, :string # Only if using reconfirmable
        add_index :users, :confirmation_token, :unique => true
        # User.reset_column_information # Need for some types of updates, but not for update_all.
        # To avoid a short time window between running the migration and updating all existing
        # users as confirmed, do the following
        User.update_all(:confirmed_at => Time.now)
        # All existing user accounts should be able to log in after this.
      end

      def self.down
        remove_columns :users, :confirmation_token, :confirmed_at, :confirmation_sent_at
        # remove_columns :users, :unconfirmed_email # Only if using reconfirmable
      end
    end
```

This migration will add columns to our users table to keep information about confirmations.  
We are ready to migrate, from the command line:

``` bash
rake db:migrate
```

![][11]

We updated our users table but we need to update the model too. Open `user.rb` which is located under `app/models/` and change it to this:

``` ruby
class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable
end
```

We just added the `:confirmable` option.

Let's check what is going on with our routes, from the command line:  

``` bash
rake routes
```

![][12]

Wow, way too many new routes. Time to start the server:

``` bash
rails server
```

Navigate to `http://localhost:3000/users/sign_in`

We have a sign in form!  

![][13]

Where did this view come from?

Well, devise has some default views that we use by default. But what if we want to use our own? This page doesn't look good...

Thankfully, devise gives us the option to generate the default views inside our application's views folder so that we can make changes on them.

By default, the generated views are of `erb` type and since we are using `haml` we will follow one more step.

From the command line:  

``` bash
rails generate devise:views
```

![][14]


At this point, it would be a good exercise for you to convert all generated views to `haml` (don't forget to change the file extension to `.html.haml`) but there is [another way][15].

From the command line:

``` bash
gem install html2haml
for file in app/views/devise/**/*.erb; do html2haml -e $file ${file%erb}haml && rm $file; done
```

I got a bunch of warnings from the last command but the conversion was successful.

Ok, now we can edit these files and make the views look what we want.

But instead of "centralizing" all devise's forms file by file we have also another option.
We can create another layout (besides our application's default) and configure the application to use it if the executed action belongs to a devise controller.

Create a file with name `devise.html.haml` into `app/views/layouts` and add the following:  

``` haml
!!!
%html
  %head
    %title Todo
    = stylesheet_link_tag    "application", media: "all"
    = javascript_include_tag "application"
    = csrf_meta_tags
  %body
    .row-fluid
      .span10.offset1
        .hero-unit.text-center
          %h1
            ToDo
          %p
            Welcome to the tutorial's ToDo application
    .row-fluid
      .span4.offset4
        = yield
```

and add the following to the `application_controller.rb`:

``` ruby
layout :layout_by_controller

protected

def layout_by_controller
  devise_controller? ? 'devise' : 'application'
end
```

![][16]

Refresh your browser, much better:  

![][17]

Let's bootstrap that sign in button, edit the `new.html.haml` file located under `app/views/devise/sessions` and add the bootstrap class to the button:

``` haml
= f.button :submit, "Sign in", class: 'btn btn-primary'
```

![][18]

Now, I want you to visit the root path of the application, `http://localhost:3000`

![][19]

Hmm, where is the authentication?
We are going to add a filter in our `application_controller.rb` so that all actions require an authenticated user. Edit the file and add this line:

``` ruby
before_filter :authenticate_user!
```

![][20]

Refresh, you should be automatically redirected to the sign in page.

Let's create a user. Follow the sign up link (as an exercise, on each new devise view missing the bootstrap stuff, find the file and make the appropriate changes):

![][21]

Press the sign up button and open a new tab to your browser to see the MailCatcher stuff (`http://localhost:1080`):

![][22]

Magic!

Confirm you account following the link and login.

So far so good, but something wasn't quite nice. We should be seeing some default devise generated messages for the actions we executed (like "Successfully registered" etc) but nothing was displayed.

Devise uses [flash messages][23] and currently we have done nothing about showing them.

We will create a simple partial under a new folder located at `app/views/shared` named `_flash.html.haml` with the following contents:

``` haml
- flash.each do |type, value|
  .flash{ :class =&gt; type.to_s }
    = value
```

Trying to sign in with invalid credentials should show you an error message now:   

![][24]

Nice. Let's add some user related stuff to our application layout so that when logged in a user can see his username and a logout link. Edit `application.html.haml` and add the following inside the hero-unit.

``` haml
.text-center
  %strong= current_user.email
.text-center
  = link_to 'logout', destroy_user_session_path, method: :delete
```

![][25]

We added the current user's email (using the helper method current_user provided by devise) and a logout link pointing to the destroy session path from our routes.

Now, after a user logs in, you should see something like the following:

![][26]

Ok, we have added user authentication. Now before accessing the home page and all of its task related actions, an authenticated user is required. But, which task should a user be able to view/edit/destroy?

###  CanCan

Before messing with CanCan, we should think a little about our models.

We have users and tasks. We want each user to manage his/her own tasks without being able to do anything to tasks that belong to another user.

So, we need to add a new attribute to our Task model that will keep track of the User it belongs to.
We will do this firstly by creating a migration to add a user_id column to the users table:

``` bash
rails generate migration add_column_user_id_to_tasks user_id:integer
```

Open the generated file and confirm that rails understood exactly what we wanted to do:

![][27]

Now we must tell to both our models about their association.

In `user.rb`:

``` ruby
has_many :tasks
```

![][28]

and in `task.rb`:

``` ruby
belongs_to :user
validates_presence_of :user
```

![][29]

Rails understands in both cases which model is being associated by the value of the symbol.

Apply the migration to the database:  

``` bash
 bundle exec rake db:migrate
```

CanCan o'Clock. We will use CanCan in order to protect a user's tasks from being accessed by another user.

Add the gem to your `Gemfile`:  

``` ruby
gem 'cancan'
```

and bundle from the command line:

``` bash
bundle install
```

Next, we are going to generate the file in which we are going to describe the "abilities" of a user:

``` bash
rails generate cancan:ability
```

![][30]

Open the generated file with your text editor and replace its contents with the following:

``` ruby
class Ability
  include CanCan::Ability

  def initialize(user)
    can :manage, Task, user_id: user.id
  end
end
```

Here we define that a user can execute any kind of action on a Task only if the task's `user_id` attribute matches the current user's id.

Time to authorize our actions. [There is a shortcut for this][31] but we will to do it the tedious way.
Open the tasks controller and review the actions:

* `new`: we don't need to check anything here
* `create`: the task's `user_id` must be the one of the current user
* `edit`: the task's `user_id` must be the one of the current user
* `update`: the task's `user_id` must be the one of the current user
* `delete`: the task's `user_id` must be the one of the current user

We will apply the limitations above using the CanCan's `authorize!` action.
This method accepts two parameters, the `action` (symbol) that will be executed and the `object` on which it will be executed.

Change the controller's actions as below:

``` ruby
class TasksController < ApplicationController
  def new
    @task = Task.new
    render :show_form
  end

  def create
    @task = Task.new(task_params)
    @task.user = current_user
    authorize! :create, @task
    save_task
  end

  def edit
    @task = Task.find(params[:id])
    authorize! :edit, @task
    render :show_form
  end

  def update
    @task = Task.find(params[:id])
    @task.assign_attributes(task_params)
    authorize! :update, @task
    save_task
  end

  def destroy
    @task = Task.find(params[:id])
    authorize! :destroy, @task
    @task.destroy
    @tasks = Task.accessible_by(current_ability)
  end

  private

  def save_task
    if @task.save
      @tasks = Task.accessible_by(current_ability)
      render :hide_form
    else
      render :show_form
    end
  end

  def task_params
    params.require(:task).permit(:title, :note, :completed)
  end
end
```

All actions in the `authorized!` calls could be replaced by the `:manage` symbol but I wanted to show you your options in case you had defined different abilities per action.

Also notice that in the create action we added the line  

``` ruby
@task.user = current_user
```

This line will "fill" the `user_id` of each newly created task with current user's id.

After all these changes, if a user tries to edit/update a task that belongs to another user, an `AccessDenied` error is going to be raised.

**Note**: the `task_params` method we defined in the previous part of the tutorial protects our task model from being assigned with a `user_id` from the parameters.  

So, all cool? Nope.

In the home page we show all the tasks. **ALL** the tasks.

This isn't right. So there is a last thing to do. Filter the tasks. Thankfully, CanCan provides us with a very nice way to do this.
A model scope that uses the `ability.rb` permissions!  

Open the pages_controller.rb and change it as below:

``` ruby
class PagesController < ApplicationController
  def home
    @tasks = Task.accessible_by(current_ability)
  end
end
```

And now we are fine. I suggest you register more users and start messing with the `user_id` attributes of your tasks to see the authorization being applied.

This is the last part of the tutorial that we actually implement stuff for the ToDo application.

There is going to be a [final part]({% post_url 2013-12-22-creating-a-simple-todo-part-4 %}) in which I am going to help you deploy the application to [**OpenShift**][32]!

[1]: http://1.bp.blogspot.com/-qIfreNotTpg/UrSBgYW36II/AAAAAAAAAyQ/t98tHupX2ak/s320/part-three.png
[2]: https://github.com/plataformatec/devise
[3]: https://github.com/ryanb/cancan
[4]: https://github.com/iridakos/todo
[5]: http://3.bp.blogspot.com/-xir1xot_tWk/UrQSPpJ98CI/AAAAAAAAAs0/r43-pJC-xMo/s1600/1.png
[6]: http://4.bp.blogspot.com/-k8L0mJDKAu0/UrQSsm2YGQI/AAAAAAAAAs8/bQeU2mEOWQs/s1600/2.png
[7]: http://3.bp.blogspot.com/-lNN_HazoxYY/UrQTfkGR4oI/AAAAAAAAAtI/ljslOQ0_wCM/s640/3.png
[8]: http://4.bp.blogspot.com/-oBAp7BGPwgM/UrQYXXpg-KI/AAAAAAAAAtY/M5incD478fI/s1600/4.png
[9]: https://github.com/plataformatec/devise/wiki/How-To:-Add-:confirmable-to-Users
[10]: http://1.bp.blogspot.com/-74eeusjNHpg/UrQa8kQgouI/AAAAAAAAAts/LI_SELrKXA0/s640/5.png
[11]: http://2.bp.blogspot.com/-Z1VgW9-WuXE/UrQcDBERk9I/AAAAAAAAAt4/D15Cqkh7GLg/s640/6.png
[12]: http://4.bp.blogspot.com/-3FYuBjpmTWw/UrQeLkwrCnI/AAAAAAAAAuE/6Ena1dL1b90/s640/7.png
[13]: http://3.bp.blogspot.com/-kDWvyY_Qotw/UrQfhEoMQiI/AAAAAAAAAuQ/4ID6lfDRqRg/s1600/8.png
[14]: http://4.bp.blogspot.com/-2A125ZPTEfw/UrQo04ValPI/AAAAAAAAAu8/orkztT1rr3s/s1600/12.png
[15]: https://github.com/plataformatec/devise/wiki/How-To:-Create-Haml-and-Slim-Views
[16]: http://3.bp.blogspot.com/-jRHXoh7ysMs/UrQmiN2ffHI/AAAAAAAAAuo/QJFz4X8Fl6s/s1600/10.png
[17]: http://1.bp.blogspot.com/-ExLgrVNbHTU/UrQnL6zy2-I/AAAAAAAAAuw/2JfqAKK6IrU/s640/11.png
[18]: http://1.bp.blogspot.com/-NXzY4nuli0g/UrQpgehMmnI/AAAAAAAAAvE/U-YGvUPVbxQ/s640/13.png
[19]: http://2.bp.blogspot.com/-Plj6rsGDvPE/UrQqCiD_3pI/AAAAAAAAAvQ/Qo22lTV8tgs/s640/14.png
[20]: http://1.bp.blogspot.com/-AFkOWlbnNiA/UrQq1K1tsrI/AAAAAAAAAvY/bYZ8uUvLWRs/s1600/15.png
[21]: http://4.bp.blogspot.com/-0iTNQwKaEUk/UrQt8lPzxII/AAAAAAAAAvk/akprw06R5Ts/s640/16.png
[22]: http://1.bp.blogspot.com/-M5kXD_V2RJU/UrQwfTnE8cI/AAAAAAAAAvw/B5_KniFRHIU/s640/17.png
[23]: http://guides.rubyonrails.org/action_controller_overview.html#the-flash
[24]: http://4.bp.blogspot.com/-wQVFcTS-vFA/UrQzGH2Yp4I/AAAAAAAAAv8/vRuJ8olI1yk/s640/18.png
[25]: http://4.bp.blogspot.com/-2lam0erxDBA/UrQ133DLRtI/AAAAAAAAAwQ/KR--jTKRXV0/s640/20.png
[26]: http://4.bp.blogspot.com/-cy_DXi5UeBw/UrQ1oSg6qTI/AAAAAAAAAwI/AOSupkAqqjA/s640/19.png
[27]: http://2.bp.blogspot.com/-rf6pLHwapaY/UrQ6HxhMDDI/AAAAAAAAAwc/615aBqlUuqY/s1600/21.png
[28]: http://1.bp.blogspot.com/-XkBNiD-AePg/UrQ8eJN36SI/AAAAAAAAAwo/BsIhoz-GywM/s1600/22.png
[29]: http://4.bp.blogspot.com/-fdjSjLQEzt4/UrQ8eRWuyFI/AAAAAAAAAw0/eqMYw0u3k78/s1600/23.png
[30]: http://4.bp.blogspot.com/-C_nH_YI9AVA/UrQ91EbYGOI/AAAAAAAAAw4/SMEQexVFuiE/s1600/24.png
[31]: https://github.com/ryanb/cancan/wiki/Authorizing-controller-actions
[32]: https://www.openshift.com/
