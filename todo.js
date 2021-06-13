const formToDos = document.querySelector(".js-textInput"),
  textToDos = formToDos.querySelector("input"),
  pendingToDos = document.querySelector(".js-pending"),
  finishedToDos = document.querySelector(".js-finished");

const TODOS_LS = "pending";
const FINISHED_LS = "finished";

let taskList = [];
let finishedTaskList = [];

function deleteToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  pendingToDos.removeChild(li);
  const cleanToDos = taskList.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  taskList = cleanToDos;
  saveToDos();
}

function deleteFinishedToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  finishedToDos.removeChild(li);
  const cleanToDos = finishedTaskList.filter(function (toDo) {
    return toDo.id !== parseInt(li.id);
  });
  finishedTaskList = cleanToDos;
  movedToDos();
}

function recoverToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const text = li.firstChild.innerText;
  paintToDos(text);

  deleteFinishedToDo(event);
}

function relocateToDo(event) {
  const btn = event.target;
  const li = btn.parentNode;
  const text = li.firstChild.innerText;
  paintFinishedToDos(text);

  deleteToDo(event);
  movedToDos();
}

function saveToDos() {
  localStorage.setItem(TODOS_LS, JSON.stringify(taskList));
}

function movedToDos() {
  localStorage.setItem(FINISHED_LS, JSON.stringify(finishedTaskList));
}

function paintFinishedToDos(text) {
  const li = document.createElement("li");
  const delBtn = document.createElement("delbutton");
  const modifyBtn = document.createElement("modifybutton");
  const span = document.createElement("span");
  const newId = taskList.length + 1;

  delBtn.innerText = "✖";
  delBtn.addEventListener("click", deleteFinishedToDo);

  modifyBtn.innerText = "➰";
  modifyBtn.addEventListener("click", recoverToDo);

  span.innerText = text;

  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(modifyBtn);
  finishedToDos.appendChild(li);

  li.id = newId;

  const toDoObj = {
    text: text,
    id: newId
  };

  finishedTaskList.push(toDoObj);

  movedToDos();
}

function paintToDos(text) {
  const li = document.createElement("li");
  const delBtn = document.createElement("delbutton");
  const checkBtn = document.createElement("checkbutton");
  const span = document.createElement("span");
  const newId = taskList.length + 1;

  delBtn.innerText = "✖";
  delBtn.addEventListener("click", deleteToDo);

  checkBtn.innerText = "✔";
  checkBtn.addEventListener("click", relocateToDo);

  span.innerText = text;

  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(checkBtn);
  pendingToDos.appendChild(li);

  li.id = newId;

  const toDoObj = {
    text: text,
    id: newId
  };

  taskList.push(toDoObj);

  saveToDos();
}

function handleSubmit(event) {
  event.preventDefault();
  const currentValue = textToDos.value;
  paintToDos(currentValue);
  textToDos.value = "";
}

function loadedToDos() {
  const loadedToDos = localStorage.getItem(TODOS_LS);
  if (loadedToDos !== null) {
    const parsedToDos = JSON.parse(loadedToDos);
    parsedToDos.forEach(function (toDo) {
      paintToDos(toDo.text);
    });
  }
}

function loadedfinishedToDos() {
  const loadedFToDos = localStorage.getItem(FINISHED_LS);
  if (loadedFToDos !== null) {
    const parsedFToDos = JSON.parse(loadedFToDos);
    parsedFToDos.forEach(function (toDo) {
      paintFinishedToDos(toDo.text);
    });
  }
}

function init() {
  loadedToDos();
  loadedfinishedToDos();
  formToDos.addEventListener("submit", handleSubmit);
}

init();
