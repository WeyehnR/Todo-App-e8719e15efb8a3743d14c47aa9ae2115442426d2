// export default class UI {
//     constructor(taskManager) {
//         this.taskManager = taskManager;
//         this.taskCount = localStorage.getItem('taskCount') || 0;
//         this.hamburger = this.querySelector(".hamburger");
//         this.leftMenuCard = this.querySelector(".left-menu-card");
//         this.rightMenuCard = this.getElementById("right-menu-card");
//         this.todoContainer = this.querySelector(".todo-container");
//         this.rightArrowButtons = this.querySelectorAll(".arrow-btn");
        
//     }

//     getElementById(element) {
//         return document.getElementById(element);
//     }

//     querySelector(element) {
//         return document.querySelector(element);
//     }

//     querySelectorAll(element) {
//         return document.querySelectorAll(element);
//     }

//     getCurrentTaskId() {
//         const activeTaskElement = this.querySelector('.todo-list li.active');
//         if (!activeTaskElement) {
//             return null;
//         }
//         const taskId = activeTaskElement.getAttribute('data-task');
//         console.log('Task id:', taskId);
//         return taskId;
//     }

//     updateTaskCounter() {
//         const taskCounter = this.getElementById('today-task-counter');
//         taskCounter.textContent = this.taskManager.tasks.length;
//         localStorage.setItem('taskCount', this.taskManager.tasks.length);
//         console.log('Task counter:', taskCounter);
//     }

//     checkTaskOverflow() {
//         const todoList = this.querySelector('.todo-list');
//         if (this.taskManager.tasks.length > 5) {
//             todoList.classList.add('overflow');
//         } else {
//             todoList.classList.remove('overflow');
//         }
//     }

//     addTaskEventListener() {
//         this.getElementById('add-task-btn').addEventListener('click', () => {
//             const newTaskInput = this.getElementById('new-task-input');
//             const taskDescription = newTaskInput.value;
//             if (taskDescription) {
//                 this.taskManager.addTask(taskDescription);
//                 newTaskInput.value = '';
//                 this.querySelector('.todo-list').innerHTML = '';
//                 this.taskManager.renderTasks();
//                 this.attachDeleteEventListeners();
//             }
//             this.updateTaskCounter();
//             this.checkTaskOverflow();
//         });
//     }

//     addTaskClickEventListener() {
//         this.querySelectorAll('.todo-list li').forEach(task => {
//             task.addEventListener('click', () => {
//                 let taskName = task.querySelector('label').innerText;
//                 let taskRenameInput = this.querySelector('.task-rename');
//                 taskRenameInput.value = taskName;
//                 const taskId = task.getAttribute('data-task');
//                 this.loadSubtasks(taskId);
//             });
//             const checkbox = task.querySelector('input[type="checkbox"]');
//             const label = task.querySelector('label');
//             checkbox.addEventListener('change', () => {
//                 if (checkbox.checked) {
//                     label.classList.add('task-completed');
//                 } else {
//                     label.classList.remove('task-completed');
//                 }
//             });
//         });
//     }

//     attachDeleteEventListeners() {
//         this.querySelectorAll('.delete-task-button').forEach(button => {
//             button.addEventListener('click', () => {
//                 const taskId = this.getCurrentTaskId();
//                 console.log(taskId);
//                 this.taskManager.deleteTask(taskId);
//                 this.querySelector('.todo-list').innerHTML = '';
//                 this.taskManager.renderTasks();
//                 this.updateTaskCounter();
//             });
//         });
//         this.checkTaskOverflow();
//     }

//     updateDayOfMonth() {
//         const currentDate = new Date();
//         const dayOfMonth = currentDate.getDate();
//         const dayOfMonthElement = this.getElementById("dayOfMonth");
//         dayOfMonthElement.textContent = dayOfMonth;
//     }

//     toggleMenu() {
//         this.hamburger.addEventListener("click", () => {
//             this.leftMenuCard.classList.toggle("expanded");
//             this.todoContainer.classList.toggle("left-expanded");
//             this.hamburger.classList.toggle("left-expanded");
//         });
//     }

//     // Save subtask
//     saveSubtask(taskId, subtask) {
//         let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//         let task = tasks.find(task => task.id === taskId);
//         if (task) {
//             if (!task.subtasks) {
//                 task.subtasks = [];
//             }
//             task.subtasks.push(subtask);
//             localStorage.setItem('tasks', JSON.stringify(tasks));
//         }
//     }

//     // Load subtasks
//     loadSubtasks(taskId) {
//         let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//         let task = tasks.find(task => task.id === taskId);
//         if (task && task.subtasks) {
//             const subtaskList = this.getElementById('subtask-list');
//             subtaskList.innerHTML = ''; // Clear the list
//             task.subtasks.forEach((subtask, index) => { // Add index here
//                 const newSubtask = document.createElement('li');

//                 const checkbox = document.createElement('input');
//                 checkbox.type = 'checkbox';
//                 newSubtask.appendChild(checkbox);

//                 const label = document.createElement('label');
//                 label.textContent = subtask;
//                 newSubtask.appendChild(label);

//                 const deleteButton = document.createElement('button');
//                 deleteButton.textContent = 'X';
//                 deleteButton.style.float = 'right';
//                 deleteButton.addEventListener('click', () => {
//                     newSubtask.remove();
//                     task.subtasks.splice(index, 1);
//                     localStorage.setItem('tasks', JSON.stringify(tasks));
//                 });
//                 newSubtask.appendChild(deleteButton);

//                 subtaskList.appendChild(newSubtask);
//             });
//         }
//     }

//     // Add subtask event listener
//     addSubtaskEventListener() {
//         this.getElementById('add-subtask-btn').addEventListener('click', () => {
//             const subtaskInput = this.getElementById('new-subtask-input');
//             const subtaskList = this.getElementById('subtask-list');

//             if (subtaskInput.value) {
//                 const newSubtask = document.createElement('li');

//                 const checkbox = document.createElement('input');
//                 checkbox.type = 'checkbox';
//                 newSubtask.appendChild(checkbox);

//                 const label = document.createElement('label');
//                 label.textContent = subtaskInput.value;
//                 newSubtask.appendChild(label);

//                 const deleteButton = document.createElement('button');
//                 deleteButton.textContent = 'X';
//                 deleteButton.style.float = 'right';
//                 deleteButton.addEventListener('click', () => {
//                     newSubtask.remove();
//                     let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
//                     let task = tasks.find(task => task.id === this.getCurrentTaskId());
//                     if (task) {
//                         const subtaskIndex = task.subtasks.indexOf(label.textContent);
//                         if (subtaskIndex > -1) {
//                             task.subtasks.splice(subtaskIndex, 1);
//                         }
//                         localStorage.setItem('tasks', JSON.stringify(tasks));
//                     }
//                 });
//                 newSubtask.appendChild(deleteButton); // Add this line

//                 subtaskList.appendChild(newSubtask);
//                 const taskId = this.getCurrentTaskId();
//                 if (taskId) {
//                     this.saveSubtask(taskId, label.textContent);
//                 }
//                 subtaskInput.value = '';

//                 if (subtaskList.children.length > 4) {
//                     subtaskList.style.height = '180px'; // Adjust this value as needed
//                     subtaskList.style.overflowY = 'scroll';
//                     // subtaskList.style.direction = 'rtl'; // Add this line

//                      // Wrap the contents of each subtask in a div and set the direction to 'ltr'
//                     Array.from(subtaskList.children).forEach(child => {
//                         const wrapper = document.createElement('div');
//                         wrapper.style.direction = 'ltr';

//                         while (child.firstChild) {
//                             wrapper.appendChild(child.firstChild);
//                         }

//                         child.appendChild(wrapper);
//                     });
//                 }
//             }
//         });
//     }

//     // Load subtasks for current task
//     loadSubtasksForCurrentTask() {
//         const taskId = this.getCurrentTaskId();
//         if (taskId) {
//             this.loadSubtasks(taskId);
//         }
//     }
   

//     toggleNewListForm() {
//         this.querySelector('.add-list').addEventListener('click', () => {
//             const newListForm = this.getElementById('new-list-form');
//             newListForm.style.display = newListForm.style.display === 'block' ? 'none' : 'block';
//         });
//     }

//     addNewList() {
//         this.getElementById('new-list-name').addEventListener('keypress', (event) => {
//             if (event.key === 'Enter') {
//                 const newListName = event.target.value;
//                 const dynamicColor = this.getElementById('dynamic-color-card').style.backgroundColor;
//                 if (newListName) {
//                     // Update the CSS variable with the new color
//                     document.documentElement.style.setProperty('--dynamic-color-card', dynamicColor);

//                     const newListElement = this.createListElement(newListName, dynamicColor);
//                     const addListButton = this.querySelector('.add-list');
//                     addListButton.parentNode.insertBefore(newListElement, addListButton);
//                     event.target.value = '';
//                     this.getElementById('new-list-form').style.display = 'none';

//                     // Store the new list name and color in localStorage
//                     let lists = JSON.parse(localStorage.getItem('lists')) || [];
//                     lists.push({ name: newListName, color: dynamicColor });
//                     localStorage.setItem('lists', JSON.stringify(lists));

//                     // Update the dropdown menu
//                     this.populateDropdownMenus();
//                 }
//             }
//         });
//     }

//     loadLists() {
//         let lists = JSON.parse(localStorage.getItem('lists')) || [];
//         lists.forEach(list => {
//             const newListElement = this.createListElement(list.name, list.color);
//             const addListButton = this.querySelector('.add-list');
//             addListButton.parentNode.insertBefore(newListElement, addListButton);
//         });
//     }
// }



