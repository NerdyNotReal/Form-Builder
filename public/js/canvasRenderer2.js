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
    click: async (event) => {
      const canvasItem = event.target.closest(".canvas__item");
      if (canvasItem) {
        const formId = new URLSearchParams(window.location.search).get('id');
        const elementId = canvasItem.dataset.elementId;

        if (formId && elementId) {
          try {
            const response = await fetch('../backend/api/delete_form_element.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ formId, elementId })
            });

            const result = await response.json();
            if (result.success) {
              canvasItem.remove();
              toggleCanvasMsg();
            } else {
              console.error('Failed to delete element:', result.error);
              alert('Failed to delete element. Please try again.');
            }
          } catch (error) {
            console.error('Error deleting element:', error);
            alert('Failed to delete element. Please try again.');
          }
        } else {
          // For newly added elements that haven't been saved yet
          canvasItem.remove();
          toggleCanvasMsg();
        }
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


const createTextField = (type = "text-field") => {
  const formWrapper = createFormWrapper(type.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));

  // Live Preview Section
  const formQuestion = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%; cursor: pointer;",
  });

  const previewLabel = createElement("label", {}, "Field Label");
  
  // Set input type based on field type
  let inputType = "text";
  let inputAttributes = {};
  
  switch(type) {
    case "email-field":
      inputType = "email";
      break;
    case "phone-field":
      inputType = "tel";
      inputAttributes.pattern = "[0-9]{10}";
      break;
    case "file-upload":
      inputType = "file";
      break;
    case "image-upload":
      inputType = "file";
      inputAttributes.accept = "image/*";
      break;
    case "document-upload":
      inputType = "file";
      inputAttributes.accept = ".pdf,.doc,.docx";
      break;
    case "url-field":
      inputType = "url";
      break;
    case "color-picker":
      inputType = "color";
      break;
    case "price-field":
      inputType = "number";
      inputAttributes.step = "0.01";
      inputAttributes.min = "0";
      break;
    case "calculation-field":
      inputType = "number";
      inputAttributes.readonly = true;
      break;
    default:
      inputType = "text";
  }

  const previewInput = createElement("input", {
    type: inputType,
    placeholder: "Enter text here...",
    className: "canvas__item--input text-body-medium",
    ...inputAttributes
  });

  const {descriptionInput, previewDescription} = createFieldDescription();
  enablestylingSidebar(formQuestion);

  formQuestion.appendChild(previewLabel);
  formQuestion.appendChild(previewInput);
  formQuestion.appendChild(previewDescription);

  // Settings Section
  const settingsSection = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "display: flex; gap: 4px; flex-wrap: wrap; border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%",
  });

  // Label Input
  const labelInput = createElement("input", {
    type: "text",
    placeholder: "Set field label",
    className: "canvas__item--input label-input text-body-medium",
  });

  labelInput.addEventListener("input", () => {
    previewLabel.textContent = labelInput.value || "Field Label";
  });

  // Placeholder Input (hide for certain types)
  if (!["file-upload", "image-upload", "document-upload", "color-picker"].includes(type)) {
    const placeholderInput = createElement("input", {
      type: "text",
      placeholder: "Set placeholder",
      className: "canvas__item--input text-body-medium placeholder-input",
    });

    placeholderInput.addEventListener("input", () => {
      previewInput.placeholder = placeholderInput.value || "Enter text here...";
    });
    settingsSection.appendChild(placeholderInput);
  }

  // Required Toggle
  const requiredToggleWrapper = createElement("div", {
    style: "display: flex; gap: 4px;",
  });

  const requiredToggle = createElement("input", {
    type: "checkbox",
    className: "required-toggle",
  });

  const requiredLabel = createElement("label", {
    className: "text-body-medium text-neutral-50",
  }, "Required");

  requiredToggle.addEventListener("change", () => {
    previewInput.required = requiredToggle.checked;
  });

  requiredToggleWrapper.appendChild(requiredToggle);
  requiredToggleWrapper.appendChild(requiredLabel);

  // Append all settings
  settingsSection.appendChild(descriptionInput);
  settingsSection.appendChild(labelInput);
  settingsSection.appendChild(requiredToggleWrapper);
  settingsSection.appendChild(createToolTipOption(previewInput));

  // Final Assembly
  formWrapper.appendChild(formQuestion);
  formWrapper.appendChild(settingsSection);
  formWrapper.appendChild(createDeleteButton());

  return formWrapper;
};

const createTextArea = () => {
  const formWrapper = createFormWrapper("Text Area");
  
  // Live Preview Section
  const formQuestion = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%; cursor: pointer;",
  });

  const previewLabel = createElement("label", {}, "Field Label");
  const previewInput = createElement("textarea", {
    placeholder: "Enter text here...",
    className: "canvas__item--input text-body-medium",
    rows: "4"
  });

  const {descriptionInput, previewDescription} = createFieldDescription();
  enablestylingSidebar(formQuestion);

  formQuestion.appendChild(previewLabel);
  formQuestion.appendChild(previewInput);
  formQuestion.appendChild(previewDescription);

  // Settings Section
  const settingsSection = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "display: flex; gap: 4px; flex-wrap: wrap; border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%",
  });

  // Label Input
  const labelInput = createElement("input", {
    type: "text",
    placeholder: "Set field label",
    className: "canvas__item--input label-input text-body-medium",
  });

  labelInput.addEventListener("input", () => {
    previewLabel.textContent = labelInput.value || "Field Label";
  });

  // Placeholder Input
  const placeholderInput = createElement("input", {
    type: "text",
    placeholder: "Set placeholder",
    className: "canvas__item--input text-body-medium placeholder-input",
  });

  placeholderInput.addEventListener("input", () => {
    previewInput.placeholder = placeholderInput.value || "Enter text here...";
  });

  // Required Toggle
  const requiredToggleWrapper = createElement("div", {
    style: "display: flex; gap: 4px;",
  });

  const requiredToggle = createElement("input", {
    type: "checkbox",
    className: "required-toggle",
  });

  const requiredLabel = createElement("label", {
    className: "text-body-medium text-neutral-50",
  }, "Required");

  requiredToggle.addEventListener("change", () => {
    previewInput.required = requiredToggle.checked;
  });

  requiredToggleWrapper.appendChild(requiredToggle);
  requiredToggleWrapper.appendChild(requiredLabel);

  // Append all settings
  settingsSection.appendChild(descriptionInput);
  settingsSection.appendChild(labelInput);
  settingsSection.appendChild(placeholderInput);
  settingsSection.appendChild(requiredToggleWrapper);
  settingsSection.appendChild(createToolTipOption(previewInput));

  // Final Assembly
  formWrapper.appendChild(formQuestion);
  formWrapper.appendChild(settingsSection);
  formWrapper.appendChild(createDeleteButton());

  return formWrapper;
};

const createDropdown = () => {
  const formWrapper = createFormWrapper("Dropdown");

  // Live Preview Section
  const formQuestion = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%; cursor: pointer;",
  });

  const previewLabel = createElement("label", {}, "Field Label");
  const previewSelect = createElement("select", {
    className: "canvas__item--input text-body-medium",
  });

  const {descriptionInput, previewDescription} = createFieldDescription();
  enablestylingSidebar(formQuestion);

  formQuestion.appendChild(previewLabel);
  formQuestion.appendChild(previewSelect);
  formQuestion.appendChild(previewDescription);

  // Settings Section
  const settingsSection = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "display: flex; gap: 4px; flex-wrap: wrap; border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%",
  });

  // Label Input
  const labelInput = createElement("input", {
    type: "text",
    placeholder: "Set field label",
    className: "canvas__item--input label-input text-body-medium",
  });

  labelInput.addEventListener("input", () => {
    previewLabel.textContent = labelInput.value || "Field Label";
  });

  // Options Input
  const optionsInput = createElement("textarea", {
    placeholder: "Enter options (one per line)",
    className: "canvas__item--input text-body-medium",
    rows: "4",
  });

  optionsInput.addEventListener("input", () => {
    previewSelect.innerHTML = "";
    const options = optionsInput.value.split("\n").filter(opt => opt.trim());
    options.forEach(opt => {
      const option = createElement("option", { value: opt.trim() }, opt.trim());
      previewSelect.appendChild(option);
    });
  });

  // Required Toggle
  const requiredToggleWrapper = createElement("div", {
    style: "display: flex; gap: 4px;",
  });

  const requiredToggle = createElement("input", {
    type: "checkbox",
    className: "required-toggle",
  });

  const requiredLabel = createElement("label", {
    className: "text-body-medium text-neutral-50",
  }, "Required");

  requiredToggle.addEventListener("change", () => {
    previewSelect.required = requiredToggle.checked;
  });

  requiredToggleWrapper.appendChild(requiredToggle);
  requiredToggleWrapper.appendChild(requiredLabel);

  // Append all settings
  settingsSection.appendChild(descriptionInput);
  settingsSection.appendChild(labelInput);
  settingsSection.appendChild(optionsInput);
  settingsSection.appendChild(requiredToggleWrapper);
  settingsSection.appendChild(createToolTipOption(previewSelect));

  // Final Assembly
  formWrapper.appendChild(formQuestion);
  formWrapper.appendChild(settingsSection);
  formWrapper.appendChild(createDeleteButton());

  return formWrapper;
};

const createRadioButton = () => {
  const formWrapper = createFormWrapper("Radio Button");

  // Live Preview Section
  const formQuestion = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%; cursor: pointer;",
  });

  const previewLabel = createElement("label", {}, "Field Label");
  const radioGroup = createElement("div", {
    className: "radio-group",
    style: "display: flex; flex-direction: column; gap: 8px;",
  });

  const {descriptionInput, previewDescription} = createFieldDescription();
  enablestylingSidebar(formQuestion);

  formQuestion.appendChild(previewLabel);
  formQuestion.appendChild(radioGroup);
  formQuestion.appendChild(previewDescription);

  // Settings Section
  const settingsSection = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "display: flex; gap: 4px; flex-wrap: wrap; border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%",
  });

  // Label Input
  const labelInput = createElement("input", {
    type: "text",
    placeholder: "Set field label",
    className: "canvas__item--input label-input text-body-medium",
  });

  labelInput.addEventListener("input", () => {
    previewLabel.textContent = labelInput.value || "Field Label";
  });

  // Options Input
  const optionsInput = createElement("textarea", {
    placeholder: "Enter options (one per line)",
    className: "canvas__item--input text-body-medium",
    rows: "4",
  });

  const groupName = "radio_" + Date.now();
  optionsInput.addEventListener("input", () => {
    radioGroup.innerHTML = "";
    const options = optionsInput.value.split("\n").filter(opt => opt.trim());
    options.forEach(opt => {
      const wrapper = createElement("div", {
        style: "display: flex; align-items: center; gap: 8px;",
      });
      const radio = createElement("input", {
        type: "radio",
        name: groupName,
        value: opt.trim(),
      });
      const label = createElement("label", {}, opt.trim());
      wrapper.appendChild(radio);
      wrapper.appendChild(label);
      radioGroup.appendChild(wrapper);
    });
  });

  // Required Toggle
  const requiredToggleWrapper = createElement("div", {
    style: "display: flex; gap: 4px;",
  });

  const requiredToggle = createElement("input", {
    type: "checkbox",
    className: "required-toggle",
  });

  const requiredLabel = createElement("label", {
    className: "text-body-medium text-neutral-50",
  }, "Required");

  requiredToggle.addEventListener("change", () => {
    radioGroup.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.required = requiredToggle.checked;
    });
  });

  requiredToggleWrapper.appendChild(requiredToggle);
  requiredToggleWrapper.appendChild(requiredLabel);

  // Append all settings
  settingsSection.appendChild(descriptionInput);
  settingsSection.appendChild(labelInput);
  settingsSection.appendChild(optionsInput);
  settingsSection.appendChild(requiredToggleWrapper);

  // Final Assembly
  formWrapper.appendChild(formQuestion);
  formWrapper.appendChild(settingsSection);
  formWrapper.appendChild(createDeleteButton());

  return formWrapper;
};

const createDatePicker = () => {
  const formWrapper = createFormWrapper("Date Picker");

  // Live Preview Section
  const formQuestion = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%; cursor: pointer;",
  });

  const previewLabel = createElement("label", {}, "Field Label");
  const previewInput = createElement("input", {
    type: "date",
    className: "canvas__item--input text-body-medium",
  });

  const {descriptionInput, previewDescription} = createFieldDescription();
  enablestylingSidebar(formQuestion);

  formQuestion.appendChild(previewLabel);
  formQuestion.appendChild(previewInput);
  formQuestion.appendChild(previewDescription);

  // Settings Section
  const settingsSection = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "display: flex; gap: 4px; flex-wrap: wrap; border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%",
  });

  // Label Input
  const labelInput = createElement("input", {
    type: "text",
    placeholder: "Set field label",
    className: "canvas__item--input label-input text-body-medium",
  });

  labelInput.addEventListener("input", () => {
    previewLabel.textContent = labelInput.value || "Field Label";
  });

  // Min Date
  const minDateInput = createElement("input", {
    type: "date",
    className: "canvas__item--input text-body-medium",
    placeholder: "Min Date",
  });

  minDateInput.addEventListener("input", () => {
    previewInput.min = minDateInput.value;
  });

  // Max Date
  const maxDateInput = createElement("input", {
    type: "date",
    className: "canvas__item--input text-body-medium",
    placeholder: "Max Date",
  });

  maxDateInput.addEventListener("input", () => {
    previewInput.max = maxDateInput.value;
  });

  // Required Toggle
  const requiredToggleWrapper = createElement("div", {
    style: "display: flex; gap: 4px;",
  });

  const requiredToggle = createElement("input", {
    type: "checkbox",
    className: "required-toggle",
  });

  const requiredLabel = createElement("label", {
    className: "text-body-medium text-neutral-50",
  }, "Required");

  requiredToggle.addEventListener("change", () => {
    previewInput.required = requiredToggle.checked;
  });

  requiredToggleWrapper.appendChild(requiredToggle);
  requiredToggleWrapper.appendChild(requiredLabel);

  // Append all settings
  settingsSection.appendChild(descriptionInput);
  settingsSection.appendChild(labelInput);
  settingsSection.appendChild(minDateInput);
  settingsSection.appendChild(maxDateInput);
  settingsSection.appendChild(requiredToggleWrapper);
  settingsSection.appendChild(createToolTipOption(previewInput));

  // Final Assembly
  formWrapper.appendChild(formQuestion);
  formWrapper.appendChild(settingsSection);
  formWrapper.appendChild(createDeleteButton());

  return formWrapper;
};

const createNumberField = () => {
  const formWrapper = createFormWrapper("Number Field");

  // Live Preview Section
  const formQuestion = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%; cursor: pointer;",
  });

  const previewLabel = createElement("label", {}, "Field Label");
  const previewInput = createElement("input", {
    type: "number",
    placeholder: "Enter number",
    className: "canvas__item--input text-body-medium",
  });

  const {descriptionInput, previewDescription} = createFieldDescription();
  enablestylingSidebar(formQuestion);

  formQuestion.appendChild(previewLabel);
  formQuestion.appendChild(previewInput);
  formQuestion.appendChild(previewDescription);

  // Settings Section
  const settingsSection = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "display: flex; gap: 4px; flex-wrap: wrap; border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%",
  });

  // Label Input
  const labelInput = createElement("input", {
    type: "text",
    placeholder: "Set field label",
    className: "canvas__item--input label-input text-body-medium",
  });

  labelInput.addEventListener("input", () => {
    previewLabel.textContent = labelInput.value || "Field Label";
  });

  // Min Value
  const minInput = createElement("input", {
    type: "number",
    placeholder: "Min Value",
    className: "canvas__item--input text-body-medium",
  });

  minInput.addEventListener("input", () => {
    previewInput.min = minInput.value;
  });

  // Max Value
  const maxInput = createElement("input", {
    type: "number",
    placeholder: "Max Value",
    className: "canvas__item--input text-body-medium",
  });

  maxInput.addEventListener("input", () => {
    previewInput.max = maxInput.value;
  });

  // Step Value
  const stepInput = createElement("input", {
    type: "number",
    placeholder: "Step Value",
    className: "canvas__item--input text-body-medium",
  });

  stepInput.addEventListener("input", () => {
    previewInput.step = stepInput.value || "1";
  });

  // Required Toggle
  const requiredToggleWrapper = createElement("div", {
    style: "display: flex; gap: 4px;",
  });

  const requiredToggle = createElement("input", {
    type: "checkbox",
    className: "required-toggle",
  });

  const requiredLabel = createElement("label", {
    className: "text-body-medium text-neutral-50",
  }, "Required");

  requiredToggle.addEventListener("change", () => {
    previewInput.required = requiredToggle.checked;
  });

  requiredToggleWrapper.appendChild(requiredToggle);
  requiredToggleWrapper.appendChild(requiredLabel);

  // Append all settings
  settingsSection.appendChild(descriptionInput);
  settingsSection.appendChild(labelInput);
  settingsSection.appendChild(minInput);
  settingsSection.appendChild(maxInput);
  settingsSection.appendChild(stepInput);
  settingsSection.appendChild(requiredToggleWrapper);
  settingsSection.appendChild(createToolTipOption(previewInput));

  // Final Assembly
  formWrapper.appendChild(formQuestion);
  formWrapper.appendChild(settingsSection);
  formWrapper.appendChild(createDeleteButton());

  return formWrapper;
};

const createTimePicker = () => {
  const formWrapper = createFormWrapper("Time Picker");

  // Live Preview Section
  const formQuestion = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%; cursor: pointer;",
  });

  const previewLabel = createElement("label", {}, "Field Label");
  const previewInput = createElement("input", {
    type: "time",
    className: "canvas__item--input text-body-medium",
  });

  const {descriptionInput, previewDescription} = createFieldDescription();
  enablestylingSidebar(formQuestion);

  formQuestion.appendChild(previewLabel);
  formQuestion.appendChild(previewInput);
  formQuestion.appendChild(previewDescription);

  // Settings Section
  const settingsSection = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "display: flex; gap: 4px; flex-wrap: wrap; border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%",
  });

  // Label Input
  const labelInput = createElement("input", {
    type: "text",
    placeholder: "Set field label",
    className: "canvas__item--input label-input text-body-medium",
  });

  labelInput.addEventListener("input", () => {
    previewLabel.textContent = labelInput.value || "Field Label";
  });

  // Min Time
  const minTimeInput = createElement("input", {
    type: "time",
    className: "canvas__item--input text-body-medium",
  });

  minTimeInput.addEventListener("input", () => {
    previewInput.min = minTimeInput.value;
  });

  // Max Time
  const maxTimeInput = createElement("input", {
    type: "time",
    className: "canvas__item--input text-body-medium",
  });

  maxTimeInput.addEventListener("input", () => {
    previewInput.max = maxTimeInput.value;
  });

  // Required Toggle
  const requiredToggleWrapper = createElement("div", {
    style: "display: flex; gap: 4px;",
  });

  const requiredToggle = createElement("input", {
    type: "checkbox",
    className: "required-toggle",
  });

  const requiredLabel = createElement("label", {
    className: "text-body-medium text-neutral-50",
  }, "Required");

  requiredToggle.addEventListener("change", () => {
    previewInput.required = requiredToggle.checked;
  });

  requiredToggleWrapper.appendChild(requiredToggle);
  requiredToggleWrapper.appendChild(requiredLabel);

  // Append all settings
  settingsSection.appendChild(descriptionInput);
  settingsSection.appendChild(labelInput);
  settingsSection.appendChild(minTimeInput);
  settingsSection.appendChild(maxTimeInput);
  settingsSection.appendChild(requiredToggleWrapper);
  settingsSection.appendChild(createToolTipOption(previewInput));

  // Final Assembly
  formWrapper.appendChild(formQuestion);
  formWrapper.appendChild(settingsSection);
  formWrapper.appendChild(createDeleteButton());

  return formWrapper;
};

const createToggleSwitch = () => {
  const formWrapper = createFormWrapper("Toggle Switch");

  // Live Preview Section
  const formQuestion = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%; cursor: pointer;",
  });

  const previewLabel = createElement("label", {}, "Field Label");
  const toggleWrapper = createElement("div", {
    style: "display: flex; align-items: center; gap: 8px;",
  });

  const previewInput = createElement("input", {
    type: "checkbox",
    className: "toggle-switch",
  });

  const toggleLabel = createElement("span", {}, "Off");

  previewInput.addEventListener("change", () => {
    toggleLabel.textContent = previewInput.checked ? "On" : "Off";
  });

  const {descriptionInput, previewDescription} = createFieldDescription();
  enablestylingSidebar(formQuestion);

  toggleWrapper.appendChild(previewInput);
  toggleWrapper.appendChild(toggleLabel);
  formQuestion.appendChild(previewLabel);
  formQuestion.appendChild(toggleWrapper);
  formQuestion.appendChild(previewDescription);

  // Settings Section
  const settingsSection = createElement("div", {
    className: "text-body-medium text-neutral-50",
    style: "display: flex; gap: 4px; flex-wrap: wrap; border: 1px dashed #ccc; padding: 10px; margin-bottom: 10px; width: 100%",
  });

  // Label Input
  const labelInput = createElement("input", {
    type: "text",
    placeholder: "Set field label",
    className: "canvas__item--input label-input text-body-medium",
  });

  labelInput.addEventListener("input", () => {
    previewLabel.textContent = labelInput.value || "Field Label";
  });

  // On Text Input
  const onTextInput = createElement("input", {
    type: "text",
    placeholder: "On Text",
    value: "On",
    className: "canvas__item--input text-body-medium",
  });

  // Off Text Input
  const offTextInput = createElement("input", {
    type: "text",
    placeholder: "Off Text",
    value: "Off",
    className: "canvas__item--input text-body-medium",
  });

  const updateToggleLabel = () => {
    toggleLabel.textContent = previewInput.checked ? onTextInput.value : offTextInput.value;
  };

  onTextInput.addEventListener("input", updateToggleLabel);
  offTextInput.addEventListener("input", updateToggleLabel);
  previewInput.addEventListener("change", updateToggleLabel);

  // Required Toggle
  const requiredToggleWrapper = createElement("div", {
    style: "display: flex; gap: 4px;",
  });

  const requiredToggle = createElement("input", {
    type: "checkbox",
    className: "required-toggle",
  });

  const requiredLabel = createElement("label", {
    className: "text-body-medium text-neutral-50",
  }, "Required");

  requiredToggle.addEventListener("change", () => {
    previewInput.required = requiredToggle.checked;
  });

  requiredToggleWrapper.appendChild(requiredToggle);
  requiredToggleWrapper.appendChild(requiredLabel);

  // Append all settings
  settingsSection.appendChild(descriptionInput);
  settingsSection.appendChild(labelInput);
  settingsSection.appendChild(onTextInput);
  settingsSection.appendChild(offTextInput);
  settingsSection.appendChild(requiredToggleWrapper);
  settingsSection.appendChild(createToolTipOption(previewInput));

  // Final Assembly
  formWrapper.appendChild(formQuestion);
  formWrapper.appendChild(settingsSection);
  formWrapper.appendChild(createDeleteButton());

  return formWrapper;
};

const formRenderer = {
  "text-field": createTextField,
  "text-area": createTextArea,
  "dropdown": createDropdown,
  "radio-button": createRadioButton,
  "date-picker": createDatePicker,
  "number-field": createNumberField,
  "time-picker": createTimePicker,
  "toggle-switch": createToggleSwitch,
  "email-field": createTextField,
  "phone-field": createTextField,
  "checkbox": createToggleSwitch,
  "multi-select": createDropdown,
  "date-range": createDatePicker,
  "section-break": createFormWrapper,
  "page-break": createFormWrapper,
  "divider": createFormWrapper,
  "heading": createFormWrapper,
  "file-upload": createTextField,
  "image-upload": createTextField,
  "document-upload": createTextField,
  "signature-field": createTextField,
  "rating-scale": createRadioButton,
  "captcha": createFormWrapper,
  "terms-checkbox": createToggleSwitch,
  "url-field": createTextField,
  "color-picker": createTextField,
  "address-field": createTextArea,
  "rich-text": createTextArea,
  "price-field": createTextField,
  "calculation-field": createTextField,
  "rating-stars": createRadioButton
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
    formCanvas.appendChild(formRenderer[type](type));
    toggleCanvasMsg();
  }
});

// Function to load and render saved form elements
async function loadSavedFormElements() {
    const formId = new URLSearchParams(window.location.search).get('id');
    if (!formId) return;

    try {
        const response = await fetch(`../backend/api/get_form_elements.php?id=${formId}`);
        const data = await response.json();
        
        if (data.success && data.elements) {
            // Clear existing canvas content except the first child (form title)
            while (formCanvas.childNodes.length > 1) {
                formCanvas.removeChild(formCanvas.lastChild);
            }
            
            // Render each saved element
            data.elements.forEach(element => {
                let renderedElement;
                switch (element.type) {
                    case 'text':
                        renderedElement = createTextField();
                        break;
                    case 'textarea':
                        renderedElement = createTextArea();
                        break;
                    case 'select':
                        renderedElement = createDropdown();
                        break;
                    case 'radio':
                        renderedElement = createRadioButton();
                        break;
                    case 'date':
                        renderedElement = createDatePicker();
                        break;
                    case 'number':
                        renderedElement = createNumberField();
                        break;
                    case 'time':
                        renderedElement = createTimePicker();
                        break;
                    case 'checkbox':
                        renderedElement = createToggleSwitch();
                        break;
                }
                
                if (renderedElement) {
                    // Set the element ID for deletion
                    renderedElement.dataset.elementId = element.id;
                    
                    // Set the saved properties
                    const labelElement = renderedElement.querySelector('label');
                    if (labelElement) {
                        labelElement.textContent = element.label;
                    }
                    
                    const inputElement = renderedElement.querySelector('input, select, textarea');
                    if (inputElement) {
                        if (element.required) {
                            inputElement.setAttribute('required', 'required');
                        }
                        if (element.properties.placeholder) {
                            inputElement.setAttribute('placeholder', element.properties.placeholder);
                        }
                    }
                    
                    // Handle options for select, radio, checkbox
                    if (element.properties.options && element.properties.options.length > 0) {
                        if (element.type === 'select') {
                            const select = renderedElement.querySelector('select');
                            if (select) {
                                select.innerHTML = element.properties.options.map(opt => 
                                    `<option value="${opt.value}">${opt.label}</option>`
                                ).join('');
                            }
                        } else if (element.type === 'radio' || element.type === 'checkbox') {
                            const container = renderedElement.querySelector('.radio-group, .checkbox-group');
                            if (container) {
                                container.innerHTML = element.properties.options.map(opt => `
                                    <div class="option">
                                        <input type="${element.type}" name="group_${element.id}" value="${opt.value}">
                                        <label>${opt.label}</label>
                                    </div>
                                `).join('');
                            }
                        }
                    }
                    
                    // Add description if exists
                    if (element.properties.description) {
                        const descElement = renderedElement.querySelector('.field-description');
                        if (descElement) {
                            descElement.textContent = element.properties.description;
                        }
                    }
                    
                    formCanvas.appendChild(renderedElement);
                }
            });
            
            toggleCanvasMsg();
        }
    } catch (error) {
        console.error('Error loading form elements:', error);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadSavedFormElements);

