// * Global Variables
var toDosArray = [];
var tasksArray = [];

// * Query Selectors
var navigationAside = document.querySelector('.nav');
var newToDoTitleInput = document.querySelector(
  '.nav__form__section__input--title'
);
var newTaskItemInput = document.querySelector(
  '.nav__form__section__input--task'
);
var addTaskItemButton = document.querySelector('.nav__form__section__img--add');
var addToDoItemButton = document.querySelector('.nav__button--addToDo');

// * Event Listeners
navigationAside.addEventListener('click', navHandlers);

// * Functions Run on Page Load

// * Functions
function navHandlers(event) {
  event.preventDefault();
  if (event.target === addToDoItemButton) {
    newToDo(event);
  }
  if (event.target === addTaskItemButton) {
    // ! new Task
  }
}

function newToDo(event) {
  event.preventDefault();
  var toDo = new ToDoList({
    id: Date.now(),
    title: newToDoTitleInput.value,
    tasks: tasksArray,
    urgent: false
  });
  toDosArray.push(toDo);
  toDo.saveToStorage(toDosArray);
}

function newTask() {
  var taskItemInput = newTaskItemInput.value;
  var task = new Task({
    id: Date.now(),
    taskContent: taskItemInput,
    check: false
  });
  tasksArray.push(task);
}

function appendTask(event, object) {
  var newTask = `<div class="temp___div" data-id="${object.id}">
  <img class="temp__delete__img" src="images/delete.svg" alt="" />
  <p class="temp__p">${object.taskContent}</p>
</div>`;
  // ! .insertAdjacentHTML
}
