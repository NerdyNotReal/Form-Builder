// Function to create preview modal
function createPreviewModal() {
    const modal = document.createElement('div');
    modal.className = 'preview-modal';
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-modal-header">
                <h2>Form Preview</h2>
                <button onclick="closePreviewModal()" class="close-btn">×</button>
            </div>
            <div class="preview-modal-body">
                <form id="preview-form" class="preview-form"></form>
            </div>
        </div>
    `;
    return modal;
}

// Function to render preview form
function renderPreviewForm() {
    const formCanvas = document.getElementById('form-canvas');
    const previewForm = document.getElementById('preview-form');
    
    // Clear previous preview
    previewForm.innerHTML = '';
    
    // Add form title if exists
    const formTitle = document.querySelector('.form-title');
    if (formTitle) {
        const titleElement = document.createElement('h1');
        titleElement.textContent = formTitle.textContent;
        titleElement.className = 'preview-form-title';
        previewForm.appendChild(titleElement);
    }
    
    // Clone all form elements from canvas
    const formElements = formCanvas.querySelectorAll('.canvas__item');
    console.log('Found form elements:', formElements.length);

    if (formElements.length === 0) {
        // Show a message if no form elements exist
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No form elements added yet. Add some elements to preview the form.';
        emptyMessage.className = 'preview-empty-message';
        previewForm.appendChild(emptyMessage);
        return;
    }

    formElements.forEach((element, index) => {
        console.log('Processing element:', index);
        
        const formGroup = document.createElement('div');
        formGroup.className = 'preview-form-group';
        
        // Get the main form question div - updated selector
        const questionDiv = element.querySelector('div[class*="text-body-medium"]');
        console.log('Question div found:', !!questionDiv);
        
        if (!questionDiv) return;

        // Get label
        const label = questionDiv.querySelector('label');
        console.log('Label found:', !!label);
        
        if (label) {
            const newLabel = document.createElement('label');
            newLabel.textContent = label.textContent;
            newLabel.className = 'preview-label';
            formGroup.appendChild(newLabel);
        }

        // Get input/select/textarea and clone it
        const input = questionDiv.querySelector('input, select, textarea');
        console.log('Input found:', !!input);
        
        if (input) {
            // For radio buttons and checkboxes
            if (input.type === 'radio' || input.type === 'checkbox') {
                const wrapper = questionDiv.querySelector('.radio-group, div[style*="display: flex"]');
                if (wrapper) {
                    const newWrapper = wrapper.cloneNode(true);
                    // Ensure all inputs in the wrapper are enabled
                    newWrapper.querySelectorAll('input').forEach(inp => {
                        inp.removeAttribute('disabled');
                    });
                    newWrapper.className = input.type === 'radio' ? 'preview-radio-group' : 'preview-checkbox-group';
                    formGroup.appendChild(newWrapper);
                }
            } else {
                const newInput = input.cloneNode(true);
                newInput.removeAttribute('disabled');
                newInput.className = 'preview-input';
                if (input.type === 'text') {
                    newInput.placeholder = input.placeholder || 'Enter your answer';
                }
                formGroup.appendChild(newInput);
            }
        }

        // Get description if exists
        const description = questionDiv.querySelector('.field-description');
        if (description && description.textContent.trim() !== 'Form Description Goes Here!') {
            const newDescription = document.createElement('p');
            newDescription.textContent = description.textContent;
            newDescription.className = 'preview-description';
            formGroup.appendChild(newDescription);
        }

        previewForm.appendChild(formGroup);
    });

    // Add a submit button at the bottom
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.className = 'preview-submit-button';
    submitButton.textContent = 'Submit';
    submitButton.onclick = function(e) {
        e.preventDefault();
        alert('This is just a preview. Form submission is disabled.');
    };
    previewForm.appendChild(submitButton);

    // Prevent form submission
    previewForm.onsubmit = function(e) {
        e.preventDefault();
        return false;
    };
}

// Function to show preview modal
function previewForm() {
    // Create modal if it doesn't exist
    let modal = document.querySelector('.preview-modal');
    if (!modal) {
        modal = createPreviewModal();
        document.body.appendChild(modal);
    }
    
    // Show modal
    modal.style.display = 'block';
    
    // Render preview form
    renderPreviewForm();
}

// Function to close preview modal
function closePreviewModal() {
    const modal = document.querySelector('.preview-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Add styles for preview modal
const styles = `
.preview-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.preview-modal-content {
    position: relative;
    background-color: var(--color-neutrals-94);
    margin: 2% auto;
    padding: 0;
    width: 90%;
    max-width: 640px;
    border-radius: 8px;
    max-height: 90vh;
    overflow-y: auto;
}

.preview-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid var(--color-neutrals-16);
    background-color: var(--color-primary-94);
    border-radius: 8px 8px 0 0;
}

.preview-modal-header h2 {
    color: var(--color-primary-52);
}

.preview-form-title {
    font-size: 32px;
    color: var(--color-neutrals-2);
    margin: 0 0 8px 0;
    padding: 0;
    font-weight: 400;
}

.preview-empty-message {
    text-align: center;
    color: var(--color-neutrals-50);
    padding: 40px 20px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--color-neutrals-50);
}

.close-btn:hover {
    color: var(--color-neutrals-16);
}

.preview-modal-body {
    padding: 24px;
    background: var(--color-neutrals-94);
}

.preview-form {
    max-width: 100%;
    margin: 0 auto;
}

.preview-form-group {
    margin-bottom: 24px;
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    border: 1px solid var(--color-neutrals-16);
    transition: box-shadow 0.2s ease;
}

.preview-form-group:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.preview-label {
    display: block;
    font-size: 16px;
    color: var(--color-neutrals-2);
    margin-bottom: 8px;
    font-weight: 500;
}

.preview-input {
    width: 100%;
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid var(--color-neutrals-16);
    border-radius: 4px;
    background-color: #fff;
    color: var(--color-neutrals-2);
}

.preview-input:focus {
    outline: none;
    border-color: var(--color-primary-52);
    box-shadow: 0 0 0 2px var(--color-primary-94);
}

.preview-description {
    margin-top: 8px;
    font-size: 12px;
    color: var(--color-neutrals-50);
}

.preview-radio-group,
.preview-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.preview-radio-group label,
.preview-checkbox-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-neutrals-2);
    font-size: 14px;
    cursor: pointer;
}

.preview-form select {
    width: 100%;
    padding: 8px 12px;
    font-size: 14px;
    border: 1px solid var(--color-neutrals-16);
    border-radius: 4px;
    background-color: #fff;
    color: var(--color-neutrals-2);
}

.preview-form textarea {
    width: 100%;
    min-height: 120px;
    padding: 12px;
    font-size: 14px;
    border: 1px solid var(--color-neutrals-16);
    border-radius: 4px;
    resize: vertical;
}

.preview-submit-button {
    display: inline-block;
    padding: 10px 24px;
    background-color: var(--color-primary-52);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.preview-submit-button:hover {
    background-color: var(--color-primary-86);
}

/* Required field indicator */
.preview-label.required:after {
    content: "*";
    color: var(--color-sementic-red);
    margin-left: 4px;
}
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet); 