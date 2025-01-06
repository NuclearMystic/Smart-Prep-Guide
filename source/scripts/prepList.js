export let prepList = [];

// Render the Prep List
export function renderPrepList(prepListItems) {
    prepListItems.innerHTML = "";

    prepList.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("prep-list-item");

        // Add a class if the item is frozen
        if (item.isFrozen) {
            console.log(`Frozen item detected: ${item.name}`); // Debugging
            listItem.classList.add("frozen");
        }

        const itemName = document.createElement("span");
        itemName.textContent = `${item.name} (${item.unitPrefix || "No unit"})`;

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = item.quantity;
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
        const response = await fetch('getPrepList.php');
        const data = await response.json();

        // Map fetched data to include unit_prefix
        prepList.splice(
            0,
            prepList.length,
            ...data.map((item) => ({
                ...item,
                isFrozen: !!item.isFrozen, // Ensure `isFrozen` is boolean
                unitPrefix: item.unit_prefix || "No unit", // Ensure `unitPrefix` is set
            }))
        );

        renderPrepList(prepListItems);
    } catch (error) {
        console.error('Error fetching Prep List:', error);
    }
}


// Add a new Prep List item to the database
export async function addToPrepList(item) {
    const existingItem = prepList.find((listItem) => listItem.name === item.name);

    if (existingItem) {
        existingItem.quantity += 1;
        await updatePrepListItem(existingItem); // Update quantity in the database
    } else {
        const response = await fetch('addPrepListItem.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                name: item.name,
                unit_prefix: item.unitPrefix,
                quantity: 1,
            }),
        });
        const data = await response.json();

        if (data.success) {
            prepList.push({ ...item, id: data.id, quantity: 1 });
        } else {
            console.error('Failed to add Prep List item to the database.');
        }
    }
    renderPrepList(prepListItems); // Re-render the list
}

// Update a Prep List item in the database
async function updatePrepListItem(item) {
    try {
        await fetch('updatePrepListItem.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                id: item.id,
                quantity: item.quantity,
            }),
        });
    } catch (error) {
        console.error('Error updating Prep List item:', error);
    }
}

// Remove a Prep List item from the database
async function deletePrepListItem(id) {
    try {
        const response = await fetch('deletePrepListItem.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(id),
        });
        const data = await response.json();

        if (!data.success) {
            console.error('Failed to delete Prep List item from the database.');
        }
    } catch (error) {
        console.error('Error deleting Prep List item:', error);
    }
}
