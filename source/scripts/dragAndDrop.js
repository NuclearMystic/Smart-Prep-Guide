import { prepItems } from './prepItemsList.js';
import { prepList, addToPrepList, renderPrepList } from './prepList.js';

export function setupDragAndDrop(prepListItems) {
    prepListItems.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    prepListItems.addEventListener("drop", (event) => {
        event.preventDefault();

        // Get the index of the dragged item
        const index = event.dataTransfer.getData("text/plain");
        const draggedItem = prepItems[index];

        // Check if the item already exists in the Prep List
        const existingItem = prepList.find((item) => item.name === draggedItem.name);

        if (existingItem) {
            // Increment the quantity if the item already exists
            existingItem.quantity += 1;
        } else {
            // Add the new item with an initial quantity of 1
            addToPrepList({ ...draggedItem, quantity: 1 });
        }

        // Re-render the Prep List
        renderPrepList(prepListItems);
    });
}
