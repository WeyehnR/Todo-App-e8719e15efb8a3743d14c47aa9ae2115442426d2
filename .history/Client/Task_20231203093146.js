class Task {
    constructor(id, name, description, list = [], dueDate = [], tags = [], isCompleted = false, subtasks = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.list = list;
        this.dueDate = dueDate;
        this.tags = tags;
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

    get list() {
        return this._list;
    }

    get dueDate() {
        return this._dueDate;
    }

    get tags() {
        return this._tags;
    }

    get isCompleted() {
        return this._isCompleted;
    }

    get subtasks() {
        return this._subtasks;
    }

    // Setters
    set name(value) {
        this._name = value;
    }

    set description(value) {
        this._description = value;
    }

    set list(value) {
        this._list = value;
    }

    set dueDate(value) {
        this._dueDate = value;
    }

    set tags(value) {
        this._tags = value;
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

    addSubtask(subtask) {
        this.subtasks.push(subtask);
    }

    removeSubtask(subtaskId) {
        const initialLength = this.subtasks.length;
        this.subtasks = this.subtasks.filter(subtask => subtask.id !== subtaskId);
        return initialLength !== this.subtasks.length;
    }
}

export default Task;