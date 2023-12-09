export default class Subtask {
    constructor(id, name, isCompleted = false) {
        this.id = id;
        this.name = name;
        this.isCompleted = isCompleted;
    }

    markAsCompleted() {
        this.isCompleted = true;
    }
}