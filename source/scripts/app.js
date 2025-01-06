import { PrepItem } from './prepItem.js';
import { prepItems, renderPrepItems, addPrepItem } from './prepItemsList.js';
import { addToPrepList, renderPrepList, fetchPrepList } from './prepList.js';
import { setupDragAndDrop } from './dragAndDrop.js';

document.addEventListener("DOMContentLoaded", () => {
    const prepItemForm = document.getElementById("prepItemForm");
    const prepItemsList = document.getElementById("prepItemsList");
    const prepListItems = document.getElementById("prepListItems");
    const addToPrepListButton = document.getElementById("addToPrepListButton");
    const deleteItemsButton = document.getElementById("deleteItemsButton");

    // Initialize drag-and-drop functionality
    setupDragAndDrop(prepListItems);

    // Fetch PrepItems and PrepList from the database on page load
    async function initializeApp() {
        await fetchPrepItems();
        await fetchPrepList(prepListItems);
    }

    async function fetchPrepItems() {
        try {
            const response = await fetch('getPrepItems.php');
            const data = await response.json();

            data.forEach((item) => {
                prepItems.push(new PrepItem(item.name, item.unit_prefix, item.is_frozen));
                prepItems[prepItems.length - 1].id = item.id; // Attach database ID
            });

            renderPrepItems(prepItemsList);
        } catch (error) {
            console.error('Error fetching PrepItems:', error);
        }
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notificationBar = document.getElementById('notificationBar');

        // Set the message and color based on type
        notificationBar.textContent = message;
        notificationBar.style.backgroundColor = type === 'error' ? '#dc3545' : '#007BFF';

        // Show the notification
        notificationBar.style.display = 'block';

        // Hide after 3 seconds
        setTimeout(() => {
            notificationBar.style.display = 'none';
        }, 3000);
    }

    // Handle form submission to create a new PrepItem
    prepItemForm.addEventListener("submit", async (event) => {
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
        await addPrepItem(newItem); // Save to the database and add to the list
        renderPrepItems(prepItemsList);

        showNotification(`${name} added to PrepItem List!`);
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
        showNotification("Items added to Prep List!");
    });

    // Handle Delete Selected button click
    deleteItemsButton.addEventListener("click", async () => {
        const selectedCheckboxes = document.querySelectorAll(".itemCheckbox:checked");

        if (selectedCheckboxes.length === 0) {
            showNotification("No items selected to delete.", 'error');
            return;
        }

        if (!confirm("Are you sure you want to delete the selected items?")) {
            return;
        }

        const idsToDelete = Array.from(selectedCheckboxes).map(
            (checkbox) => parseInt(checkbox.dataset.id, 10)
        );

        try {
            const response = await fetch('deletePrepItems.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(idsToDelete),
            });
            const result = await response.json();

            if (result.success) {
                prepItems.splice(
                    0,
                    prepItems.length,
                    ...prepItems.filter((item) => !idsToDelete.includes(item.id))
                );
                renderPrepItems(prepItemsList);
                showNotification("Selected items deleted successfully!");
            } else {
                showNotification("Failed to delete items.", 'error');
            }
        } catch (error) {
            showNotification("Error deleting items.", 'error');
        }
    });

    // Initialize the application
    initializeApp();
});
