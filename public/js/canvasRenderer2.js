/* GLOBAL Variables*/
let selectedElement = null;


const formCanvas = document.querySelector("#form-canvas");
const formCanvasMsg = document.querySelector(".form-canvas--message");
const stylingSidebar = document.querySelector("#styling-sidebar");
const stylingCanontrols = document.querySelector("#styling-controls");

//Toggle canvas message
const toggleCanvasMsg = () => {
  formCanvasMsg.style.display =
    formCanvas.childElementCount > 1 ? "none" : "flex";
};

//Create new wlwmwnt with attributes and event listeners
const createElement = (
  type,
  attributes = {},
  textContent = "",
  events = {}
) => {
  const element = document.createElement(type);

  Object.keys(attributes).forEach((attr) => {
    element[attr] = attributes[attr];
  });
  element.textContent = textContent;
  Object.keys(events).forEach((event) => {
    element.addEventListener(event, events[event]);
  });
  return element;
};

//main structure to create forms
const createFormWrapper = (label) => {
  const canvasItem = createElement("div", { className: "canvas__item" });
  canvasItem.appendChild(
    createElement("p", { className: "canvas__item--type" }, label)
  );
  canvasItem.appendChild(
    createElement(
      "p",
      { className: "text-body-medium text-neutral-50" },
      "Customize"
    )
  );

  // const deleteButton = createDeleteButton();
  return canvasItem;
};

// formCanvas.appendChild(createFormWrapper("Test Element"));
const createDeleteButton = () => {
  return createElement("button", { className: "btn btn__remove" }, "Remove", {
    click: (event) => {
      const canvasItem = event.target.closest(".canvas__item");
      if (canvasItem) {
        canvasItem.remove();
      }
    },
  });
};

const createFieldDescription = () => {
  const descriptionInput = createElement("input", {
    type: "text",
    placeholder: "Set Field descriptin",
    className: "canvas__item--input text-body-medium description-input",
  });

  const previewDescription = createElement(
    "p",
    {
      className: "field-description text-body-small text-neutral-50",
      style: "margin-top: 4px",
    },
    "Form Description Goes Here!"
  );

  descriptionInput.addEventListener("input", () => {
    previewDescription.textContent = descriptionInput.value || "";
  });
  return {descriptionInput, previewDescription}
};

// styling options

const enablestylingSidebar = (formQuestion) => {
  formQuestion.addEventListener("click", (event) => {
    console.log("Question Clicked");
    event.stopPropagation();

    const target = event.target;

    //highlight the selected one form previously selected element
    if (selectedElement) {
      selectedElement.style.outline = "none";
    }

    selectedElement = target;

    selectedElement.style.outline = "2px solid blue";


    addStylingControls(target);

  });

    //close sidebar when clicking outside selected element
    document.addEventListener("click", (event) => {
      if (!formQuestion.contains(event.target)&& event.target != stylingSidebar) {
        if (selectedElement) {
          selectedElement.style.outline = "none";
        }
        selectedElement = null;

        stylingSidebar.style.display = "none";
      }
    });
};

// display styling options in styling sidebar
const addStylingControls = (target) => {
  stylingSidebar.style.display = "block";
  stylingCanontrols.innerHTML = ""; //clearing previous

  const createControl = (labelText, inputType, property, unit = "") => {
    const controlWrapper = createElement("div", {
      className: "control-wrapper",
      style: "margin-bottom: 10px",
    });
  
    const label = createElement("label", {}, labelText);
  
    // Safely get the computed value
    const computedStyle = window.getComputedStyle(target);
    const computedValue = computedStyle[property] || ""; // Fallback to empty string if undefined
  
    const input = createElement("input", {
      type: inputType,
      value: computedValue.replace(unit, ""), // Only call replace on strings
    });
  
    input.addEventListener("input", () => {
      target.style[property] = input.value + unit;
    });
  
    controlWrapper.appendChild(label);
    controlWrapper.appendChild(input);
    stylingCanontrols.append(controlWrapper);
  };
  
    createControl("Background Color", "color", "backgroundColor");
    createControl("Font Color", "color", "Color");
    createControl("Font Size", "number", "fontSize", "px");
    createControl("Padding", "number", "padding", "px");
    createControl("Margin", "number", "margin", "px");  
};



//Tool tip

const createToolTipOption = (previewInput) => {
  const tooltipInput = createElement("input", {
    type: "text",
    placeholder: "Set Tooltip Text",
    className: "canvas__item--input text-body-medium tooltip-input"
  });

  tooltipInput.addEventListener("input", () => {
    previewInput.title = tooltipInput.value || "";
  });

  return tooltipInput;
};


const createTextField = () => {
  const formWrapper = createFormWrapper("Text Field");

  // Live Preview Section
  const formQuestion = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style:
      "border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%; cursor: pointer;",
  });

  const previewLabel = createElement("label", {}, "Field Label");
  const previewInput = createElement("input", {
    type: "text",
    placeholder: "Enter question here...",
    className: "canvas__item--input text-body-medium",
  });

  const {descriptionInput, previewDescription} = createFieldDescription();
  enablestylingSidebar(formQuestion);

  formQuestion.appendChild(previewLabel);
  formQuestion.appendChild(previewInput);
  formQuestion.appendChild(previewDescription);

  // Customization Options
  const settingsSection = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style:
      "display: flex; gap: 4px; flex-wrap: wrap; border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%",
  });

  // Label Customization
  const labelInput = createElement("input", {
    type: "text",
    placeholder: "Set field label",
    className: "canvas__item--input label-input text-body-medium",
  });

  labelInput.addEventListener("input", () => {
    previewLabel.textContent = labelInput.value || "Field Label";
  });

  // Placeholder Customization
  const placeholderInput = createElement("input", {
    type: "text",
    placeholder: "Set placeholder",
    className: "canvas__item--input text-body-medium placeholder-input",
  });

  placeholderInput.addEventListener("input", () => {
    previewInput.placeholder =
      placeholderInput.value || "Enter question here...";
  });

  // Field Type Dropdown
  const typeSelect = createElement(
    "select",
    {
      className: "canvas__item--input text-body-medium placeholder-input",
    },
    ""
  );
  ["text", "email", "password", "number"].forEach((type) => {
    const option = createElement("option", { value: type }, type);
    typeSelect.appendChild(option);
  });

  typeSelect.addEventListener("change", () => {
    previewInput.type = typeSelect.value;
  });

  // Validation Options
  const minLengthInput = createElement("input", {
    type: "number",
    placeholder: "Min Length",
    className:
      "canvas__item--input text-body-medium placeholder-input min-length-input",
  });

  const maxLengthInput = createElement("input", {
    type: "number",
    placeholder: "Max Length",
    className: "canvas__item--input text-body-medium max-length-input",
  });
  const requiredToggleWrapper = createElement("div", {
    style: "display: flex; gap: 4px;",
  });

  const requiredToggle = createElement("input", {
    type: "checkbox",
    className: "required-toggle",
    id: "required-toggle",
  });

  const requiredLabel = createElement(
    "label",
    {
      className: "text-body-medium text-neutral-50 ",
      htmlFor: "required-toggle",
    },
    "Required"
  );

  requiredToggle.addEventListener("change", () => {
    previewInput.required = requiredToggle.checked;
  });

  requiredToggleWrapper.appendChild(requiredToggle);
  requiredToggleWrapper.appendChild(requiredLabel);

  minLengthInput.addEventListener("input", () => {
    const minLength = parseInt(minLengthInput.value, 10) || 0;
    previewInput.minLength = minLength;
  });

  maxLengthInput.addEventListener("input", () => {
    const maxLength = parseInt(maxLengthInput.value, 10) || 100;
    previewInput.maxLength = maxLength;
  });

  // Custom Error Message
  const errorMessageInput = createElement("input", {
    type: "text",
    placeholder: "Custom error message",
    className: "canvas__item--input text-body-medium error-message-input",
  });

  const errorMessage = createElement(
    "p",
    {
      className: "error-message text-danger",
      style: "display: none;",
    },
    "Invalid input"
  );

  errorMessageInput.addEventListener("input", () => {
    errorMessage.textContent = errorMessageInput.value || "Invalid input";
  });

  // Append Settings to Settings Section

  settingsSection.appendChild(descriptionInput);

  settingsSection.appendChild(labelInput);
  settingsSection.appendChild(placeholderInput);
  settingsSection.appendChild(typeSelect);
  settingsSection.appendChild(minLengthInput);
  settingsSection.appendChild(maxLengthInput);
  settingsSection.appendChild(requiredToggleWrapper);
  settingsSection.appendChild(errorMessageInput);
  settingsSection.appendChild(createToolTipOption(previewInput));

  // Final Assembly
  formWrapper.appendChild(formQuestion);
  formWrapper.appendChild(settingsSection);
  formWrapper.appendChild(errorMessage);
  // formWrapper.appendChild(createStylingOptions(previewInput))
  formWrapper.appendChild(createDeleteButton());

  return formWrapper;
};

const formRenderer = {
  "text-field": createTextField,
};

// formCanvas.appendChild(createFormWrapper("testing"))

// implement dragover and drop event
formCanvas.addEventListener("dragover", (event) => {
  event.preventDefault();
});

formCanvas.addEventListener("drop", (event) => {
  event.preventDefault();

  const type = event.dataTransfer.getData("text/plain");

  if (formRenderer[type]) {
    formCanvas.appendChild(formRenderer[type]());
  }
});

