class Task {
    constructor(id, name = '', description = '', selectedList = '', selectedDueDate = '', ,selectedTags = '', isCompleted = false, subtasks = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.selectedList = selectedList;
        this.selectedDueDate = selectedDueDate;
        this.selectedTags = selectedTags;
        this.isCompleted = isCompleted;
        this.subtasks = subtasks;
    }

}

export default Task;