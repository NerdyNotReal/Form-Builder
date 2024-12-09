const formcanvas = document.querySelector("#form-canvas");

// implement dragover/drop event 
formcanvas.addEventListener("dragover", (event) => {
    event.preventDefault();
});

formcanvas.addEventListener ("drop", (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("text/plain"); // getting data form dragstart
    const label = event.dataTransfer.getData("label");

    const formItem = document.createElement("div");
    formItem.classList.add("form-canvas__item")
    
    if (type === "text-field") {
        const input = document.createElement("input");
        input.type = "text";
        const label =  document.createElement("p");
        label.textContent = "Label";
        label.classList.add("form-canvas__item--label");
        input.classList.add("form-canvas__item--input");
        formItem.appendChild(label);
        formItem.appendChild(input);
    }
    formcanvas.appendChild(formItem);
});

