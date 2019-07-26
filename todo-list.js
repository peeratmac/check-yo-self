class ToDoList {
  constructor(toDoObject) {
    this.id = toDoObject.id;
    this.title = toDoObject.title;
    this.tasks = toDoObject.tasks || [];
    this.urgent = toDoObject.urgent;
  }

  saveToStorage() {
    // TODO:  save to storage
  }

  deleteFromStorage() {
    // TODO:  delete from storage
  }

  updateToDo() {
    // TODO:  update todo's title and urgency
  }

  updateTask() {
    // TODO:  update task's content and if it has been completed
  }
}

class Task {
  constructor(taskObject) {
    this.id = taskObject.id;
    this.taskContent = taskObject.taskContent;
    this.checked = taskObject.checked || false;
  }
}
