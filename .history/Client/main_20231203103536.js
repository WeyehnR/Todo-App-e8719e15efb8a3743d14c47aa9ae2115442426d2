const domHelper = new DOMHelper();
const ui = new UI(domHelper);
const taskManager = new TaskManager();

ui.setTaskManager(taskManager);
taskManager.setUI(ui);

try {
    ui.init();
} catch (error) {
    console.error(error);
}