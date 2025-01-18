import { prepItems } from './prepItemsList.js';
import { prepList, addToPrepList, renderPrepList } from './prepList.js';

export function setupDragAndDrop(prepListItems) {
    const API_BASE_URL = "http://10.0.0.76:5080/Smart-Prep-Guide/source/api"; // Centralized API base URL

    // Allow drop on the Prep List container
    prepListItems.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    prepListItems.addEventListener("drop", async (event) => {
        event.preventDefault();

        try {
            // Get the index of the dragged item
            const index = event.dataTransfer.getData("text/plain");
            const draggedItem = prepItems[index];

            if (!draggedItem) {
                console.error("Dragged item not found.");
                return;
            }

            // Check if the item already exists in the Prep List
            const existingItem = prepList.find((item) => item.name === draggedItem.name);

            if (existingItem) {
                // Increment the quantity if the item already exists
                existingItem.quantity += 1;
                await updatePrepListItem(existingItem); // Ensure database is updated
            } else {
                // Add the new item with an initial quantity of 1
                await addToPrepList({ ...draggedItem, quantity: 1 });
            }

            // Re-render the Prep List
            renderPrepList(prepListItems);
        } catch (error) {
            console.error("Error handling drag-and-drop event:", error);
        }
    });

    async function updatePrepListItem(item) {
        try {
            const response = await fetch(`${API_BASE_URL}/updatePrepListItem.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    id: item.id,
                    quantity: item.quantity,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
        } catch (error) {
            console.error("Error updating Prep List item:", error);
        }
    }
}
