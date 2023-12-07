export default class Subtask {
    constructor(id, name) {
        this._id = id;
        this._name = name;
        this._isCompleted = false;
    }

    get id() { return this._id; }
    get name() { return this._name; }
    set name(name) { this

    toggleCompleted() {
        this._isCompleted = !this._isCompleted;
    }
}