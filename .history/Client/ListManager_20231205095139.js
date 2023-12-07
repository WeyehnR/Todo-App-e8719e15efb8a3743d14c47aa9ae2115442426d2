import DomHelper from './DomHelper.js';

export default class ListManager {
    constructor(domHelper) {
        this.domHelper = domHelper;
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

}


    // ... rest of your methods go here ...
}