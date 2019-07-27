// * Global Variables
var toDosArray = [];
var tasksArray = [];

// * Query Selectors
var navigationAside = document.querySelector('.nav');
var newToDoTitleInput = document.querySelector(
  '.nav__form__section__input--title'
);
var tasksToBeAdded = document.querySelector('.nav__form__section--tasks');
var newTaskItemInput = document.querySelector(
  '.nav__form__section__input--task'
);
var addTaskItemButton = document.querySelector('.nav__form__section__img--add');
var addToDoItemButton = document.querySelector('.nav__button--addToDo');
var main = document.querySelector('.main');

// * Event Listeners
navigationAside.addEventListener('click', navHandlers);

// * Functions Run on Page Load
reInstantiateAll();

// * Functions
function clearInput(input) {
  input.value = '';
}

function reInstantiateAll() {
  var toDosArray1 = JSON.parse(localStorage.getItem('toDoObjects')) || [];
  toDosArray1.forEach(function(oldToDoObject) {
    reToDo(oldToDoObject);
  });
}

function navHandlers(event) {
  event.preventDefault();
  if (event.target === addToDoItemButton) {
    newToDo(event);
  }
  if (event.target === addTaskItemButton) {
    newTask(event);
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
  appendToDo(toDo);
  toDo.saveToStorage(toDosArray);
  clearInput(newToDoTitleInput);
}

function reToDo(oldToDoObject) {
  var toDo = new ToDoList(oldToDoObject);
  reTasks(toDo);
  appendToDo(toDo);
  toDosArray.push(toDo);
}

function newTask() {
  var taskItemInput = newTaskItemInput.value;
  var task = new Task({
    id: Date.now(),
    taskContent: taskItemInput,
    check: false
  });
  tasksArray.push(task);
  appendTask(task);
  task.saveToStorage(tasksArray);
  clearInput(newTaskItemInput);
}

function reTasks(toDo) {
  for (var i = 0; i < toDo.tasks.length; i++) {
    toDo.tasks[i] = new Task(toDo.tasks[i]);
  }
}

function appendTask(object) {
  console.log('hello task');
  var newTask = `<div class="temp__div" data-id="${object.id}">
  <img class="temp__delete__img" src="images/delete.svg" alt="" />
  <p class="temp__p">${object.taskContent}</p>
</div>`;
  tasksToBeAdded.insertAdjacentHTML('afterbegin', newTask);
}

function appendToDo(object) {
  console.log('hello todo');
  var newToDo = `<article class="card">
  <header class="card__header">
    <h3 class="card__header__h3">Task Title Here</h3>
  </header>
  <section class="card__section">
    task list here -- need a method to append
  </section>
  <footer class="card__footer">
    <div class="card__urgent">
      <img
        class="card__urgent--img"
        src="images/urgent.svg"
        alt="Urgent Indicator Icon"
      />
      <p class="card__footer__urgent--text">URGENT</p>
    </div>
    <div class="card__delete">
      <img class="card__delete--img" src="images/delete.svg" alt="" />
      <p class="card__footer__delete--text">DELETE</p>
    </div>
  </footer>
</article>`;
  main.insertAdjacentHTML('afterbegin', newToDo);
}
