// TaskSender.js
export default class TaskSender {
    sendTaskToServer(task) {
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })
        .then(response => response.json())
        .then(task => console.log('Task added:', task))
        .catch(error => console.error(error));
    }

    updateTaskOnServer(task) {
        fetch(`/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })
        .then(response => response.json())
        .then(data => console.log('Task updated:', data))
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    // In your TaskManager class
loadTasksFromServer() {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                // Create a new task element
                const taskElement = document.createElement('li');
                taskElement.setAttribute('data-task', task.id);

                // Create the label for the task
                const taskLabel = document.createElement('label');
                taskLabel.setAttribute('for', `task-${task.id}`);
                taskLabel.textContent = task.name;

                // Add the label to the task element
                taskElement.appendChild(taskLabel);

                // Add the task element to the task list
                const taskList = document.querySelector('.todo-list');
                taskList.appendChild(taskElement);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
    
}