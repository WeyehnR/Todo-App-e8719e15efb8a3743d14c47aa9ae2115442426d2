import DOMHelper from './DOMHelper.js';

export default class TagManager {
    constructor(domHelper, ui) {
        this.tags = JSON.parse(localStorage.getItem('tags')) || [];
        this.domHelper = domHelper;
        this.ui = ui;
    }

    init() {
        this.loadTags();
        this.addNewTag();
        this.addTag();
        this.deleteTag();
        this.renameTag();
        this.updateTagDropdownMenu();
    }

    addNewTag() {
        this.domHelper.querySelector('.add-tag').addEventListener('click', () => {
            const newTag = this.createTagElement(`Tag ${this.domHelper.querySelectorAll('.tag').length + 1}`, this.getRandomColor());
            const ul = this.domHelper.querySelector('.Tags-menu-selection');
            ul.appendChild(newTag);
            this.saveTags();
            this.updateTagDropdownMenu();
        });

        // In the addNewTag method
        this.domHelper.getElementById('tags-select').addEventListener('change', (event) => {
            if (event.target.value) {
                const newTag = this.createTagElement(event.target.value, this.getRandomColor());
                const ul = this.domHelper.querySelector('.Tags-menu-selection');
                ul.appendChild(newTag);
                this.saveTags();
            }
        });
    }

    // Add tag
    addTag() {
        this.domHelper.getElementById('add-tag-button').addEventListener('click', () => {
            // // Assume you get tagText and tagColor from input fields
            // let tagText = this.domHelper.getElementById('tag-text-input').value;
            // let tagColor = this.domHelper.getElementById('tag-color-input').value;

            let tags = JSON.parse(localStorage.getItem('tags')) || [];
            tags.push({text: tagText, bgColor: tagColor});
            localStorage.setItem('tags', JSON.stringify(tags));

            // Create the delete button
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-tag');
            deleteButton.textContent = 'x';
            deleteButton.style.backgroundColor = 'rgb(151, 176, 187)';

            // Add the click event listener to the delete button
            deleteButton.addEventListener('click', () => {
                this.deleteTag(tagText);
            });

            // Append the delete button to the tag
            tags.appendChild(deleteButton);

            // Update the dropdown menus
            // this.populateDropdownMenus();
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

        // Update the dropdown menus
        // this.populateDropdownMenus();
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