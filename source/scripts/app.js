// PrepItem Class Definition
class PrepItem {
    constructor(name, unitPrefix = "", isFrozen = false) {
        this.name = name;
        this.unitPrefix = unitPrefix;
        this.isFrozen = isFrozen;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const prepItemForm = document.getElementById("prepItemForm");
    const prepItemsList = document.getElementById("prepItemsList");
    const addToPrepListButton = document.getElementById("addToPrepListButton");
    const deleteItemsButton = document.getElementById("deleteItemsButton");
    const prepListItems = document.getElementById("prepListItems");

    // Arrays to store PrepItems and Prep List items
    let prepItems = [];
    let prepList = [];

    // Function to render the list of PrepItems
    function renderPrepItems() {
        prepItemsList.innerHTML = "";

        prepItems.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.name} (${item.unitPrefix || "No unit"})`;

            // Add a checkbox for selection
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("itemCheckbox");
            checkbox.dataset.index = index;

            listItem.prepend(checkbox);
            prepItemsList.appendChild(listItem);
        });
    }

    // Function to render the Prep List
    function renderPrepList() {
        prepListItems.innerHTML = "";
    
        prepList.forEach((item, index) => {
            const listItem = document.createElement("li");
    
            // Item name
            const itemName = document.createElement("span");
            itemName.textContent = `${item.name} (${item.unitPrefix || "No unit"})`;
    
            // Quantity input field
            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.value = item.quantity; // Use the quantity from the prepList array
            quantityInput.min = 0;
            quantityInput.step = 0.01;
            quantityInput.classList.add("quantityField");
            quantityInput.dataset.index = index;
    
            // Update the quantity in the prepList array on change
            quantityInput.addEventListener("change", (event) => {
                const newQuantity = parseFloat(event.target.value);
                if (newQuantity >= 0) {
                    prepList[index].quantity = newQuantity;
                }
            });
    
            listItem.appendChild(itemName);
            listItem.appendChild(quantityInput);
            prepListItems.appendChild(listItem);
        });
    }
    

    // Handle form submission
    prepItemForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("itemName").value.trim();
        const unitPrefix = document.getElementById("unitPrefix").value.trim();
        const isFrozen = document.getElementById("isFrozen").checked;

        if (!name) {
            alert("Please enter a name for the PrepItem.");
            return;
        }

        const newItem = new PrepItem(name, unitPrefix, isFrozen);
        prepItems.push(newItem);
        renderPrepItems();

        prepItemForm.reset();
    });

    // Handle adding selected PrepItems to the Prep List
    addToPrepListButton.addEventListener("click", () => {
        const selectedCheckboxes = document.querySelectorAll(".itemCheckbox:checked");
    
        selectedCheckboxes.forEach((checkbox) => {
            const index = parseInt(checkbox.dataset.index);
            const selectedItem = prepItems[index];
    
            // Check if the item is already in the Prep List
            const existingItem = prepList.find((item) => item.name === selectedItem.name);
    
            if (existingItem) {
                // Increment the quantity in the prepList array
                existingItem.quantity += 1;
            } else {
                // Add the new item with a quantity of 1
                prepList.push({ ...selectedItem, quantity: 1 });
            }
    
            // Uncheck the checkbox after processing
            checkbox.checked = false;
        });
    
        renderPrepList(); // Update the DOM to reflect the updated prepList array
    });
    

    // Handle deleting selected PrepItems
    deleteItemsButton.addEventListener("click", () => {
        if (!confirm("Are you sure you want to delete the selected items?")) {
            return;
        }

        const selectedCheckboxes = document.querySelectorAll(".itemCheckbox:checked");
        const indicesToRemove = Array.from(selectedCheckboxes).map(
            (checkbox) => parseInt(checkbox.dataset.index)
        );

        prepItems = prepItems.filter((_, index) => !indicesToRemove.includes(index));
        renderPrepItems();
    });
});


