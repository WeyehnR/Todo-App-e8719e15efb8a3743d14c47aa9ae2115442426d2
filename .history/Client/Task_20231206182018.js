class Task {
    constructor(id, name = '', description = '', selectedList = '', selectedDueDate = '', selectedTags = '', isCompleted = false, subtasks = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.selectedList = selectedList;
        this.selectedDueDate = selectedDueDate;
        this.selectedTags = selectedTags;
        this.isCompleted = isCompleted;
        this.subtasks = subtasks;
    }

    // Getters
    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get selectedList() {
        return this._selectedList;
    }

    get selectedDueDate() {
        return this._selectedDueDate;
    }

    get selectedTags() {
        return this._selectedTags;
    }

    get isCompleted() {
        return this._isCompleted;
    }

    get subtasks() {
        return this._subtasks;
    }

    // Setters
    set id(value) {
        this._id = value;
    }

    set name(value) {
        this._name = value;
    }

    set description(value) {
        this._description = value;
    }

    set selectedList(value) {
        this._selectedList = value;
    }

    set selectedDueDate(value) {
        this._selectedDueDate = value;
    }

    set selectedTags(value) {
        this._selectedTags = value;
    }

    set isCompleted(value) {
        this._isCompleted = value;
    }

    set subtasks(value) {
        this._subtasks = value;
    }

    toggleComplete() {
        this.isCompleted = !this.isCompleted;
    }
}

export default Task;