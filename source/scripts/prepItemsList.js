import { renderPrepList } from './prepList.js';

export let prepItems = [];

// Render the PrepItems list
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
        checkbox.dataset.id = item.id; // Store the database ID for deletion

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

// Add a new PrepItem
export async function addPrepItem(item) {
    const response = await fetch('addPrepItem.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            name: item.name,
            unit_prefix: item.unitPrefix,
            is_frozen: item.isFrozen,
        }),
    });
    const data = await response.json();

    if (data.success) {
        item.id = data.id; // Store the database ID
        prepItems.push(item);
    } else {
        console.error('Failed to add PrepItem to the database.');
    }
}

// Handle drag-and-drop
function handleDragStart(event) {
    const index = event.target.dataset.index;
    event.dataTransfer.setData("text/plain", index);
    event.target.classList.add("dragging");
}

function handleDragEnd(event) {
    event.target.classList.remove("dragging");
}
