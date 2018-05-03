let eventHandler = {
  CreateEvent: function() {
    $("#createTaskBtn").on('click', function() {
      createTask();
    })
  },

  StartEvent: function() {
    $(".btn-start-task").on('click', function() {
      let id = $(this).data('id');
      updateTask('start', id);
    })
  },

  UpdateEvent: function() {
    $(".btn-ready-task").on('click', function() {
      let id = $(this).data('id');
      let done = $(this).data('done')
      updateTask('update', id, done);
    })
  },

  DeleteEvent: function() {
    $(".btn-delete-task").on('click', function() {
      let id = $(this).data('id');
      deleteTask(id);
    })
  },

  DisableEvent: function() {
    $(".btn-disable-task").on('click', function() {
      let id = $(this).data('id');
      updateTask('disable', id);
    })
  },

  CleanHandlers: function() {
    $("#createTaskBtn").off('click');

    $(".btn-start-task").off('click');

    $(".btn-ready-task").off('click');

    $(".btn-delete-task").off('click');

    $(".btn-disable-task").off('click');
  },

  UpdateHandlers: function() {
    this.CleanHandlers();
    this.CreateEvent();
    this.StartEvent();
    this.UpdateEvent();
    this.DeleteEvent();
    this.DisableEvent();
  }
}

function appendTaskComponent(type, id, description, date, done) {

  if (type === 'all') {
    let allTasksListComponent = `<li class="list-group-item" id="allTasksItem${id}">
                                    <div class="row">
                                        <div class="col-md-9">
                                            <p>${description}</p>
                                        </div>
                                        <div class="col-md-3 clearfix">
                                            <button type="button" class="btn btn-primary btn-xs pull-right btn-start-task btn-task-m-t" data-id="${id}">
                                                Start
                                                <span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>
                                            </button>
                                            <button type="button" class="btn btn-danger btn-xs pull-right btn-delete-task btn-task-m-t" data-id="${id}">
                                                Delete
                                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                            </button> <br>
                                            <span class="all-task-list-date pull-right">${date || ''}</span>
                                        </div>
                                    </div>
                                </li>`;

      $('#allTasksList').append(allTasksListComponent);
  } else if (type === 'current') {
    let currentListComponent = `<li class="list-group-item ${done ? 'task-success' : ''}" id="currentTasksItem${id}">
                                    <div class="row">
                                        <div class="col-md-9">
                                            <p>${description}</p>
                                        </div>
                                        <div class="col-md-3 clearfix">
                                            <button type="button" class="btn btn-success btn-xs pull-right btn-ready-task btn-task-m-t" data-done=${done} data-id="${id}">
                                                Ready
                                                <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
                                            </button>
                                            <button type="button" class="btn btn-warning btn-xs pull-right btn-task-m-t btn-disable-task" data-id="${id}">
                                                Disable
                                                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                            </button>
                                        </div>
                                    </div>
                                </li>`;

    $('#currentTasksList').append(currentListComponent);
  }
}

function loadData() {

  return fetch(`/api/tasks/`, {
    method: 'get',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then((response) => response.json())
  .then((responseJson) => {
    let date = new Date();
    let formatDate = `${date.getFullYear()}-${date.getMonth() < 9 ? 0 : null}${date.getMonth()+1}-${date.getDate() < 10 ? 0 : null}${date.getDate()}`;

    if (responseJson) {
      responseJson.forEach(function(e, i) {
        if (formatDate === e.date) {
          appendTaskComponent('current', e.id, e.description, e.date, e.done);
        } else if (!e.done) {
          appendTaskComponent('all', e.id, e.description, e.date);
        }
      });

      eventHandler.UpdateHandlers();
    }
  })
  .catch((error) => {
    console.log(error);
  });
}

function createTask() {

  let body = {
    description: $('#taskDescriptionInput').val(),
    date: $('#datetimepicker').val(),
  }

  if (!body.description) {
    return false;
  }

  return fetch(`/api/tasks/`, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then((response) => response.json())
  .then((responseJson) => {
    let date = new Date();
    let formatDate = `${date.getFullYear()}-${date.getMonth() < 9 ? 0 : null}${date.getMonth()+1}-${date.getDate() < 10 ? 0 : null}${date.getDate()}`;

    if (responseJson) {
        if (formatDate === responseJson.date) {
          appendTaskComponent('current', responseJson.id, responseJson.description, responseJson.date, responseJson.done);
        } else if (!responseJson.done) {
          appendTaskComponent('all', responseJson.id, responseJson.description, responseJson.date);
        }

        eventHandler.UpdateHandlers();
    }

    $('#taskDescriptionInput').val('');
    $('#datetimepicker').val('');
  })
  .catch((error) => {
    console.log(error);
  });
}

function updateTask(event, id, done) {

  if (event === 'update') {
    var body = {
      done: !done
    }
  } else if (event === 'disable') {
    var body = {
      done: false,
      date: null
    }
  } else if (event === 'start') {
    let date = new Date();
    let formatDate = `${date.getFullYear()}-${date.getMonth() < 9 ? 0 : null}${date.getMonth()+1}-${date.getDate() < 10 ? 0 : null}${date.getDate()}`;

    var body = {
      date: formatDate
    }
  }

  return fetch(`/api/tasks/${id}/`, {
    method: 'patch',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then((response) => response.json())
  .then((responseJson) => {
    if (event === 'update') {
      $(`#currentTasksItem${id}`).toggleClass('task-success');
      $(`#currentTasksItem${id}`).data('done') = !$(`#currentTasksItem${id}`).data('done');
    } else if (event === 'disable') {
      $(`#currentTasksItem${id}`).remove();
      appendTaskComponent('all', responseJson.id, responseJson.description, responseJson.date);
    } else if (event === 'start') {
      $(`#allTasksItem${id}`).remove();
      appendTaskComponent('current', responseJson.id, responseJson.description, responseJson.date, responseJson.done);
    }
    console.log(responseJson);
    eventHandler.UpdateHandlers();
  })
  .catch((error) => {
    console.log(error);
  });
}

function deleteTask(id) {

  return fetch(`/api/tasks/${id}/`, {
    method: 'delete',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then((response) => response.ok ? $(`#allTasksItem${id}`).remove() : null)
  .catch((error) => {
    console.log(error);
  });
}

window.onload = function() {
  $('#datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD',
  });

  eventHandler.UpdateHandlers();
  loadData();
};