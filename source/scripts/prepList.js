export let prepList = [];

export function renderPrepList(prepListItems) {
    prepListItems.innerHTML = "";

    prepList.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("prep-list-item");

        const itemName = document.createElement("span");
        itemName.textContent = `${item.name} (${item.unitPrefix || "No unit"})`;

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = item.quantity;
        quantityInput.min = 0;
        quantityInput.step = 0.01;

        quantityInput.addEventListener("change", (event) => {
            const newQuantity = parseFloat(event.target.value) || 0; // Default to 0 if input is cleared
            prepList[index].quantity = newQuantity;
        });

        listItem.appendChild(itemName);
        listItem.appendChild(quantityInput);
        prepListItems.appendChild(listItem);
    });
}

export function addToPrepList(item) {
    const existingItem = prepList.find((listItem) => listItem.name === item.name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        prepList.push({ ...item, quantity: 1 });
    }
}
