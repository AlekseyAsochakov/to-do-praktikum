const defaultTasks = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");
const taskTemplate = document.querySelector("#to-do__item-template");
const taskItemTemplate = taskTemplate.content.querySelector(".to-do__item");
const storageKey = "tasks";

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey));
    if (
      Array.isArray(savedTasks) &&
      savedTasks.every((taskText) => typeof taskText === "string")
    ) {
      return savedTasks;
    }
  } catch {
    return defaultTasks;
  }
  return defaultTasks;
}

function createItem(taskText) {
  const clone = taskItemTemplate.cloneNode(true);
  const textElement = clone.querySelector(".to-do__item-text");
  const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
  const editButton = clone.querySelector(".to-do__item-button_type_edit");
  let previousText;

  textElement.textContent = taskText;

  deleteButton.addEventListener("click", () => {
    clone.remove();
    saveTasks(getTasksFromDOM());
  });

  duplicateButton.addEventListener("click", () => {
    const duplicate = createItem(textElement.textContent);
    listElement.prepend(duplicate);
    saveTasks(getTasksFromDOM());
  });

  editButton.addEventListener("click", () => {
    previousText = textElement.textContent;
    textElement.contentEditable = "true";
    textElement.focus();
  });

  textElement.addEventListener("blur", () => {
    textElement.contentEditable = "false";
    textElement.textContent = textElement.textContent.trim() || previousText;
    saveTasks(getTasksFromDOM());
  });

  textElement.addEventListener("keydown", (event) => {
    if (event.isComposing) return;

    if (event.key === "Enter" || event.key === "Escape") {
      event.preventDefault();
      if (event.key === "Escape") textElement.textContent = previousText;
      editButton.focus();
    }
  });

  return clone;
}

function getTasksFromDOM() {
  const taskTextElements = listElement.querySelectorAll(".to-do__item-text");
  const tasks = [];
  taskTextElements.forEach((textElement) => {
    tasks.push(textElement.textContent);
  });
  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  const taskText = inputElement.value.trim();
  if (!taskText) {
    inputElement.focus();
    return;
  }

  listElement.prepend(createItem(taskText));
  saveTasks(getTasksFromDOM());
  inputElement.value = "";
  inputElement.focus();
});

const tasks = loadTasks();
tasks.forEach((taskText) => listElement.append(createItem(taskText)));

