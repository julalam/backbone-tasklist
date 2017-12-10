// Vendor Modules
import $ from 'jquery';
import _ from 'underscore';

// CSS
import './css/foundation.css';
import './css/style.css';

import Task from './models/task';
import TaskList from './collections/task_list';

import TaskView from './views/task_view'

const taskList = new TaskList();

const renderList = function(taskList) {
  const $taskList = $('#todo-items');
  $taskList.empty();

  taskList.forEach((task) => {
    const taskView = new TaskView({
      model: task,
      template: _.template($('#task-template').html()),
      tagName: 'li',
      className: 'task',
    });

    $taskList.append(taskView.render().$el);
  });
}

// helper method for updating the DOM with the status from a hash
const updateStatusMessageFrom = (messageHash) => {
  $('#status-messages').empty();
  _.each(messageHash, (messageType) => {
    messageType.forEach((message) => {
      $('#status-messages').append($(`<li>${message}</li>`));
    })
  });
  $('#status-messages').show();
}

// helper method for updating the DOM with the status from a string
const updateStatusMessageWith = (message) => {
  $('#status-messages').empty();
  $('#status-messages').append($(`<li>${message}</li>`));
  $('#status-messages').show();
}

const addNewTask = function(event) {
  event.preventDefault();

  const taskData ={};
  ['task_name', 'assignee'].forEach( (field) => {
    const val = $(`input[name=${field}]`).val();
    if (val != '') {
      taskData[field] = val;
    }
  });
  const newTask = new Task(taskData);

  if (newTask.isValid()) {
    taskList.add(newTask);
    updateStatusMessageWith(`New task added: ${newTask.get('task_name')}`);
  } else {
    updateStatusMessageFrom(newTask.validationError);
  }
}

$(document).ready( () => {
  taskTemplate = _.template($('#task-template').html());

  $('#add-task-form').submit(addNewTask);

  taskList.on('update', renderList, taskList);

  taskList.add(new Task({task_name: "Put rendering logic in Backbone Views", assignee: "Me"}));
  taskList.add(new Task({task_name: "Put handling events in Backbone Views", assignee: "Me"}));
  taskList.add(new Task({task_name: "Eat a tasty thing"}));
});
