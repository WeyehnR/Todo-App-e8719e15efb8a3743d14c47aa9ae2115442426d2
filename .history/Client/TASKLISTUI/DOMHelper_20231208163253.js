export default class DOMHelper {
    getElementById(element) {
        return document.getElementById(element);
    }

    querySelector(element) {
        return document.querySelector(element);
    }

    querySelectorAll(element) {
        return document.querySelectorAll(element);
    }

    createElement(tagName) {
        return document.createElement(tagName);
    }
}