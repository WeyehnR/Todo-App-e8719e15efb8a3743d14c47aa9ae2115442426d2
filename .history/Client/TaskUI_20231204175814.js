addTaskEventListener() {
    const addTaskBtn = this.domHelper.getElementById('add-task-btn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            // Disable the button immediately after it is clicked
            addTaskBtn.disabled = true;

            console.log('add task button clicked');
            const newTaskInput = this.domHelper.getElementById('new-task-input');
            const taskDescription = newTaskInput.value;

            const listSelect = this.domHelper.getElementById('list-select');
            const selectedList = listSelect.options[listSelect.selectedIndex].text;

            const dueDateSelect = this.domHelper.getElementById('due-date-select');
            const selectedDueDate = dueDateSelect.options[dueDateSelect.selectedIndex].text;

            const tagsSelect = this.domHelper.getElementById('tags-select');
            const selectedTags = tagsSelect.options[tagsSelect.selectedIndex].text;

            if (taskDescription) {
                console.log('Adding task:', taskDescription); // log the task being added
                this.taskManager.addTask(taskDescription, '', selectedList, selectedDueDate, selectedTags);
                newTaskInput.value = '';
                this.taskManager.renderTasks();
                this.attachDeleteEventListeners();
            }
            this.updateTaskCount();
            this.checkTaskOverflow();

            // Enable the button again after the task has been added
            addTaskBtn.disabled = false;
        });
    }
}