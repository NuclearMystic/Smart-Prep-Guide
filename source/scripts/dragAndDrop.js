import { prepItems } from './prepItemsList.js';
import { addToPrepList, renderPrepList } from './prepList.js';

export function setupDragAndDrop(prepListItems) {
    prepListItems.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    prepListItems.addEventListener("drop", (event) => {
        event.preventDefault();

        const index = event.dataTransfer.getData("text/plain");

        // Validate the dragged item
        if (!prepItems[index]) {
            console.error("Invalid drop: No matching PrepItem found.");
            return;
        }

        const draggedItem = prepItems[index];
        addToPrepList(draggedItem);
        renderPrepList(prepListItems);

        // Log the successful operation
        console.log(`Item added to Prep List: ${draggedItem.name}`);
    });
}
