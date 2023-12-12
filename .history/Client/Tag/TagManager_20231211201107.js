import DOMHelper from "../DOMHelper/DOMHelper.js";

export default class TagManager {
    constructor(ui) {
        this.tags = JSON.parse(localStorage.getItem('tags')) || [];
        this.domHelper = domHelper;
        this.ui = ui;
        this.tagCounter = this.tags.length + 1; // Initialize tagCounter here
        this.isProgrammaticTagChange = false; // Add this line
    }

    init() {
        this.loadTags();
        this.addTag();
        this.deleteTag();
        this.renameTag();
        this.updateTagDropdownMenu();
        this.updateTaskTags();
    }

    
    // Add tag
    addTag() {
        this.domHelper.getElementById('add-tag-button').addEventListener('click', () => {
            // Generate the tag text based on the counter
            let tagText = 'Tag ' + this.tagCounter++;

            let tags = JSON.parse(localStorage.getItem('tags')) || [];
            tags.push({text: tagText, bgColor: this.getRandomColor()});
            localStorage.setItem('tags', JSON.stringify(tags));

            // Create a new tag element
            let tagElement = this.createTagElement(tagText, this.getRandomColor());

            // Append the new tag to the ul element
            let tagsMenu = this.domHelper.querySelector('.Tags-menu-selection');
            tagsMenu.appendChild(tagElement);

            // Update the dropdown menus
            this.updateTagDropdownMenu();
        });
    }
    getContrast(rgbColor) {
        const [r, g, b] = rgbColor.match(/\d+/g).map(Number);
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? 'black' : 'white';
    }

    getRandomColor() {
        let r, g, b;
        let contrast;
        do {
            r = Math.floor(Math.random() * 128) + 128;
            g = Math.floor(Math.random() * 128) + 128;
            b = Math.floor(Math.random() * 128) + 128;
            contrast = this.getContrast(`rgb(${r}, ${g}, ${b})`);
        } while (contrast === 'black'); // repeat until a light enough color is found
        return `rgb(${r}, ${g}, ${b})`;
    }

    createTagElement(text, bgColor) {
        const newTag = this.createTagListItem(bgColor);
        const tagText = this.createTagTextElement(text);
        newTag.appendChild(tagText);

        const deleteButton = this.createDeleteButton(bgColor);
        newTag.appendChild(deleteButton);

        this.addDeleteButtonEventListener(newTag, deleteButton);
        this.addTagTextEventListener(tagText);

        return newTag;
    }

    createTagListItem(bgColor) {
        const newTag = document.createElement('li');
        newTag.className = 'menu-item tag';
        newTag.style.backgroundColor = bgColor;
        newTag.style.color = this.getContrast(bgColor);
        return newTag;
    }

    createTagTextElement(text) {
        const tagText = document.createElement('span');
        tagText.className = 'tag-text';
        tagText.textContent = text;
        return tagText;
    }

    createDeleteButton(bgColor) {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-tag';
        deleteButton.style.backgroundColor = bgColor;
        deleteButton.textContent = 'x';
        return deleteButton;
    }

    addDeleteButtonEventListener(newTag, deleteButton) {
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            newTag.remove();
            this.saveTags();
            this.updateTagDropdownMenu();
        });
    }

    addTagTextEventListener(tagText) {
        tagText.addEventListener('click', (e) => {
            e.stopPropagation();
            const input = this.createInputForTagText(e);
            this.addInputEventListeners(input, e);
        });
    }

    createInputForTagText(e) {
        const input = document.createElement('input');
        input.value = e.target.textContent;
        e.target.textContent = '';
        e.target.appendChild(input);
        input.focus();
        return input;
    }

    addInputEventListeners(input, e) {
        input.addEventListener('blur', () => {
            e.target.textContent = input.value;
            this.saveTags();
            this.updateTagDropdownMenu();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
                this.updateTagDropdownMenu();
            }
        });
    }


    // Delete tag
    deleteTag(tagText) {
        let tags = JSON.parse(localStorage.getItem('tags')) || [];
        const index = tags.findIndex(tag => tag.text === tagText);
        if (index !== -1) {
            tags.splice(index, 1);
            localStorage.setItem('tags', JSON.stringify(tags));
        }

        // Update the dropdown menus
        // this.populateDropdownMenus();
    }
    createInputField(oldTagName) {
        const input = document.createElement('input');
        input.value = oldTagName;
        return input;
    }

    replaceTagWithInput(tagText, input) {
        tagText.textContent = '';
        tagText.appendChild(input);
        input.focus();
    }

    updateTagName(tagText, input, oldTagName) {
        const newTagName = input.value;
        tagText.textContent = newTagName;

        let tags = JSON.parse(localStorage.getItem('tags')) || [];
        const index = tags.findIndex(tag => tag.text === oldTagName);
        if (index !== -1) {
            tags[index].text = newTagName;
            localStorage.setItem('tags', JSON.stringify(tags));
        }

    }

    switchTask(taskId) {
        // ...

        this.isProgrammaticTagChange = true;
        // Change the selected option in the dropdown
        this.isProgrammaticTagChange = false;

        // ...
    }

    // Add this method in your TagManager class
    updateTaskTags() {
        this.domHelper.getElementById('tags-select').addEventListener('change', (event) => {
            // Get the selected tag
            let selectedTag = event.target.value;

            // Get the task id (you need to implement getTaskId() method to get the current task id)
            let taskId = this.getTaskId();

            // Get the tasks from local storage
            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

            // Find the task with the matching id and update its _selectedTags property
            let task = tasks.find(task => task._id === taskId);
            if (task) {
                task._selectedTags = selectedTag;
            }

            // Save the updated tasks back to local storage
            localStorage.setItem('tasks', JSON.stringify(tasks));
        });
    }

    getTaskId() {
        // Get the task id from the DOM
        let taskId = this.domHelper.querySelector('.todo-list li.active').getAttribute('data-task');

        // Return the task id
        return taskId;
    }

    renameTag() {
        const tagTexts = this.domHelper.querySelectorAll('.tag-text');

        tagTexts.forEach(tagText => {
            tagText.addEventListener('click', () => {
                const oldTagName = tagText.textContent;
                const input = this.createInputField(oldTagName);

                this.replaceTagWithInput(tagText, input);

                input.addEventListener('blur', () => this.updateTagName(tagText, input, oldTagName));
                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        this.updateTagName(tagText, input, oldTagName);
                    }
                });
            });
        });
    }

    

    saveTags() {
        const tags = Array.from(this.domHelper.querySelectorAll('.tag')).map(tag => ({
            text: tag.querySelector('.tag-text').textContent,
            bgColor: tag.style.backgroundColor
        }));
        localStorage.setItem('tags', JSON.stringify(tags));
    }


    loadTags() {
        const tags = JSON.parse(localStorage.getItem('tags') || '[]');
        const ul = this.domHelper.querySelector('.Tags-menu-selection');
        tags.forEach(tag => {
            const newTag = this.createTagElement(tag.text, tag.bgColor);
            ul.appendChild(newTag);
        });
    }

    updateTagDropdownMenu() {
        // Get the updated tags from local storage
        let updatedTags = JSON.parse(localStorage.getItem('tags')) || [];

        // Get the tag dropdown menu element
        const dropdown = this.domHelper.getElementById('tags-select');

        // Clear the tag dropdown menu
        while (dropdown.options.length > 1) {
            dropdown.remove(1);
        }

        // Add the updated tags to the tag dropdown menu
        updatedTags.forEach(tag => {
            let option = document.createElement('option');
            option.text = tag.text;
            option.value = tag.text;
            dropdown.add(option);
        });
    }

}