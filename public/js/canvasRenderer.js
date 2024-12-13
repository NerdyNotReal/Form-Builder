const formcanvas = document.querySelector("#form-canvas");
const formcanvasMsg = document.querySelector(".form-canvas--message");

// implement dragover/drop event

const deleteCanvasItem = () => {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove";
    deleteButton.classList.add("btn", "btn__remove");

    // delete items functionality
    deleteButton.addEventListener("click", (event) => {
        const formItem = event.target.closest(".form-canvas__item");
        if (formItem) {
            formItem.remove();
            toggleCanvasMsg();
        }
    });

    return deleteButton; 
}

const toggleCanvasMsg = () => {
    if (formcanvas.childElementCount > 1) {
        formcanvasMsg.style.display = "none";
        console.log(formcanvas.childElementCount);
    } else {
        formcanvasMsg.style.display = "flex";
    }
}

formcanvas.addEventListener("dragover", (event) => {
    event.preventDefault();
});

formcanvas.addEventListener("drop", (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("text/plain"); // getting data form dragstart
    const label = event.dataTransfer.getData("label");

    const formItem = document.createElement("div");
    formItem.classList.add("form-canvas__item");


    if (type === "text-field") {
        toggleCanvasMsg();
        const input = document.createElement("input");
        input.type = "text";
        const label = document.createElement("p");
        label.textContent = "Label";
        label.classList.add("form-canvas__item--label");
        input.classList.add("form-canvas__item--input");
        // const deleteButton = deleteCanvasItem();

        formItem.appendChild(label);
        formItem.appendChild(input);
        formItem.appendChild(deleteCanvasItem());
        formcanvas.appendChild(formItem);
        toggleCanvasMsg();
    }
});
