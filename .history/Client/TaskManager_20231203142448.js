saveTaskToLocalStorage(task) {
    if (typeof localStorage !== 'undefined') {
        // Add the taskRenameInput to the task
        task.taskRenameInput = document.querySelector('.task-rename').value;

        // Load the tasks array from localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        // Add the task to the tasks array
        tasks.push(task);

        // Save the tasks array to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

loadTasksFromLocalStorage() {
    const tasks = [];
    if (typeof localStorage !== 'undefined') {
        // Load the tasks array from localStorage
        const tasksData = JSON.parse(localStorage.getItem('tasks')) || [];

        // Create a Task object for each task data and add it to the tasks array
        tasksData.forEach(taskData => {
            const task = new Task(taskData.id, taskData.name, taskData.description, taskData.list, taskData.dueDate, taskData.tags);
            task.taskRenameInput = taskData.taskRenameInput;  // Load the taskRenameInput from localStorage
            tasks.push(task);
        });
    }

    // Set the tasks
    this.tasks = tasks;

    // Load the task name from the last task in the tasks array
    const taskRenameInput = document.querySelector('.task-rename');
    if (taskRenameInput && tasks.length > 0) {
        taskRenameInput.value = tasks[0].taskRenameInput || tasks[0].name;
    }

    // Re-render the tasks
    this.renderTasks();
}