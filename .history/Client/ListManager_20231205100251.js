import DomHelper from './DomHelper.js';
import UI from './UI.js';

export default class ListManager {
    constructor(domHelper, ui) {
        this.domHelper = domHelper;
        this.ui = ui;
        this.addListButton = this.domHelper.getElementById('add-list-btn');
        this.tagsMenuSelection = this.domHelper.getElementById('tags-menu-selection');
    }

    addListButtonEvent() {
        this.addListButton.addEventListener('click', () => {
            if (this.tagsMenuSelection.style.display === "none") {
                this.tagsMenuSelection.style.display = "block";
            } else {
                this.tagsMenuSelection.style.display = "none";
            }
        });
    }

    displayNewListForm() {
        this.domHelper.getElementById('new-list-form').addEventListener('click', () => {
            this.domHelper.getElementById('new-list-form').style.display = 'block';
        });
    }

    setColorOptions() {
        const colorOptions = this.domHelper.querySelectorAll('.color-option-1, .color-option-2, .color-option-3, .color-option-4, .color-option-5, .color-option-6, .color-option-7, .color-option-8');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                const color = window.getComputedStyle(option).backgroundColor;
                this.domHelper.getElementById('dynamic-color-card').style.backgroundColor = color;
            });
        });
    }



    toggleNewListForm() {
        const addListElement = this.domHelper.querySelector('.add-list');
        if (!addListElement) {
            console.error('Add list element not found');
        } else {
            console.log('Add list element found, adding event listener');
            addListElement.addEventListener('click', () => {
                const newListForm = this.domHelper.getElementById('new-list-form');
                if (!newListForm) {
                    console.error('New list form not found');
                } else {
                    console.log('New list form found, toggling display');
                    newListForm.style.display = newListForm.style.display === 'block' ? 'none' : 'block';
                }
            });
        }
    }

    addNewList() {
        this.domHelper.getElementById('new-list-name').addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const newListName = event.target.value;
                const dynamicColor = this.domHelper.getElementById('dynamic-color-card').style.backgroundColor;
                if (newListName) {
                    // Update the CSS variable with the new color
                    document.documentElement.style.setProperty('--dynamic-color-card', dynamicColor);

                    const newListElement = this.createListElement(newListName, dynamicColor);
                    const ul = this.domHelper.querySelector('.Lists-menu-selection');
                    ul.appendChild(newListElement);
                    event.target.value = '';
                    this.domHelper.getElementById('new-list-form').style.display = 'none';

                    // Store the new list name and color in localStorage
                    let lists = JSON.parse(localStorage.getItem('lists')) || [];
                    lists.push({ name: newListName, color: dynamicColor });
                    localStorage.setItem('lists', JSON.stringify(lists));

                    // Update the dropdown menu
                    this.ui.populateDropdownMenus();
                }
            }
        });
    }

    createListElement(name, color) {
        const newListElement = document.createElement('li');
        newListElement.className = 'menu-item new-list';

        const listName = document.createTextNode(name);
        newListElement.appendChild(listName);

        const itemCount = document.createElement('span');
        itemCount.className = 'item-count';
        newListElement.appendChild(itemCount);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-list';
        deleteButton.textContent = 'x';
        newListElement.appendChild(deleteButton);

        newListElement.style.setProperty('--dynamic-color-card', color);

        // Add event listener to delete button
        deleteButton.addEventListener('click', () => {
            newListElement.remove();
            // Update localStorage
            let lists = JSON.parse(localStorage.getItem('lists')) || [];
            lists = lists.filter(list => list.name !== name);
            localStorage.setItem('lists', JSON.stringify(lists));

            // Update the dropdown menu
            this.updateDropdownMenu();
        });

        return newListElement;
    }


    loadLists() {
        let lists = JSON.parse(localStorage.getItem('lists')) || [];
        lists.forEach(list => {
            const newListElement = this.createListElement(list.name, list.color);
            const addListButton = this.domHelper.querySelector('.add-list');
            addListButton.parentNode.insertBefore(newListElement, addListButton);
        });
    }

    deleteList(){
        const deleteButtons = document.querySelectorAll('.Lists-menu-selection .delete-list');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                // Get the name of the list to delete
                const name = event.target.parentElement.textContent.trim();
                this.deleteList(name);
                console.log(name);
            });
        });
    }

    addDeleteButtonListeners() {
        const deleteButtons = document.querySelectorAll('.Lists-menu-selection .delete-list');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                // Get the name of the list to delete
                const name = event.target.parentElement.textContent.trim();
                this.deleteList(name);
                console.log(name);
            });
        });
    }
}