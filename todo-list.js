class ToDoList {
  constructor(toDoObject) {
    this.id = toDoObject.id;
    this.title = toDoObject.title;
    this.tasks = toDoObject.tasks || [];
    this.urgent = toDoObject.urgent;
    this.completionCount = 0;
  }

  saveToStorage(toDosArray) {
    // save to storage
    localStorage.setItem('toDoObjects', JSON.stringify(toDosArray));
  }

  deleteFromStorage(toDoIndex) {
    // delete from storage
    toDosArray.splice(toDoIndex, 1);
    this.saveToStorage(toDosArray);
  }

  updateToDo(urgent) {
    // update todo's title and urgency
    // TODO:  update todo's title
    this.urgent = urgent;
    this.saveToStorage(toDosArray);
  }

  updateTask(taskIndex, check) {
    // update task's content and if it has been completed
    // TODO:  update task's content
    this.tasks[taskIndex].check = check;
    this.saveToStorage(toDosArray);
  }
}

class Task {
  constructor(taskObject) {
    this.id = taskObject.id;
    this.taskContent = taskObject.taskContent;
    this.check = taskObject.check || false;
  }

  saveToStorage(tasksArray) {
    localStorage.setItem('taskObjects', JSON.stringify(tasksArray));
  }
}
