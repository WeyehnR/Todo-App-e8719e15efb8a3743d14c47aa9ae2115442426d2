renderTasks() {
    const todoList = document.querySelector('.todo-list');
    todoList.innerHTML = '';
    this.tasks.forEach((task) => {
        const taskElement = this.renderTask(task);
        todoList.appendChild(taskElement);

        const arrowBtn = taskElement.querySelector('.arrow-btn');
        // Remove any existing event listeners
        const oldArrowBtn = arrowBtn;
        const newArrowBtn = oldArrowBtn.cloneNode(true);
        oldArrowBtn.parentNode.replaceChild(newArrowBtn, oldArrowBtn);

        newArrowBtn.addEventListener('click', () => {
            const taskRenameInput = document.querySelector('.task-rename');
            taskRenameInput.value = task._name; // set the value of the rename field to the task name
            this.updateUIWithTaskDetails(task);
            localStorage.setItem('selectedTaskId', task.id); // store the ID of the selected task
        });
    });
    if (this.tasks.length > 0 && this.ui && typeof this.ui.expandRightMenu === 'function') {
        todoList.addEventListener('click', this.ui.expandRightMenu.bind(this.ui));
    }

    // After all tasks have been rendered, update the task-rename input field with the name of the currently selected task
    const taskRenameInput = document.querySelector('.task-rename');
    const selectedTaskId = localStorage.getItem('selectedTaskId'); // load the ID of the selected task from local storage
    const selectedTask = this.tasks.find(task => String(task._id) === selectedTaskId); // convert task._id to a string before comparing
    if (selectedTask) {
        taskRenameInput.value = selectedTask._name; // update the rename field with the name of the selected task
    } else {
        taskRenameInput.value = ''; // clear the rename field if no task is selected
    }
}