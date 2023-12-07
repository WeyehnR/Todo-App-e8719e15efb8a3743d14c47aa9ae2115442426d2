export default class TagManager {
    constructor() {
        this.tags = JSON.parse(localStorage.getItem('tags')) || [];
    }

    addTag(text, bgColor) {
        this.tags.push({text: text, bgColor: bgColor});
        this.saveTags();
    }

    deleteTag(text) {
        const index = this.tags.findIndex(tag => tag.text === text);
        if (index !== -1) {
            this.tags.splice(index, 1);
            this.saveTags();
        }
    }

    renameTag(oldText, newText) {
        const index = this.tags.findIndex(tag => tag.text === oldText);
        if (index !== -1) {
            this.tags[index].text = newText;
            this.saveTags();
        }
    }

    saveTags() {
        localStorage.setItem('tags', JSON.stringify(this.tags));
    }

    loadTags() {
        return this.tags;
    }
}