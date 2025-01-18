export let prepList = [];

const API_BASE_URL = "http://10.0.0.76:5080/Smart-Prep-Guide/source/api"; // Centralized API base URL

// Render the Prep List
export function renderPrepList(prepListItems) {
    prepListItems.innerHTML = "";

    prepList.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("prep-list-item");

        // Add a class if the item is frozen
        if (item.isFrozen) {
            listItem.classList.add("frozen");
        }

        const itemName = document.createElement("span");
        itemName.textContent = `${item.name} (${item.unitPrefix})`;

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = item.quantity.toFixed(2); // Ensure consistent display
        quantityInput.min = 0;
        quantityInput.step = 0.01;

        quantityInput.addEventListener("change", async (event) => {
            const newQuantity = parseFloat(event.target.value) || 0; // Default to 0 if input is cleared
            prepList[index].quantity = newQuantity;
            await updatePrepListItem(prepList[index]); // Update the database
        });

        // Remove button
        const removeButton = document.createElement("button");
        removeButton.textContent = "x";
        removeButton.classList.add("remove-button");

        removeButton.addEventListener("click", async () => {
            await deletePrepListItem(item.id); // Remove from database
            prepList.splice(index, 1); // Remove from the array
            renderPrepList(prepListItems); // Re-render the list
        });

        listItem.appendChild(itemName);
        listItem.appendChild(quantityInput);
        listItem.appendChild(removeButton);
        prepListItems.appendChild(listItem);
    });
}

// Fetch Prep List items from the database
export async function fetchPrepList(prepListItems) {
    try {
        const response = await fetch(`${API_BASE_URL}/getPrepList.php`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        prepList.splice(
            0,
            prepList.length,
            ...data.map((item) => ({
                ...item,
                isFrozen: Boolean(item.isFrozen), // Ensure `isFrozen` is boolean
                unitPrefix: item.unit_prefix || "No unit", // Ensure `unitPrefix` is set
            }))
        );

        renderPrepList(prepListItems);
    } catch (error) {
        console.error("Error fetching Prep List:", error);
    }
}

// Add a new Prep List item to the database
export async function addToPrepList(item) {
    const existingItem = prepList.find((listItem) => listItem.name === item.name);

    if (existingItem) {
        existingItem.quantity += 1;
        await updatePrepListItem(existingItem); // Update quantity in the database
    } else {
        try {
            const response = await fetch(`${API_BASE_URL}/addPrepListItem.php`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    name: item.name,
                    unit_prefix: item.unitPrefix,
                    quantity: 1,
                    is_frozen: item.isFrozen ? 1 : 0, // Pass the isFrozen flag
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                prepList.push({ ...item, id: data.id, quantity: 1 });
            } else {
                console.error("Failed to add Prep List item to the database:", data.message || "Unknown error");
            }
        } catch (error) {
            console.error("Error adding Prep List item:", error);
        }
    }
    renderPrepList(document.getElementById("prepListItems")); // Re-render the list
}

// Update a Prep List item in the database
async function updatePrepListItem(item) {
    try {
        const response = await fetch(`${API_BASE_URL}/updatePrepListItem.php`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
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

// Remove a Prep List item from the database
async function deletePrepListItem(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/deletePrepListItem.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(id),
        });

        const data = await response.json();

        if (!data.success) {
            console.error("Failed to delete Prep List item from the database:", data.message || "Unknown error");
        }
    } catch (error) {
        console.error("Error deleting Prep List item:", error);
    }
}
