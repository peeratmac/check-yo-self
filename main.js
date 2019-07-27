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

// * Calling Make Task List button addToDoItem button because it is making more sense right now
var addToDoItemButton = document.querySelector('.nav__button--addToDo');

var clearAllButton = document.querySelector('.nav__button--clear');
var main = document.querySelector('.main');
// ! var markCompleteImg = document.querySelector('.card__checkbox--img');

// * Event Listeners
navigationAside.addEventListener('click', navHandlers);
newToDoTitleInput.addEventListener('keyup', inputHandlers);
newTaskItemInput.addEventListener('keyup', inputHandlers);
main.addEventListener('click', mainHandlers);
// ! markCompleteImg.addEventListener('click', markTaskOff);

// * Functions Run on Page Load
reInstantiateAll();
disableButtons();

// * Functions
function getCardIndex(event) {
  var index = event.target.closest('.card').getAttribute('data-id');
  return toDosArray.findIndex(function(card) {
    return card.id === parseInt(index);
  });
}

function getTaskIndex(event, cardIndex) {
  var index = event.target.closest('.card__tasks').getAttribute('data-id');
  return toDosArray[cardIndex].tasks.findIndex(function(task) {
    return task.id === parseInt(index);
  });
}

function getTasksToBeAddedIndex(taskID) {
  return tasksArray.findIndex(function(task) {
    return task.id === parseInt(taskID);
  });
}

function markTaskOff(event) {
  // define card in question
  console.log('markTaskOff');
  var cardIndex = getCardIndex(event);
  var card = toDosArray[cardIndex];
  // define task in question
  var task = event.target.closest('.card__tasks');
  // check on the image checkmark

  // increment completion count
  // update data to localstorage
}

// Delete tasks as they are stack up during initial composing phase
function deleteTasksToBeAdded(event) {
  var task = event.target.closest('.temp__div');
  var taskID = task.getAttribute('data-id');
  getTaskIndex = getTasksToBeAddedIndex(taskID);
  task.remove();
  tasksArray.splice(getTaskIndex, 1);
  console.log(taskID);
}

function clearInput(event) {
  if (event.target === addTaskItemButton) {
    newTaskItemInput.value = '';
    enableButtons();
  } else {
    newTaskItemInput.value = '';
    newToDoTitleInput.value = '';
    tasksToBeAdded.innerHTML = '';
    tasksArray = [];
    disableButtons();
  }
}

function enableButtons() {
  addToDoItemButton.disabled = false;
  clearAllButton.disabled = false;
}

function disableButtons() {
  addToDoItemButton.disabled = true;
  clearAllButton.disabled = true;
}

// Reinstantiation of todos and tasks
function reInstantiateAll() {
  var toDosArray1 = JSON.parse(localStorage.getItem('toDoObjects')) || [];
  toDosArray1.forEach(function(oldToDoObject) {
    reToDo(oldToDoObject);
  });
}

// Handle for everything on the navigation aside part
function navHandlers(event) {
  event.preventDefault();
  if (event.target === addToDoItemButton) {
    newToDo(event);
  }
  if (event.target === addTaskItemButton) {
    newTask(event);
  }
  if (event.target.className === 'temp__delete__img') {
    deleteTasksToBeAdded(event);
  }
  if (event.target === clearAllButton) {
    clearInput(event);
  }
}

// Handle for Inputs
function inputHandlers() {
  if (newToDoTitleInput.value !== '' || newTaskItemInput.value !== '') {
    enableButtons();
  } else {
    disableButtons();
  }
}

// Handle for Main card area
function mainHandlers() {
  event.preventDefault();
  if (event.target.className === 'card__checkbox--img') {
    checkboxCheck(event);
  }
}

// Main -- checkbox function inside the card
function checkboxCheck(event) {
  var cardIndex = getCardIndex(event);
  var eachTaskIndex = getTaskIndex(event, cardIndex);
  var checkbox = toDosArray[cardIndex].tasks[eachTaskIndex].check;
  // checkbox check true > false or false > true
  checkbox = !checkbox;
  toDosArray[cardIndex].updateTask(eachTaskIndex, checkbox);
  checkboxImgChange(event, cardIndex, eachTaskIndex);
}

function checkboxImgChange(event, cardIndex, eachTaskIndex) {
  checkboxImage = event.target;
  var checkboxTrue = 'images/checkbox-active.svg';
  var checkboxFalse = 'images/checkbox.svg';

  toDosArray[cardIndex].tasks[eachTaskIndex].check
    ? (checkboxImage.src = checkboxTrue)
    : (checkboxImage.src = checkboxFalse);
}

// New ToDo
function newToDo(event) {
  if (newToDoTitleInput.value !== '' && tasksArray.length != 0) {
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
    clearInput(event);
  }
}

// Re-do todos to make them object again
function reToDo(oldToDoObject) {
  var toDo = new ToDoList(oldToDoObject);
  reTasks(toDo);
  appendToDo(toDo);
  toDosArray.push(toDo);
}

// New Task (individual tasks inside one ToDo card)
function newTask() {
  var taskItemInput = newTaskItemInput.value;
  if (taskItemInput !== '') {
    var task = new Task({
      id: Date.now(),
      taskContent: taskItemInput,
      check: false
    });
    tasksArray.push(task);
    appendTask(task);
    task.saveToStorage(tasksArray);
    clearInput(event);
  }
}

// Re-do tasks to make them object again
function reTasks(toDo) {
  for (var i = 0; i < toDo.tasks.length; i++) {
    toDo.tasks[i] = new Task(toDo.tasks[i]);
  }
}

// Append tasks on the nav aside
function appendTask(object) {
  console.log('hello task');
  var newTask = `<div class="temp__div" data-id="${object.id}">
  <img class="temp__delete__img" src="images/delete.svg" alt="" />
  <p class="temp__p">${object.taskContent}</p>
</div>`;
  tasksToBeAdded.insertAdjacentHTML('beforeend', newTask);
}

// Append ToDo card
function appendToDo(object) {
  console.log('hello todo');
  var newToDo = `<article class="card" data-id=${object.id}>
  <header class="card__header">
    <h3 class="card__header__h3">${object.title}</h3>
  </header>
  <section class="card__section">
    ${addTasksToCard(object)}
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

// Add individual tasks from aside to actual card of ToDos
function addTasksToCard(toDo) {
  var navListOfTasks = '';
  for (var i = 0; i < toDo.tasks.length; i++) {
    navListOfTasks =
      navListOfTasks +
      `<div class="card__tasks" data-id=${
        toDo.tasks[i].id
      }> <img class="card__checkbox--img" src=${
        toDo.tasks[i].check
          ? 'images/checkbox-active.svg'
          : 'images/checkbox.svg'
      } alt="Checkmark Icon" /> <p class="card__p ${toDo.tasks[i].check}" id>${
        toDo.tasks[i].taskContent
      }</p></div>`;
  }
  return navListOfTasks;
}
