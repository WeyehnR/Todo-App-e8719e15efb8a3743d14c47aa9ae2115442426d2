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