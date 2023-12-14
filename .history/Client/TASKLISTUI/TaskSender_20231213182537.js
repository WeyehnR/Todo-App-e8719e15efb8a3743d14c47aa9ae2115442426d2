// TaskSender.js
export default class TaskSender {

    constructor() {
        this.taskUpdated = false;
    }

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
        if (this.taskUpdated) {
            return;
        }

        fetch(`/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Task updated:', data);
            this.taskUpdated = true;
        })
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
                    this.addTask(task);
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    getTaskFromServer(taskId) {
        return fetch(`/tasks/${taskId}`)
            .then(response => {
                if (!response.ok) {
                    console.log(`HTTP error! status: ${response.status}`);
                    return null;
                }
                return response.json();
            });
    }
    
}