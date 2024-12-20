// ---Canvas global---

const formcanvas = document.querySelector("#form-canvas");
const formcanvasMsg = document.querySelector(".form-canvas--message");

//global functions
const toggleCanvasMsg = () => {
  if (formcanvas.childElementCount > 1) {
    formcanvasMsg.style.display = "none";
    console.log(`Item count: ${formcanvas.childElementCount - 1}`);
  } else {
    formcanvasMsg.style.display = "flex";
  }
};

const deleteCanvasItem = () => {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Remove";
  deleteButton.classList.add("btn", "btn__remove");

  // delete items functionality
  deleteButton.addEventListener("click", (event) => {
    const canvasItem = event.target.closest(".canvas__item");
    if (canvasItem) {
      canvasItem.remove();
      toggleCanvasMsg();
    }
  });

  return deleteButton;
};

const createInput = (id, type, className, placehiolder) => {
  const input = document.createElement("input");
  input.id = id;
  input.className = className;
  input.type = type;
  input.placeholder = placehiolder;
  return input;
}


// implement dragover/drop event

formcanvas.addEventListener("dragover", (event) => {
  event.preventDefault();
});

formcanvas.addEventListener("drop", (event) => {
  event.preventDefault();

  // create  a object by keys value for item, where each key is associated with a rendering function
  // const formrender

  function createInput(type) {

  }

  const formRenderer = {
    "text-field": (canvas) => {

      const canvasItem = document.createElement("div");
      canvasItem.className = "canvas__item";

      const itemType = document.createElement("p");
      itemType.className = "canvas__item--type  ";
      itemType.textContent = type;
      canvasItem.appendChild(itemType);

      const customizeText = document.createElement("p");
      customizeText.className = "text-body-medium text-neutral-50";
      customizeText.textContent = "Customize";
      canvasItem.appendChild(customizeText);

      const itemWrapper = document.createElement("div");
      itemWrapper.className = "canvas__item--wrapper";
      canvasItem.appendChild(itemWrapper);

      const inputQuestion = document.createElement("input");
      inputQuestion.type = "text";
      inputQuestion.id = type;
      inputQuestion.className = "canvas__item--input canvas__item--input-label text-body-small";
      inputQuestion.placeholder = "Enter question";
      itemWrapper.appendChild(inputQuestion);
      const typeSelect = document.createElement("select");
      typeSelect.name = "form-item-type";
      typeSelect.id = "form-item-type";
      typeSelect.className = "canvas__item--input canvas__item--input-type text-body-small";

      const options = [
        { value: "", text: "Type" },
        { value: "text", text: "Text" },
        { value: "url", text: "URL" },
      ];
      options.forEach((optionData) => {
        const option = document.createElement("option");
        option.value = optionData.value;
        option.textContent = optionData.text;
        typeSelect.appendChild(option);
      });
      itemWrapper.appendChild(typeSelect);


      const constraintsContainer = document.createElement("div");
      constraintsContainer.className = "canvas__item--constraints";
      canvasItem.appendChild(constraintsContainer);

      const minValueInput = document.createElement("input");
      minValueInput.type = "number";
      minValueInput.id = "min-value";
      minValueInput.className = "canvas__item--input canvas__item--constraint text-body-small";
      minValueInput.placeholder = "MIN";
      constraintsContainer.appendChild(minValueInput);

      const maxValueInput = document.createElement("input");
      maxValueInput.type = "number";
      maxValueInput.id = "max-value";
      maxValueInput.className = "canvas__item--input canvas__item--constraint text-body-small";
      maxValueInput.placeholder = "MAX";
      constraintsContainer.appendChild(maxValueInput);

      const patternInput = document.createElement("input");
      patternInput.type = "text";
      patternInput.id = "pattern";
      patternInput.className = "canvas__item--input canvas__item--constraint text-body-small";
      patternInput.placeholder = "Pattern";
      constraintsContainer.appendChild(patternInput);

      const placeholderInput = document.createElement("input");
      placeholderInput.type = "text";
      placeholderInput.id = "placeholder";
      placeholderInput.className =
        "canvas__item--input canvas__item--input--placeholder text-body-small";
      placeholderInput.placeholder = "Enter Placeholder";
      canvasItem.appendChild(placeholderInput);

      const errorMsgInput = document.createElement("textarea");
      //   errorMsgInput.type = "text";
      errorMsgInput.id = "error-msg";
      errorMsgInput.className =
        "canvas__item--input canvas__item--input--error-msg text-body-small";
      errorMsgInput.placeholder = "Enter Error";
      canvasItem.appendChild(errorMsgInput);

      canvasItem.appendChild(deleteCanvasItem());

      canvas.appendChild(canvasItem);
    },
    "multiple-choice": (canvas) => {
      const canvasItem = document.createElement("div");
      canvasItem.className = "canvas__item";

      const itemType = document.createElement("p");
      itemType.className = "canvas__item--type  ";
      itemType.textContent = type;
      canvasItem.appendChild(itemType);

      const customizeText = document.createElement("p");
      customizeText.className = "text-body-medium text-neutral-50";
      customizeText.textContent = "Customize";
      canvasItem.appendChild(customizeText);

      const itemWrapper = document.createElement("div");
      itemWrapper.className = "canvas__item--wrapper";
      const inputQuestion = document.createElement("input");
      inputQuestion.type = "text";
      inputQuestion.id = type;
      inputQuestion.className = "canvas__item--input canvas__item--input-label text-body-small";
      inputQuestion.placeholder = "Enter question";
      
      itemWrapper.appendChild(inputQuestion);
      canvasItem.appendChild(itemWrapper);


      //create options
      const optionsContainer = document.createElement("div");
      optionsContainer.className = "canvas__item--options";
      canvasItem.appendChild(optionsContainer);



      const options = ["optiion 1", "Option 2","Option 3"];

      options.forEach((placeholder, index) => {
        const optionInput = document.createElement("input");
        optionInput.type = "text";
        optionInput.className = "canvas__item--input canvas__item--input-option text-body-small";
        optionInput.placeholder = placeholder;
        optionInput.dataset.index = index;
        optionsContainer.appendChild(optionInput);
      });
      // add button to add more options
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "btn btn__secondary";
      addButton.textContent = "Add Options";

      addButton.addEventListener("click", () => {
        const newOption = document.createElement("input");
        newOption.type = "text";
        newOption.className = "canvas__item--input canvas__item--input-option text-body-small";
        newOption.placeholder = `Option ${optionsContainer.childElementCount + 1}`;
        newOption.dataset.index = optionsContainer.childElementCount;
        console.log(optionsContainer.childElementCount);
        optionsContainer.appendChild(newOption);
      });

      
      canvasItem.appendChild(optionsContainer)
      canvasItem.appendChild(addButton);   
      canvasItem.appendChild(deleteCanvasItem());

      canvas.appendChild(canvasItem)
    }
  };

  const type = event.dataTransfer.getData("text/plain"); // getting data form dragstart
  const label = event.dataTransfer.getData("label");

  const renderElement = (type, formcanvas) => {
    if (formRenderer[type]) {
      formRenderer[type](formcanvas);
      toggleCanvasMsg();
    }
  };
  console.log(type);

  renderElement(type, formcanvas);

  // if (type === "text-field") {
  //     toggleCanvasMsg();
  //     const input = document.createElement("input");
  //     input.type = "text";
  //     const label = document.createElement("p");
  //     label.textContent = "Label";
  //     label.classList.add("form-canvas__item--label");
  //     input.classList.add("form-canvas__item--input");
  //     // const deleteButton = deleteCanvasItem();

  //     formItem.appendChild(label);
  //     formItem.appendChild(input);
  //     formItem.appendChild(deleteCanvasItem());
  //     formcanvas.appendChild(formItem);
  //     toggleCanvasMsg();
  // }
});
