---
layout: default
title:  "Creating a simple ToDo application with Ruby on Rails - Part 4"
description: "Last part of the tutorial creating a simple ToDo application with Ruby on Rails."
date:   2013-12-22 10:00:00 +0300
category: "tutorials"
comments: true
outline: true
image: "https://iridakos.com/assets/images/site.png"
identifier: "todo-part-4"
popular: -1
tags:
  - ruby
  - rails
  - tutorial
  - todo
  - web application
  - mvc
show_popular_inline_posts: true
redirect_from:
  - /2013/12/22/creating-a-simple-todo-part-4.html
related_posts:
  - todo-part-1
  - todo-part-2
  - todo-part-3
  - todo-gtk-plus-ruby-tutorial
---

In the previous three posts we created a simple ToDo application with Ruby on Rails.
In this last part we are going to deploy the application to OpenShift.

You can find the complete code of the tutorial [here](https://github.com/iridakos/todo).

### OpenShift

---

[OpenShift](https://www.openshift.com/) is a cloud application platform (by Red Hat).

Few months ago, when I was discovering Ruby & Ruby on Rails I started developing an application in order to practice.

When I completed the first version I wanted to have it online for demonstration purposes and thus I started exploring my options. I decided really fast since I had a requirement that only OpenShift (at least at that time) could fulfill: local storage. I wanted to allow users to upload files without using any other online storage service. I needed to have the files on the same server.

Now, after 4 months, I'm completely satisfied with my decision and not just because of the local storage:

* I deploy my application in 5 minutes with a single command
* great documentation and support
* awesome tools for managing my "remote" machine - rch client tools
* no surprises, what I deploy is what I see with no sudden downtimes, errors etc
* there's a free plan with 3 gears :)

So, let's start.

We are going to use git so if you don't have it yet, [install it now](http://git-scm.com/downloads).

Create an account to OpenShift for free [here](https://www.openshift.com/app/account/new).

We will install the client tools (rhc). From the command line:

``` bash
gem install rhc
```

![](https://1.bp.blogspot.com/-qmddyVqJAWo/UrYyrQZWdlI/AAAAAAAAAys/RxdYjVLXy5c/s640/1.png)

and we are going to configure them with:

``` bash
rhc setup
```

Follow the instructions and type your credentials:

![](https://1.bp.blogspot.com/-fgDtadeEAZ8/UrYzdiht-0I/AAAAAAAAAy0/QndPEz-8Bf0/s1600/2.png)

Choose to generate the token so that you don't have to login each time you interact with your remote machine (from now on we will call this gear):

![](https://1.bp.blogspot.com/-gMQscjCrY-o/UrY0ClEh03I/AAAAAAAAAy8/f-zDdoVKH5o/s1600/3.png)

If you don't have any SSH keys, OpenShift will automatically generate one for you (nice) and will ask you if you want it to upload it to the server so that you can access your code. Say yes.

![](https://3.bp.blogspot.com/-t4iWnn9SI-8/UrY0xJdjGSI/AAAAAAAAAzI/g4AwwfD-nhU/s1600/4.png)

Next, you will be asked to create a domain under which your applications will be grouped. Choose one (this is going to be used in your applications public url ex: todo-yourdomain.rhcloud.com). I chose arubystory:

![](https://4.bp.blogspot.com/-JviK4uOeYgg/UrY1alm4zKI/AAAAAAAAAzQ/_y3e88Dg9fg/s1600/5.png)

That's all. We configured the tools to use our account.

### OpenShifting the ToDo

---

Time to "create" the ToDo application on OpenShift.

When we will fire the command, the tool is going to create the application on OpenShift and then it will try to clone the remote repo to a local folder with the same name as the application. We want to skip the last part because we already have this folder. To do so, we are going to execute the command from the directory containing our project's directory.

My todo project is under `/Users/developer/development/projects/todo` so I will execute it from `/Users/developer/development/projects`
Doing so, the git clone will fail and we will have to manually connect our local repo with the remote later.

From the command line:

``` bash
cd /to/the/directory/containing/the/todo/directory
rhc create-app todo ruby-1.9
```

![](https://1.bp.blogspot.com/-IqQuQgop4ZU/UrZEF5ZwS5I/AAAAAAAAAzg/LqEAire0Jdc/s1600/6.png)

Great. Now, let's initialize our local git repo. From the command line:

``` bash
cd todo
git init
```

![](https://3.bp.blogspot.com/-yMSB9Vpd0pA/UrZEmAeN_CI/AAAAAAAAAzo/U5hfaUkbF1Y/s1600/7.png)

We will add the remote git using the information provided with the following command:

``` bash
rhc app-show todo
```

![](https://4.bp.blogspot.com/-sgiZ2SdRUmU/UrZFbbe5YdI/AAAAAAAAAz0/2gLJ__htjjw/s1600/8.png)

Copy the value of the Git URL because you are going to use it in the following command:

``` bash
git remote add openshift [paste the value here]
```

Let's commit. From the command line:

``` bash
git add .
git commit -m "First commit"
```

And let's merge the remote:

``` bash
git pull openshift master
```

![](https://3.bp.blogspot.com/-BFo5XPYtTtM/UrZIOXVaH-I/AAAAAAAAA0I/_taobz4pVfs/s1600/10.png)

As you can see, we have a conflict in config.ru. Edit this file and change it to the following (we overwrite the remote changes with ours):

``` ruby
# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
run Rails.application
```

Commit the changes, from the command line:

``` bash
git add config.ru
git commit -m "OpenShift merge"
```

And time to deploy the application! With one line. This:

``` bash
git push openshift master
```

Visit the application url from your browser: `http://todo-yourdomainhere.rhcloud.com`

![](https://3.bp.blogspot.com/-L0ClFgw1yxc/UrZK-S3-6GI/AAAAAAAAA0U/PExw1aB2otU/s1600/12.png)

Don't worry, we expected this. We haven't setup the database for production. We will do this "sshing" to our gear. From the command line:

``` bash
rhc ssh todo
```

Yes, this is your gear. Let's setup the database. From the gears command line:

``` bash
cd app-root/repo
RAILS_ENV=production rake db:setup
```

1[](https://4.bp.blogspot.com/-lA0fku7ntBE/UrZL96zKpWI/AAAAAAAAA0c/sA_PDf2Kqm4/s1600/13.png)

Exit the gear:

``` bash
exit
```

and from your command line (not the gear's one) restart the application:

``` bash
rhc app-stop todo
rhc app-start todo
```

Give it some time and refresh your browser. There it is!

![](https://2.bp.blogspot.com/-KYlHEZo6-BU/UrZNbtEIC2I/AAAAAAAAA00/0cRGmosRbSs/s1600/15.png)

Now, if you try to sign up you'll see the error message again.

This is expected too. Our email configuration was only for the development environment (we had it only in `development.rb` file and also we were using the `mailcatcher` for simulating an smtp server).

We obviously want emails to be really sent to our users in production so we must go with a real configuration. I will show you how to configure mailer to use a gmail account. Add the following in `config/environments/production.rb`

``` ruby
config.action_mailer.raise_delivery_errors = true
config.action_mailer.default_url_options = { host: 'http://todo-yourdomainhere.rhcloud.com' }
config.action_mailer.asset_host = 'http://todo-yourdomainhere.rhcloud.com'
config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
  address: 'smtp.gmail.com',
  port: 587,
  user_name: 'your_username@gmail.com',
  password: 'your_password',
  authentication: 'plain',
  enable_starttls_auto: true
}
```

Let's deploy the fix. From the command line:

``` bash
git add .
git commit -m "Mail setup in production"
git push openshift master
```

After the gear starts, refreshing the browser you'll see the error message again.
This time the problem is once again the database. But why? Take a look at your `db/database.yml`

![](https://3.bp.blogspot.com/-qgxy1WWIaMg/UrZh50LdrHI/AAAAAAAAA1A/xgqImrRFllw/s1600/16.png)

As you can see, the database is saved under `db/production.sqlite3`.
This file doesn't exist in our repo. We are going to set this value pointing to a file that is not in the repo but to another directory of the gear! That directory already exists and OpenShift has taken care so that we can see what it is with an env variable: OPENSHIFT_DATA_DIR . Change the production database line to this:

``` yaml
database: <%=ENV['OPENSHIFT_DATA_DIR']%>/production.sqlite3
```

![](https://4.bp.blogspot.com/-mzQw3oyDS9E/UrZl-loYqZI/AAAAAAAAA1Y/I_GhGH-ub4g/s1600/17.png)

Once again:

``` bash
git add .
git commit -m "Production database fix"
git push openshift master
```

Ssh to the gear again and re-setup the database:

``` bash
rhc ssh todo
```

From the gear's command prompt:

``` bash
cd app-root/repo
RAILS_ENV=production rake db:setup
```

Let's see that the database was created (gear's command line).

``` bash
cd $OPENSHIFT_DATA_DIR
ls
```
You should see the production.sqlite3 file there.

That's it. We're done! The application is successfully deployed to OpenShift.
