var toDosArray = [];
var tasksArray = [];

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
var clearAllButton = document.querySelector('.nav__button--clear');
var filterByUrgencyButton = document.querySelector('.nav__button--filter');
var emptyDataSet = document.querySelector('.empty-dataset');
var emptyUrgentDataSet = document.querySelector('.empty-urgent-dataset');
var main = document.querySelector('.main');
var searchBox = document.querySelector('.header__form__input--search');

navigationAside.addEventListener('click', navHandlers);
newToDoTitleInput.addEventListener('keyup', inputHandlers);
newTaskItemInput.addEventListener('keyup', inputHandlers);
main.addEventListener('click', mainHandlers);
searchBox.addEventListener('keyup', searchFilter);

reInstantiateAll();
disableButtons();
promptToCreateToDo();

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

function deleteTasksToBeAdded(event) {
  var task = event.target.closest('.temp__div');
  var taskID = task.getAttribute('data-id');
  getTaskIndex = getTasksToBeAddedIndex(taskID);
  task.remove();
  tasksArray.splice(getTaskIndex, 1);
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
  if (event.target.className === 'temp__delete__img') {
    deleteTasksToBeAdded(event);
  }
  if (event.target === clearAllButton) {
    clearInput(event);
  }
  if (event.target === filterByUrgencyButton) {
    filterByUrgency(event);
  }
  promptToCreateToDo();
  promptToMarkToDoUrgent();
  addTaskItemButtonStyle();
}

function inputHandlers() {
  if (newToDoTitleInput.value == '' || tasksArray.length == 0) {
    disableButtons();
  } else {
    enableButtons();
  }
  if (newToDoTitleInput.value != '' || newTaskItemInput != '') {
    clearAllButton.disabled = false;
  }
  addTaskItemButtonStyle();
  promptToCreateToDo();
}

function addTaskItemButtonStyle() {
  if (newTaskItemInput.value != '' && newToDoTitleInput.value != '') {
    addTaskItemButton.style.backgroundColor = '#1f1f3d';
  } else if (newTaskItemInput.value == '' || newToDoTitleInput.value == '') {
    addTaskItemButton.style.backgroundColor = '#778ca3';
  }
}

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
  promptToCreateToDo();
}

function promptToCreateToDo() {
  if (toDosArray.length > 0) {
    emptyDataSet.classList.add('hidden');
  } else {
    emptyDataSet.classList.remove('hidden');
  }
}

function checkboxCheck(event) {
  var cardIndex = getCardIndex(event);
  var eachTaskIndex = getTaskIndex(event, cardIndex);
  var checkbox = toDosArray[cardIndex].tasks[eachTaskIndex].check;
  checkbox = !checkbox;
  toDosArray[cardIndex].updateTask(eachTaskIndex, checkbox);
  checkboxImgChange(event, cardIndex, eachTaskIndex);
  checkboxTextStyleChange(event, cardIndex, eachTaskIndex);
  deleteIconStyleChange(event, cardIndex);
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
}

function handleCardStyle(event) {
  var card = event.target.closest('.card');
  card.classList.toggle('urgent');
}

function deleteCard(event) {
  var cardIndex = getCardIndex(event);
  var taskListContent = toDosArray[cardIndex].tasks;
  var arrayToCompare = taskListContent.filter(
    allTasksInCard => allTasksInCard.check === true
  );
  if (arrayToCompare.length === taskListContent.length) {
    event.target.closest('.card').remove();
    toDosArray[cardIndex].deleteFromStorage(cardIndex);
  } else {
    deleteWarningMessage(event);
  }
}

function deleteWarningMessage(event) {
  var cardFooter = event.target.closest('.card__footer');
  cardFooter.children[1].classList.remove('hidden-card-warning');
  setTimeout(function() {
    cardFooter.children[1].classList.add('hidden-card-warning');
  }, 3000);
}

function deleteIconStyleChange(event, cardIndex) {
  var cardIndex = getCardIndex(event);
  var tasksInCard = toDosArray[cardIndex].tasks;
  var deleteIconParent = event.target.closest('.card');
  var deleteIcon = deleteIconParent.children[2].children[2].children[0];
  var deleteIconText = deleteIconParent.children[2].children[2].children[1];
  var tasksCompleted = tasksInCard.filter(
    allTasksInCard => allTasksInCard.check === true
  );
  if (tasksCompleted.length === tasksInCard.length) {
    deleteIcon.src = 'images/delete-active.svg';
    deleteIconText.style.color = '#ef4a23';
  } else {
    deleteIcon.src = 'images/delete.svg';
    deleteIconText.style.color = '';
  }
}

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

function reToDo(oldToDoObject) {
  var toDo = new ToDoList(oldToDoObject);
  reTasks(toDo);
  appendToDo(toDo);
  toDosArray.push(toDo);
}

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
  addTaskItemButtonStyle();
}

function reTasks(toDo) {
  for (var i = 0; i < toDo.tasks.length; i++) {
    toDo.tasks[i] = new Task(toDo.tasks[i]);
  }
}

function appendTask(object) {
  if (newToDoTitleInput.value !== '') {
    var newTask = `<div class="temp__div" data-id="${object.id}">
  <img class="temp__delete__img" src="images/delete-task.svg" alt="" />
  <p class="temp__p">${object.taskContent}</p>
</div>`;
    tasksToBeAdded.insertAdjacentHTML('beforeend', newTask);
  }
  addTaskItemButtonStyle();
}

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
    <div class="card__warning hidden-card-warning"><p>Please complete all tasks🥺</p></div>
    <div class="card__delete">
      <img class="card__delete--img" src=${checkDeleteImageOnLoad(
        object
      )} alt="" />
      <p class="card__footer__delete--text">DELETE</p>
    </div>
  </footer>
</article>`;
  main.insertAdjacentHTML('afterbegin', newToDo);
}

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

function checkDeleteImageOnLoad(toDo) {
  var tasksCompleted = toDo.tasks.filter(
    allTasksInCard => allTasksInCard.check === true
  );
  if (tasksCompleted.length == toDo.tasks.length) {
    return 'images/delete-active.svg';
  } else {
    return 'images/delete.svg';
  }
}

function searchFilter() {
  var search = searchBox.value.toLowerCase();
  if (
    filterByUrgencyButton.classList.contains('nav__button--filter--filterON')
  ) {
    var results = toDosArray.filter(
      titles => titles.title.toLowerCase().includes(search) && titles.urgent
    );
    main.innerHTML = '';
    results.map(titles => appendToDo(titles));
  } else {
    var results = toDosArray.filter(titles =>
      titles.title.toLowerCase().includes(search)
    );
    main.innerHTML = '';
    results.map(titles => appendToDo(titles));
  }
}

function filterByUrgency(event) {
  var urgencyFilterClass = 'nav__button--filter--filterON';
  event.target.classList.toggle(urgencyFilterClass);
  if (event.target.classList.contains(urgencyFilterClass)) {
    var urgencyResults = toDosArray.filter(
      urgentOrNotCards => urgentOrNotCards.urgent == true
    );
    main.innerHTML = '';
    urgencyResults.map(urgencyResults => appendToDo(urgencyResults));
  } else {
    main.innerHTML = '';
    toDosArray.map(allToDos => appendToDo(allToDos));
  }
  searchFilter();
}

function urgentArrayFinder() {
  var urgentArray = toDosArray.filter(
    toDosObject => toDosObject.urgent == true
  );
  return urgentArray;
}

function promptToMarkToDoUrgent() {
  var array = urgentArrayFinder();
  if (
    filterByUrgencyButton.classList.contains('nav__button--filter--filterON') &&
    array.length == 0
  ) {
    var urgentPrompt =
      '<div class="empty-urgent-dataset"><p><img class="prompt-urgent-img" src="images/prompt-urgent.svg" alt="Priority/Urgent Icon" /></p><p>🙊 Pro Tip: each To Do List can be marked as urgent simply by tapping the URGENT ⚡ icon!</p></div>';
    main.insertAdjacentHTML('afterbegin', urgentPrompt);
  }
}
