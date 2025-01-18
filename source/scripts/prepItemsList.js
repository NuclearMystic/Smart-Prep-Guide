import { renderPrepList } from './prepList.js';

export let prepItems = [];

const API_BASE_URL = "http://10.0.0.76:5080/Smart-Prep-Guide/source/api"; // Centralized API base URL

// Render the PrepItems list
export function renderPrepItems(prepItemsList) {
    prepItemsList.innerHTML = "";

    prepItems.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} (${item.unitPrefix || "No unit"})`;

        // Add checkbox for selection
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

        // Drag-and-drop event listeners
        listItem.addEventListener("dragstart", handleDragStart);
        listItem.addEventListener("dragend", handleDragEnd);

        prepItemsList.appendChild(listItem);
    });
}

// Add a new PrepItem to the database and the array
export async function addPrepItem(item) {
    try {
        const response = await fetch(`${API_BASE_URL}/addPrepItem.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                name: item.name,
                unit_prefix: item.unitPrefix,
                is_frozen: item.isFrozen ? 1 : 0, // Convert boolean to integer for PHP
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            item.id = data.id; // Store the database ID
            prepItems.push(item);
        } else {
            console.error('Failed to add PrepItem to the database:', data.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Error adding PrepItem:', error);
    }
}

// Handle drag start
function handleDragStart(event) {
    const index = event.target.dataset.index;
    event.dataTransfer.setData("text/plain", index);
    event.target.classList.add("dragging");
}

// Handle drag end
function handleDragEnd(event) {
    event.target.classList.remove("dragging");
}
