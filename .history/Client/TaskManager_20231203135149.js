renderTask(task, taskRenameInput, todoList) {
    const taskElement = document.createElement('li');
    taskElement.setAttribute('data-task', task.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `task-${task.id}`;

    const label = document.createElement('label');
    label.htmlFor = `task-${task.id}`;
    // Set the task name to the taskRenameInput value of the task object
    label.textContent = task.taskRenameInput || task.name;

    const button = document.createElement('button');
    button.classList.add('arrow-btn');

    // Add event listener to the arrow button
    button.addEventListener('click', () => {
        // Get the task name from the label and set it as the value of the task-rename input
        const taskName = button.parentElement.querySelector('label').textContent;
        taskRenameInput.value = taskName;

        // Save the task name to localStorage
        localStorage.setItem('taskRenameInput', taskName);

        // Set the values of the other input fields
        document.querySelector('.description-box').value = task.description;
        document.querySelector('#list-select').value = task.list;
        document.querySelector('#due-date-select').value = task.dueDate;
        document.querySelector('#tags-select').value = task.tags;
    });

    label.appendChild(button);  // Append the button to the label
    taskElement.appendChild(checkbox);
    taskElement.appendChild(label);  // Append the label (which now contains the button) to the taskElement

    todoList.appendChild(taskElement);

    return taskElement;
}