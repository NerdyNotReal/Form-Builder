document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        formGrid: document.querySelector('.workspace__forms--grid'),
        workspaceTitle: document.querySelector('.workspace__header--title'),
        createFormPopup: document.querySelector('#createFormPopup'),
        createFormBtn: document.querySelector('#createFormBtn'),
        closeFormPopupBtn: document.querySelector('#closeFormPopupBtn'),
        createFormForm: document.querySelector('#createFormForm')
    };

    const workspaceId = new URLSearchParams(window.location.search).get('id');

    if (!workspaceId) {
        window.location.href = 'dashboard.php';
        return;
    }

    // Event handling
    elements.createFormBtn.addEventListener('click', () => {
        elements.createFormPopup.style.display = 'block';
    });

    elements.closeFormPopupBtn.addEventListener('click', () => {
        elements.createFormPopup.style.display = 'none';
    });

    elements.createFormForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(elements.createFormForm);
        formData.append('workspaceId', workspaceId);

        fetch('../backend/api/create_form.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                elements.createFormPopup.style.display = 'none';
                elements.createFormForm.reset();
                loadWorkspaceData();
            } else {
                throw new Error(result.error || 'Failed to create form');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || 'Failed to create form');
        });
    });

    function createFormCard(form) {
        return `
            <div class="workspace__form-card" data-form-id="${form.id}">
                <div class="workspace__form-card-content">
                    <h3 class="text-heading-medium">${form.title}</h3>
                    <p class="text-body-regular text-neutral-50">${form.description || 'No description'}</p>
                    <div class="workspace__form-card-footer">
                        <div class="workspace__form-card-meta">
                            <span class="text-body-small text-neutral-50">${new Date(form.created_at).toLocaleDateString()}</span>
                            <span class="form-status form-status--${form.status}">${form.status}</span>
                        </div>
                        <a href="form.php?id=${form.id}" class="btn btn--primary text-body-small">Open Form</a>
                    </div>
                </div>
            </div>
        `;
    }

    function showLoading() {
        elements.formGrid.innerHTML = Array(6).fill(`
            <div class="workspace__form-card workspace__form-card--loading workspace__form-card--skeleton">
                <div class="workspace__form-card-content">
                    <div class="skeleton-text"></div>
                    <div class="skeleton-text"></div>
                </div>
            </div>
        `).join('');
    }

    function loadWorkspaceData() {
        showLoading();
        
        fetch(`../backend/api/get_workspace.php?id=${workspaceId}`)
            .then(response => response.json())
            .then(data => {
                // Add small delay to show loading animation
                setTimeout(() => {
                    if (!data.success) {
                        throw new Error(data.error || 'Failed to load workspace');
                    }
                    
                    // Update workspace title
                    elements.workspaceTitle.textContent = data.workspace.name;
                    document.title = `${data.workspace.name} - Workspace`;
                    
                    // Populate forms grid
                    if (data.forms && data.forms.length > 0) {
                        let formsHtml = '';
                        for (let i = 0; i < data.forms.length; i++) {
                            formsHtml += createFormCard(data.forms[i]);
                        }
                        elements.formGrid.innerHTML = formsHtml;
                    } else {
                        elements.formGrid.innerHTML = `
                            <div class="workspace__form-card workspace__form-card--empty">
                                <div class="workspace__form-card-content">
                                    <p class="text-body-regular text-neutral-50">No forms found. Create your first form!</p>
                                </div>
                            </div>
                        `;
                    }
                }, 800);
            })
            .catch(error => {
                console.error('Error:', error);
                elements.formGrid.innerHTML = `
                    <div class="workspace__form-card workspace__form-card--error">
                        <div class="workspace__form-card-content">
                            <p class="text-body-regular text-semantic-red">Failed to load workspace data. Please try again later.</p>
                        </div>
                    </div>
                `;
            });
    }

    // Initial load
    loadWorkspaceData();
});