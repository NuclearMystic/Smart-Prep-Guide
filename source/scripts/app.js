import { PrepItem } from './prepItem.js';
import { prepItems, renderPrepItems, addPrepItem } from './prepItemsList.js';
import { addToPrepList, renderPrepList } from './prepList.js';
import { setupDragAndDrop } from './dragAndDrop.js';

document.addEventListener("DOMContentLoaded", () => {
    const prepItemForm = document.getElementById("prepItemForm");
    const prepItemsList = document.getElementById("prepItemsList");
    const prepListItems = document.getElementById("prepListItems");
    const addToPrepListButton = document.getElementById("addToPrepListButton");
    const deleteItemsButton = document.getElementById("deleteItemsButton");

    // Initialize drag-and-drop functionality
    setupDragAndDrop(prepListItems);

    // Handle form submission to create a new PrepItem
    prepItemForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("itemName").value.trim();
        const unitPrefix = document.getElementById("unitPrefix").value.trim();
        const isFrozen = document.getElementById("isFrozen").checked;

        if (!name) {
            alert("Please enter a name for the PrepItem.");
            document.getElementById("itemName").focus();
            return;
        }

        const newItem = new PrepItem(name, unitPrefix, isFrozen);
        addPrepItem(newItem);
        renderPrepItems(prepItemsList);

        prepItemForm.reset();
    });

    // Handle Add Selected button click
    addToPrepListButton.addEventListener("click", () => {
        const selectedCheckboxes = document.querySelectorAll(".itemCheckbox:checked");

        selectedCheckboxes.forEach((checkbox) => {
            const index = parseInt(checkbox.dataset.index, 10);
            const selectedItem = prepItems[index];

            if (selectedItem) {
                addToPrepList(selectedItem);
            }
        });

        renderPrepList(prepListItems);
    });

    // Handle Delete Selected button click
    deleteItemsButton.addEventListener("click", () => {
        const selectedCheckboxes = document.querySelectorAll(".itemCheckbox:checked");

        if (selectedCheckboxes.length === 0) {
            alert("No items selected to delete.");
            return;
        }

        if (!confirm("Are you sure you want to delete the selected items?")) {
            return;
        }

        const indicesToRemove = Array.from(selectedCheckboxes).map((checkbox) => parseInt(checkbox.dataset.index, 10));

        // Remove selected items from the prepItems array
        prepItems.splice(
            0,
            prepItems.length,
            ...prepItems.filter((_, index) => !indicesToRemove.includes(index))
        );

        renderPrepItems(prepItemsList);
    });
});
