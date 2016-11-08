---
layout: post
title:  "Creating a simple ToDo application with Ruby on Rails - Part 2"
date:   2013-12-17 10:00:00 +0300
---

This is the second part of the tutorial about [creating a simple ToDo application]({% post_url 2013-12-07-creating-a-simple-todo-part-1 %}).

In this part, we are going to:

* implement the edit/delete actions accordingly
* add some validations on the Task model  


**You can find the complete code of the tutorial&nbsp;[here][1].**  

Let's start. Our home page looks like this:

![][2]

After creating a Task via the modal we have already implemented:

![][3]

we now want to update the table of tasks in the Home page without having to redirect to it.

In order to be able to do this, we need to do two things first:

* have the table being rendered inside an element with a known id so that we can change its contents with javascript
* create a partial that will be displaying a list of tasks instead of having them explicitly rendered row by row each time

So, open the `home.html.haml` in your text editor and replace its contents with the following:

``` haml
#task-list.container
  = render partial: 'tasks/task_list', locals: {tasks: @tasks}
#modal.modal.fade
```

Here, we added an id `#task-list` in the container div and we instructed the view to render inside it the partial with name task_list which is located under tasks aka: `tasks/_task_list.html.haml`

The partial doesn't exist yet so create the file under `app/views/tasks` and add the following to it:

``` haml
- if tasks.empty?
  %span.text-warning There are no tasks!
- else
  %table.table.table-hover.table-bordered
    %thead
      %tr
        %th Title
        %th Created at
        %th Completed
    %tbody
      - tasks.each do |task|
        %tr
          %td
            %strong= task.title
          %td.text-info= task.created_at
          %td.text-success= task.completed
```

As you can see, this is the code we already had in the home page but we changed the `@tasks` to `tasks`. From now on, this partial will be rendering the tasks passed to it using the l`ocals: {task: @foo}` way instead of always using the instance variable `@tasks`.

Refresh your browser, you should be having your home page displayed exactly as before. We are ready to change the way the create action behaves after completion.   

Edit the `_task_form.html.haml` file and change the line where we defined the form so that it posts its content via javascript instead of using normal post requests:

``` haml
.modal-header
  %h1 New Task
= simple_form_for task, class: 'clearfix', remote: true do |f|
  .modal-body
    = f.input :title
    = f.input :note
    = f.input :completed, as: :string, input_html: { class: 'datepicker' }
  .modal-footer
    = f.submit 'Save', class: 'btn btn-primary'
```

We did that just by adding the option `remote: true`.
If you try to create a Task now, you will see that even though the task is being created, no redirection takes place and that's because you can't redirect via javascript using the normal rails `redirect_to` method.

So far, the create action just redirected to another page so there was no need for an additional view. Now that we want to do some additional stuff, we need to create a view.
Create a `create.js.erb` file under `app/views/task` folder and add the following:

``` erb
$('#task-list').html('<%= j(render partial: 'tasks/task_list', locals: {tasks: @tasks}) %>');
$('#modal').modal('hide');
```

Here, we replaced the contents of the container div with the `task_list` partial and we hide the modal which contained the task form.

Edit the tasks' controller and change the create action to the following:

``` ruby
    def create
      @task = Task.create(task_params)
      @tasks = Task.all
    end
```

Check it out, after creating the Task, the modal closes and the task table is being updated correctly.

##  Deleting the tasks

---

We are going to add a link to each task row of the partial to provide the ability of deleting the task.

Change the contents of the task list partial to this:

``` haml
- if tasks.empty?
  %span.text-warning There are no tasks!
- else
  %table.table.table-hover.table-bordered
    %thead
      %tr
        %th Title
        %th Created at
        %th Completed
        %th Actions
    %tbody
      - tasks.each do |task|
        %tr
          %td
            %strong= task.title
          %td.text-info= task.created_at
          %td.text-success= task.completed
          %td
            = link_to task_path(task), remote: true, method: :delete do
              %i.icon-remove
```

We added a new column (Actions) to the header of the table and one at each row of a task. The link is "marked" as remote so that we trigger ajax requests and the method is set to delete.

Why? Let's see our routes, from the command line:

``` bash
    rake routes
```

![][4]

As you can see, the `destroy` method that we will create in order to delete a task is mapped under a `delete` method (second column).   

Refresh your browser, your should be seeing something like this:   

![][5]

Pressing the **x** link nothing happens. At least on the browser because in the server's console you'll see the error:

``` ruby
AbstractController::ActionNotFound (The action 'destroy' could not be found for TasksController):
```

Let's create the action. Add this to the tasks controller right after the create action:

``` ruby
def destroy
  @task = Task.find(params[:id])
  @task.destroy
  @tasks = Task.all
end
```

We now want to have the table updated upon each deletion and we'll do this by re-rendering the `task_list` partial.

Create the view `destroy.js.erb` under `app/views/tasks` and add the following:

``` erb
$('#task-list').html('<%= j(render partial: 'task_list', locals: {tasks: @tasks})%>');
```

Go back to the browser and check it.

The tasks are being deleted and the table is updated correctly but something doesn't feel right, right? Right.

It's too easy to delete a task by mistake. We will add a confirmation just to avoid this. The only thing we need to do is add the appropriate option to our link and rails will take care of it.

Change the link in the task_list partial to this:

``` haml
= link_to task_path(task), remote: true, method: :delete, data: {confirm: "Are you sure you want to delete task #{task.title}?"} do
  %i.icon-remove
```

And there it is:

![][6]

##  Editing the tasks

---

Once again, we will add a new link to the task list partial so that we can edit a task.

This time we won't need another column on the table, we will add it to the existing "Actions" one. When the user clicks on it, a modal with the task form will be rendered.
We can use the same partial we created for the **new** action but we will change some stuff.

Edit the `_task_list.html.haml` partial and change it to the following:

``` haml
- if tasks.empty?
  %span.text-warning There are no tasks!
- else
  %table.table.table-hover.table-bordered
    %thead
      %tr
        %th Title
        %th Created at
        %th Completed
        %th Actions
    %tbody
      - tasks.each do |task|
        %tr
          %td
            %strong= task.title
          %td.text-info= task.created_at
          %td.text-success= task.completed
          %td
            = link_to task_path(task), remote: true, method: :delete, data: {confirm: "Are you sure you want to delete task #{task.title}?"} do
              %i.icon-remove
            = link_to edit_task_path(task), remote: true do
              %i.icon-edit
```

In the controller, the only thing we need to do in the `edit` action is to load the task. Edit the `tasks_controller.rb` and add:

``` ruby
def edit
  @task = Task.find(params[:id])
end
```

Our edit view will just render the task form and since now the `@task` instance variable is an existing one, the fields will already have the respective values.

Create the file `edit.js.erb` under `app/views/tasks` and add the following (don't do it yet):

``` erb
    m = $('#modal');
    m.html('<%= j(render partial: 'task_form', locals: {task: @task})%>');
    m.modal('show');
    $('#modal').integrateDatepicker();
```

But wait a minute... Isn't this exactly the code the `new.js.erb` file has? Yes.

Instead of creating a duplicate, we will rename the `new.js.erb` to `show_form.js.erb` and we will instruct both the **new** & **edit** actions to use it instead of the defaults.

So rename the `new.js.erb` to `show_form.js.erb` and change the controller's corresponding actions to the following:

``` ruby
    def new
      @task = Task.new
      render :show_form
    end

    def edit
      @task = Task.find(params[:id])
      render :show_form
    end
```

Nice. Now, try to edit a task from your browser:

![][7]

Hmm, the title of the modal isn't right. We are editing, we're not creating.

To fix this, change the the `_task_form.html.haml` partial to the following:

``` haml
.modal-header
  %h1
    = task.new_record? ? 'New Task' : "Editing task #{task.title}"
= simple_form_for task, class: 'clearfix', remote: true do |f|
  .modal-body
    = f.input :title
    = f.input :note
    = f.input :completed, as: :string, input_html: { class: 'datepicker' }
  .modal-footer
    = f.submit 'Save', class: 'btn btn-primary'
```

Here, we added a condition in the header of the modal so that when the task of the partial is a new record, *New Task* will be rendered otherwise, *Edit task xxxx* where *xxxx* is the title of the existing task.

Since the task is already existing, the form has automatically been configured to make a put(patch) request to the appropriate path and we don't need to change something. We only need to implement the update action in the controller. So, edit the `tasks_controller.rb` and add the following just after the edit action:

``` ruby
def update
  @task = Task.find(params[:id])
  @task.update_attributes(task_params)
end
```

After the update, we want to hide the form and re-render the task list.

Yes, once again, this code will be exactly the one we have in `create.js.erb` so in order to avoid duplicates, we will rename the view to `hide_form.js.erb` and we will fix both actions (**create & update**) to render it instead of the defaults.

Rename the `create.js.erb` to `hide_form.js.erb` and change the controller's actions as here:

``` ruby
def create
  @task = Task.create(task_params)
  @tasks = Task.all

  render :hide_form
end

def update
  @task = Task.find(params[:id])
  @task.update_attributes(task_params)
  @tasks = Task.all

  render :hide_form
end
```

That's it. Everything seems to be working fine.

Nope. We have a little problem with the datepicker.

Create a task having it's `completed` field filled in and then try to edit it. The field is broken:   

![][8]

The problem here is that the date format used by our application and the one that the datepicker expects are not the same.

In an upcoming part of this tutorial we are going to add Users in our application and we will have preferences about the locales, date formats etc but for the time being we can just use a fixed one for anyone.

I will write an article with more details on date and time handling in Rails in the future.

Edit `environment.rb` which is located under config and add the following at the end of the file:

``` ruby
Date::DATE_FORMATS[:default]="%d/%m/%Y"
```

**Caution:** *restart the server* in order to view the changes

Edit `pages.js.coffee` and change the way we initialized the datepicker:

``` coffeescript
$.fn.extend {
  integrateDatepicker: (selector)->
    selector = selector || '.datepicker'
    $(@).find(selector).datepicker({format: 'dd/mm/yyyy'})
}
$(document).ready () ->
  $('body').integrateDatepicker()
```

and finally, edit `_task_form.html.haml` and change the "completed" input to this:

``` haml
= f.input :completed, as: :string, input_html: { class: 'datepicker', value: task.completed.present? ? localize(task.completed, format: '%d/%m/%Y') : nil }
```

Now we should be fine.

![][9]

###  Validating the tasks

---

We are fine, we can create/edit/delete tasks. One important thing missing though is validation.

Currently, we can save a task with no title or with a completed date in the future. In order to prevent this kind of data in the application, we will add validations to the task model. It's pretty easy in Rails.

Edit the `task.rb` model and change it to this:

``` ruby
class Task < ActiveRecord::Base
  validates_presence_of :title
  validate :future_completed_date

  private

  def future_completed_date
    if !completed.blank? && completed > Date.today
      self.errors.add(:completed, "can't be in the future")
    end
  end
end
```

Now we need to change the create/update actions so that when the task is not valid the form is re-rendered.

Change the actions of the controller as below (don't do it yet):

``` ruby
def create
  @task = Task.new(task_params)
  if @task.save
    @tasks = Task.all
    render :hide_form
  else
    render :show_form
  end
end

def update
  @task = Task.find(params[:id])
  @task.assign_attributes(task_params)
  if @task.save
    @tasks = Task.all
    render :hide_form
  else
    render :show_form
  end
end
```

We don't duplicate code. We will create a private method to do the saving of the instance variable `@task` regardless of the action calling it.

Change the actions to the following (this time do it):

``` ruby
def create
  @task = Task.new(task_params)
  save_task
end

def update
  @task = Task.find(params[:id])
  @task.assign_attributes(task_params)
  save_task
end
```

Then, after the private keyword of the controller (right before the `task_params` method), add the `save_task` method:

``` ruby
def save_task
  if @task.save
    @tasks = Task.all
    render :hide_form
  else
    render :show_form
  end
end
```

You should now see the following (in firefox) when trying to submit the form without the title:

![][10]

Keep in mind that this is not the rails error message.

Simple form scanned the Task model and since it found that the title attribute is required, it automatically added the html5 attribute "required" in the input.

The post request doesn't reach our server unless the browser you are using doesn't support the required attribute. In that case, you should see a message *can't be blank* which is the rails error message.

Let's see what happens with an invalid date:   

![][11]

Cool. That's what we wanted. Let's make the error look at least red. In your `pages.css.scss`:

``` css
span.error {
  color: #ac1414;
  margin-left: 5px;
}
```

![][12]

And that's all!

Thank you for the feedback you've given on the previous posts, I'd be glad to have your comments and corrections for this one too.

In the [next part]({% post_url 2013-12-20-creating-a-simple-todo-part-3 %}) of the tutorial we are going to use [devise][13] in order to have users logging in the application.

[1]: https://github.com/iridakos/todo
[2]: http://3.bp.blogspot.com/-G39owjB6qTI/Uq_zioffnZI/AAAAAAAAAnk/bjGpTH4dqME/s640/1.png
[3]: http://4.bp.blogspot.com/-kmORx8WFsEM/Uq_0C-W-6WI/AAAAAAAAAns/qU9R79NYtnw/s640/2.png
[4]: http://4.bp.blogspot.com/-Z-nuwZ9dnfk/UrACAaKIuHI/AAAAAAAAAn8/WPe5niaC7BM/s400/3.png
[5]: http://1.bp.blogspot.com/-eIkcB0w9JAY/UrADB0SimXI/AAAAAAAAAoE/q0qlmi_UfJ4/s640/4.png
[6]: http://2.bp.blogspot.com/-1Xn0zCidGok/UrAH14vIG0I/AAAAAAAAAoQ/-rKO13huY2k/s640/5.png
[7]: http://4.bp.blogspot.com/-4ey47nMaMNE/UrANxHeWqEI/AAAAAAAAAog/4H6d4GxV368/s1600/6.png
[8]: http://1.bp.blogspot.com/-gO8zVDgsoVQ/UrASSAfpaVI/AAAAAAAAAos/Q3rCTI9gm2g/s1600/7.png
[9]: http://3.bp.blogspot.com/-mYROVcZwLQc/UrAnMp1HVwI/AAAAAAAAAo8/UaPoxv5fF-M/s1600/8.png
[10]: http://2.bp.blogspot.com/-xYq5J2vQEeQ/UrAvrMDNWOI/AAAAAAAAApM/VS5Sm-BWuk0/s1600/9.png
[11]: http://4.bp.blogspot.com/-HhiPgbMeRIs/UrAyEOqValI/AAAAAAAAApY/wPV2z3qc4tc/s1600/10.png
[12]: http://3.bp.blogspot.com/-aiTerYwlzY4/UrA0LWja2lI/AAAAAAAAApk/5GgVDa64Fyw/s1600/11.png
[13]: https://github.com/plataformatec/devise
