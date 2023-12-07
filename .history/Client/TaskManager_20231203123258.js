saveTaskToLocalStorage(task) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`task-${task.id}`, JSON.stringify(task));
    }
}