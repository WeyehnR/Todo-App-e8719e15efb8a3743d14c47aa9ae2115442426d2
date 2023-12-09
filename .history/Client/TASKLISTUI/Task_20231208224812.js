class Task {
    constructor(id, name = '', description = 'Task Description', selectedList = 'Select List', selectedDueDate = 'Select Due Date', selectedTime = 'Select Time',selectedTags = 'Select Tag', isCompleted = false, subtasks = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.selectedList = selectedList;
        this.selectedDueDate = selectedDueDate;
        this.selectedTime = selectedTime;
        this.selectedTags = selectedTags;
        this.isCompleted = isCompleted;
        this.subtasks = subtasks;
    }

    updateDescription(newDescription) {
        this.description = newDescription;
    }

    updateSelectedList(newSelectedList) {
        this.selectedList = newSelectedList;
    }

    

}

export default Task;