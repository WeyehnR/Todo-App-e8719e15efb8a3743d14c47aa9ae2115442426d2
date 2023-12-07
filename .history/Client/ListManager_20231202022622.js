export dclass ListManager {
    constructor() {
        this.lists = JSON.parse(localStorage.getItem('lists')) || [];
    }

    addList(name, color) {
        this.lists.push({name: name, color: color});
        this.saveLists();
    }

    deleteList(name) {
        const index = this.lists.findIndex(list => list.name === name);
        if (index !== -1) {
            this.lists.splice(index, 1);
            this.saveLists();
        }
    }

    saveLists() {
        localStorage.setItem('lists', JSON.stringify(this.lists));
    }

    loadLists() {
        return this.lists;
    }
}