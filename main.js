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
var filterByUrgencyButton = document.querySelector('.nav__button--filter');
var main = document.querySelector('.main');

// * Event Listeners
navigationAside.addEventListener('click', navHandlers);
newToDoTitleInput.addEventListener('keyup', inputHandlers);
newTaskItemInput.addEventListener('keyup', inputHandlers);
main.addEventListener('click', mainHandlers);

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
  if (event.target === filterByUrgencyButton) {
    filterByUrgency(event);
  }
}

// Handle for Inputs
function inputHandlers() {
  if (
    newToDoTitleInput.value == '' ||
    newTaskItemInput.value == '' ||
    tasksArray.length == 0
  ) {
    disableButtons();
  } else {
    enableButtons();
  }
}

// Handle for Main card area
function mainHandlers() {
  event.preventDefault();
  if (event.target.className === 'card__checkbox--img') {
    checkboxCheck(event);
  }
  if (event.target.className === 'card__delete--img') {
    deleteCard(event);
  }
  if (event.target.className === 'card__urgent--img') {
    markCardUrgent(event);
  }
}

// Filter by Urgency
function filterByUrgency() {
  console.log('filter by urgency');
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
  checkboxTextStyleChange(event, cardIndex, eachTaskIndex);
}

function checkboxImgChange(event, cardIndex, eachTaskIndex) {
  checkboxImage = event.target;
  var checkboxTrue = 'images/checkbox-active.svg';
  var checkboxFalse = 'images/checkbox.svg';

  toDosArray[cardIndex].tasks[eachTaskIndex].check
    ? (checkboxImage.src = checkboxTrue)
    : (checkboxImage.src = checkboxFalse);
}

function checkboxTextStyleChange(event, cardIndex, eachTaskIndex) {
  var cardIndex = getCardIndex(event);
  var eachTaskIndex = getTaskIndex(event, cardIndex);
  var eachTask = event.target.closest('.card__tasks');
  if (toDosArray[cardIndex].tasks[eachTaskIndex].check) {
    eachTask.children[1].classList.add('true');
    eachTask.children[1].classList.remove('false');
  } else {
    eachTask.children[1].classList.add('false');
    eachTask.children[1].classList.remove('true');
  }
}

// Urgent or Not
function markCardUrgent(event) {
  var cardIndex = getCardIndex(event);
  var urgentImage = event.target.closest('.card__urgent--img');
  var urgentTrue = 'images/urgent-active.svg';
  var urgentFalse = 'images/urgent.svg';
  var currentCard = toDosArray[cardIndex];
  currentCard.urgent = !currentCard.urgent;
  currentCard.urgent
    ? (urgentImage.src = urgentTrue)
    : (urgentImage.src = urgentFalse);

  currentCard.updateToDo(currentCard.urgent);

  handleCardStyle(event);

  // if (currentCard.urgent) {
  //   event.target.closest('.card').classList.add('card', 'urgent');
  // } else {
  //   event.target.closest('.card').classList.remove('urgent');
  // }
}

function handleCardStyle(event) {
  var cardIndex = getCardIndex(event);
  if (toDosArray[cardIndex].urgent) {
    event.target.closest('.card').classList.add('card', 'urgent');
  } else {
    event.target.closest('.card').classList.remove('urgent');
  }
}

// ! doesn't work right now, Update Class after knowing whether card is urgent or not
// function checkUrgentClass(event) {
//   var cardIndex = getCardIndex(event);
//   var urgentImage = event.target.closest('.card__urgent--img');
//   var urgentTrue = 'images/urgent-active.svg';
//   var urgentFalse = 'images/urgent.svg';
//   var currentCard = toDosArray[cardIndex];
//   if (urgentImage.src == urgentTrue) {
//     console.log(event.target.closest('.card'));
//     event.target.closest('.card').classList.add('card urgent');
//   }
// }

// Delete card/ToDo
function deleteCard(event) {
  var cardIndex = getCardIndex(event);
  var taskListContent = toDosArray[cardIndex].tasks;
  var arrayToCompare = taskListContent.filter(
    allTasksInCard => allTasksInCard.check === true
  );
  console.log(arrayToCompare);
  if (arrayToCompare.length === taskListContent.length) {
    console.log('hitting delete card button');
    // remove that card from DOM then delete from storage also
    // Todo: refactor here into another function.
    event.target.closest('.card').remove();
    toDosArray[cardIndex].deleteFromStorage(cardIndex);
  } else {
    // don't delete the card
    console.log('hitting delete but not all tasks checked');
    var cardFooter = event.target.closest('.card__footer');
    console.log(cardFooter.children[1].classList);
    cardFooter.children[1].classList.remove('hidden');
  }
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
  var urgentClass = object.urgent ? 'card urgent' : 'card';
  var urgentImageSource = object.urgent
    ? 'images/urgent-active.svg'
    : 'images/urgent.svg';
  var newToDo = `<article class="${urgentClass}" data-id=${object.id}>
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
        src=${urgentImageSource}
        alt="Urgent Indicator Icon"
      />
      <p class="card__footer__urgent--text">URGENT</p>
    </div>
    <div class="card__warning hidden"><p>Please complete all tasks first.</p></div>
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
