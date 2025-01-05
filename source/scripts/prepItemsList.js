import { renderPrepList } from './prepList.js';

export let prepItems = [];

export function renderPrepItems(prepItemsList) {
    prepItemsList.innerHTML = "";

    prepItems.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} (${item.unitPrefix || "No unit"})`;

        // Add checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("itemCheckbox");
        checkbox.dataset.index = index;
        checkbox.id = `checkbox-${index}`; // Optional unique id

        listItem.prepend(checkbox);

        // Drag-and-drop attributes
        listItem.setAttribute("draggable", "true");
        listItem.classList.add("draggable");
        listItem.dataset.index = index;

        listItem.addEventListener("dragstart", handleDragStart);
        listItem.addEventListener("dragend", handleDragEnd);

        prepItemsList.appendChild(listItem);
    });
}

export function addPrepItem(item) {
    prepItems.push(item);
}

function handleDragStart(event) {
    const index = event.target.dataset.index;
    event.dataTransfer.setData("text/plain", index);
    event.target.classList.add("dragging");
}

function handleDragEnd(event) {
    event.target.classList.remove("dragging");
}
