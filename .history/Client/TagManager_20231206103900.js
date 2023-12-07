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
        // let tagText = this.domHelper.getElementById('tag-text-input').value;
        // let tagColor = this.domHelper.getElementById('tag-color-input').value;
        this.domHelper.getElementById('add-tag-button').addEventListener('click', () => {
            // Assume you get tagText and tagColor from input fields
            let tags = JSON.parse(localStorage.getItem('tags')) || [];
            tags.push({text: tagText, bgColor: tagColor});
            localStorage.setItem('tags', JSON.stringify(tags));

            // Update the dropdown menus
            this.populateDropdownMenus();
        });
    }

    // Delete tag
    deleteTag() {
        // let tagText = this.domHelper.getElementById('tag-text-input').value;
        // <button class="delete-tag" style="background-color: rgb(206, 171, 185);">x</button>
        this.domHelper.querySelector('.delete-tag').addEventListener('click', () => {
            // Assume you get tagText from an input field
            let tags = JSON.parse(localStorage.getItem('tags')) || [];
            const index = tags.findIndex(tag => tag.text === tagText);
            if (index !== -1) {
                tags.splice(index, 1);
                localStorage.setItem('tags', JSON.stringify(tags));
            }

            // Update the dropdown menus
            this.populateDropdownMenus();
        });
    }

    // Rename tag
    renameTag() {
        // let oldTagText = this.domHelper.getElementById('old-tag-text-input').value;
        // let newTagText = this.domHelper.getElementById('new-tag-text-input').value;
        this.domHelper.getElementById('rename-tag-btn').addEventListener('click', () => {
            // Assume you get oldTagText and newTagText from input fields
            let tags = JSON.parse(localStorage.getItem('tags')) || [];
            const index = tags.findIndex(tag => tag.text === oldTagText);
            if (index !== -1) {
                tags[index].text = newTagText;
                localStorage.setItem('tags', JSON.stringify(tags));
            }

            // Update the dropdown menus
            this.populateDropdownMenus();
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
        const newTag = document.createElement('li');
        newTag.className = 'menu-item tag';
        newTag.style.backgroundColor = bgColor;
        newTag.style.color = this.getContrast(bgColor);

        const tagText = document.createElement('span');
        tagText.className = 'tag-text';
        tagText.textContent = text;
        newTag.appendChild(tagText);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-tag';
        deleteButton.style.backgroundColor = bgColor;
        deleteButton.textContent = 'x';
        newTag.appendChild(deleteButton);

        // Add event listener to delete button
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            newTag.remove();
            this.saveTags();

            // Update the dropdown menu
            this.updateTagDropdownMenu();
        });

        // Add event listener to tag for editing
        tagText.addEventListener('click', (e) => {
            e.stopPropagation();
            const input = document.createElement('input');
            input.value = e.target.textContent;
            e.target.textContent = '';
            e.target.appendChild(input);
            input.focus();

            input.addEventListener('blur', () => {
                e.target.textContent = input.value;
                this.saveTags();

                // Update the dropdown menu
                this.updateTagDropdownMenu();
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                    this.updateTagDropdownMenu();
                }
            });
        });

        return newTag;
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