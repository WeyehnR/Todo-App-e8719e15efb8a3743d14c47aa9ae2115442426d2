
export default class Subtask extends Task {
    constructor(id, name = '', isCompleted = false) {
        super(id, name);
        this.isCompleted = isCompleted;
    }
}