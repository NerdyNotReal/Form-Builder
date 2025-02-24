document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        workspaceGrid: document.querySelector('.workspace-grid'),
        createWorkspaceBtn: document.querySelector('#createWorkspaceBtn'),
        createWorkspacePopup: document.querySelector('#createWorkspacePopup'),
        closeWorkspacePopupBtn: document.querySelector('#closeWorkspacePopupBtn'),
        createWorkspaceForm: document.querySelector('#createWorkspaceForm')
    };

    // Show/hide workspace creation popup
    elements.createWorkspaceBtn.addEventListener('click', () => {
        elements.createWorkspacePopup.style.display = 'block';
    });

    elements.closeWorkspacePopupBtn.addEventListener('click', () => {
        elements.createWorkspacePopup.style.display = 'none';
    });

    // Handle workspace creation
    elements.createWorkspaceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(elements.createWorkspaceForm);

        fetch('../backend/api/create_workspace.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                elements.createWorkspacePopup.style.display = 'none';
                elements.createWorkspaceForm.reset();
                loadWorkspaces();
            } else {
                throw new Error(result.error || 'Failed to create workspace');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error.message || 'Failed to create workspace');
        });
    });

    function createWorkspaceCard(workspace) {
        return `
            <div class="workspace-card">
                <div class="workspace-card__content">
                    <p class="text-body-small text-neutral-50">Workspace ID: ${workspace.id}</p>
                    <h3 class="workspace-card__title text-heading-large">${workspace.name}</h3>
                    <p class="workspace-card__description text-body-regular">${workspace.description || 'No description'}</p>
                    <div class="workspace-card__button">
                        <a href="workspace.php?id=${workspace.id}" class="btn btn--primary text-body-medium">Open Workspace</a>
                    </div>
                </div>
            </div>
        `;
    }

    function loadWorkspaces() {
        fetch('../backend/api/get_workspaces.php')
            .then(response => response.json())
            .then(data => {
                // Add small delay to show loading animation
                setTimeout(() => {
                    let workspacesHtml = `
                        <div class="workspace-card workspace-card--add" id="createWorkspaceBtn">
                            <div class="workspace-card__content">
                                <svg class="workspace-card__icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M24 8V40M8 24H40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                                </svg>
                                <h3 class="workspace-card__title">Create New Workspace</h3>
                                <p class="workspace-card__text">Click to create a new workspace</p>
                            </div>
                        </div>
                    `;

                    if (data.workspaces && data.workspaces.length > 0) {
                        // Using for loop instead of map
                        for (let i = 0; i < data.workspaces.length; i++) {
                            workspacesHtml += createWorkspaceCard(data.workspaces[i]);
                        }
                    } else {
                        workspacesHtml += `
                            <div class="workspace-card workspace-card--empty">
                                <div class="workspace-card__content">
                                    <p>No workspaces found. Create your first workspace!</p>
                                </div>
                            </div>
                        `;
                    }

                    elements.workspaceGrid.innerHTML = workspacesHtml;
                    
                    // Reattach event listener to new create button
                    document.querySelector('#createWorkspaceBtn').addEventListener('click', () => {
                        elements.createWorkspacePopup.style.display = 'block';
                    });
                }, 1000);
            })
            .catch(error => {
                console.error('Error:', error);
                elements.workspaceGrid.innerHTML = `
                    <div class="workspace-card workspace-card--error">
                        <div class="workspace-card__content">
                            <p>Failed to load workspaces. Please try again later.</p>
                        </div>
                    </div>
                `;
            });
    }

    // Initial load
    loadWorkspaces();
}); 