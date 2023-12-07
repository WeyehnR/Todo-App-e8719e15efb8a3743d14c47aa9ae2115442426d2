import DOMHelper from './DOMHelper.js';
import UI from './UserInterface.js

export default class ListManager {
    constructor(domHelper, ui) {
        this.domHelper = domHelper;
        this.ui = ui;
        this.addListButton = this.domHelper.getElementById('add-list-btn');
        this.tagsMenuSelection = this.domHelper.getElementById('tags-menu-selection');
    }

    
    addListButtonEvent() {
        this.addListButton.addEventListener('click', () => {
            this.tagsMenuSelection.style.display = this.tagsMenuSelection.style.display === "none" ? "block" : "none";
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
        addListElement?.addEventListener('click', () => {
            const newListForm = this.domHelper.getElementById('new-list-form');
            newListForm.style.display = newListForm.style.display === 'block' ? 'none' : 'block';
        });
    }

    addNewList() {
        this.domHelper.getElementById('new-list-name').addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const newListName = event.target.value;
                const dynamicColor = this.domHelper.getElementById('dynamic-color-card').style.backgroundColor;
                if (newListName) {
                    document.documentElement.style.setProperty('--dynamic-color-card', dynamicColor);
                    const newListElement = this.createListElement(newListName, dynamicColor);
                    const ul = this.domHelper.querySelector('.Lists-menu-selection');
                    ul.appendChild(newListElement);
                    event.target.value = '';
                    this.domHelper.getElementById('new-list-form').style.display = 'none';
                    let lists = JSON.parse(localStorage.getItem('lists')) || [];
                    lists.push({ name: newListName, color: dynamicColor });
                    localStorage.setItem('lists', JSON.stringify(lists));
                    this.ui.populateDropdownMenus();
                }
            }
        });
    }

    createListElement(name, color) {
        const newListElement = document.createElement('li');
        newListElement.className = 'menu-item new-list';
        newListElement.classList.add('dynamic-color-card'); // Add this line
        newListElement.style.setProperty('--dynamic-color-card', color); // Keep this line to set the color dynamically
        newListElement.appendChild(document.createTextNode(name));
        newListElement.appendChild(this.createItemCountElement());
        newListElement.appendChild(this.createDeleteButton(name));
        return newListElement;
    }

    createItemCountElement() {
        const itemCount = document.createElement('span');
        itemCount.className = 'item-count';
        return itemCount;
    }

    createDeleteButton(name) {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-list';
        deleteButton.textContent = 'x';
        deleteButton.addEventListener('click', () => {
            this.deleteList(name);
        });
        return deleteButton;
    }

    loadLists() {
        let lists = JSON.parse(localStorage.getItem('lists')) || [];
        lists.forEach(list => {
            const newListElement = this.createListElement(list.name, list.color);
            const addListButton = this.domHelper.querySelector('.add-list');
            addListButton.parentNode.insertBefore(newListElement, addListButton);
        });
        this.addDeleteButtonListeners(); // Add this line to add the delete button listeners after loading the lists
    }

    deleteList(name) {
        // Update the dropdown menu
        this.ui.updateDropdownMenu();

        // Remove the list from the DOM
        const listElement = this.domHelper.querySelector(`.Lists-menu-selection .menu-item:contains(${name})`);
        if (listElement) {
            listElement.remove();
        }

        // Remove the list from local storage
        let lists = JSON.parse(localStorage.getItem('lists')) || [];
        lists = lists.filter(list => list.name !== name);
        localStorage.setItem('lists', JSON.stringify(lists));
    }

    addDeleteButtonListeners() {
        const deleteButtons = this.domHelper.querySelectorAll('.Lists-menu-selection .delete-list');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                // Get the name of the list to delete
                const name = event.target.parentElement.textContent.trim();
                this.deleteList(name);
            });
        });
    }

    init() {
        this.addListButtonEvent();
        this.displayNewListForm();
        this.setColorOptions();
        this.toggleNewListForm();
        this.addNewList();
        this.loadLists();
    }
}