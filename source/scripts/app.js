import { PrepItem } from './prepItem.js';
import { prepItems, renderPrepItems, addPrepItem } from './prepItemsList.js';
import { renderPrepList, addToPrepList, fetchPrepList } from './prepList.js';
import { setupDragAndDrop } from './dragAndDrop.js';

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = "http://10.0.0.76:5080/Smart-Prep-Guide/source/api"; // Base URL for API

    const prepItemForm = document.getElementById("prepItemForm");
    const prepItemsList = document.getElementById("prepItemsList");
    const prepListItems = document.getElementById("prepListItems");
    const addToPrepListButton = document.getElementById("addToPrepListButton");
    const deleteItemsButton = document.getElementById("deleteItemsButton");

    // Notification timeout
    let notificationTimeout;

    // Notification system
    function showNotification(message, type = 'info') {
        const notificationBar = document.getElementById('notificationBar');

        // Clear existing timeout
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        notificationBar.textContent = message;
        notificationBar.style.backgroundColor = type === 'error' ? '#dc3545' : '#007BFF';
        notificationBar.style.display = 'block';

        notificationTimeout = setTimeout(() => {
            notificationBar.style.display = 'none';
        }, 3000);
    }

    // Initialize the app
    async function initializeApp() {
        try {
            await fetchPrepItems();
            await fetchPrepList(prepListItems);
            setupDragAndDrop(prepListItems);
        } catch (error) {
            console.error('Error initializing app:', error);
            showNotification("Failed to initialize app.", 'error');
        }
    }

    // Fetch PrepItems from the database
    async function fetchPrepItems() {
        try {
            const response = await fetch(`${API_BASE_URL}/getPrepItems.php`);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

            const data = await response.json();

            data.forEach((item) => {
                prepItems.push(new PrepItem(item.name, item.unit_prefix, item.is_frozen));
                prepItems[prepItems.length - 1].id = item.id;
            });

            renderPrepItems(prepItemsList);
        } catch (error) {
            console.error('Error fetching PrepItems:', error);
            showNotification("Failed to fetch PrepItems.", 'error');
        }
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

        try {
            const newItem = new PrepItem(name, unitPrefix, isFrozen);
            await addPrepItem(newItem); // Save to the database and add to the list
            renderPrepItems(prepItemsList);

            showNotification(`${name} added to PrepItem List!`);
            prepItemForm.reset();
        } catch (error) {
            console.error('Error adding PrepItem:', error);
            showNotification("Failed to add PrepItem.", 'error');
        }
    });

    // Handle Add Selected button click
    addToPrepListButton.addEventListener("click", async () => {
        const selectedCheckboxes = document.querySelectorAll(".itemCheckbox:checked");

        for (const checkbox of selectedCheckboxes) {
            const index = parseInt(checkbox.dataset.index, 10);
            const selectedItem = prepItems[index];

            if (selectedItem) {
                await addToPrepList(selectedItem); // Ensure database updates before rendering
            }
        }

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
            const response = await fetch(`${API_BASE_URL}/deletePrepItems.php`, {
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
            console.error('Error deleting items:', error);
            showNotification("Error deleting items.", 'error');
        }
    });

    // Initialize the application
    initializeApp();
});
