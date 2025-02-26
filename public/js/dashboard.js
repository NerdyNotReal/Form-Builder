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
            <div class="workspace-card" data-id="${workspace.id}">
                <div class="workspace-card__content">
                    <div class="workspace-card__header">
                        <div class="workspace-card__icon">
                            <i class="fa-regular fa-folder"></i>
                        </div>
                        <h3 class="workspace-card__title">${workspace.name}</h3>
                        <span class="workspace-card__form-count">
                            <i class="fa-regular fa-file-lines"></i>
                            ${workspace.form_count || 0} forms
                        </span>
                    </div>
                    <div class="workspace-card__forms">
                        ${workspace.form_count > 2 ? `
                        <span class="workspace-card__extra-forms">+${workspace.form_count - 2} more</span>
                        ` : ''}
                    </div>
                    <div class="workspace-card__actions">
                        <a href="workspace.php?id=${workspace.id}" class="workspace-card__action" data-action="open">
                            <i class="fa-solid fa-arrow-right"></i>
                            Open
                        </a>
                        <button class="workspace-card__action" data-action="edit" data-id="${workspace.id}" data-name="${workspace.name}">
                            <i class="fa-regular fa-pen-to-square"></i>
                            Edit
                        </button>
                        <button class="workspace-card__action workspace-card__action--danger" data-action="delete" data-id="${workspace.id}">
                            <i class="fa-regular fa-trash-can"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Add event handlers for workspace options
    function editWorkspace(id, name) {
        // Show edit popup
        const editWorkspacePopup = document.querySelector('#editWorkspacePopup');
        const editWorkspaceForm = document.querySelector('#editWorkspaceForm');
        const workspaceNameInput = editWorkspaceForm.querySelector('input[name="name"]');
        
        workspaceNameInput.value = name;
        editWorkspacePopup.style.display = 'block';
        
        editWorkspaceForm.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(editWorkspaceForm);
            formData.append('id', id);

            fetch('../backend/api/update_workspace.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    editWorkspacePopup.style.display = 'none';
                    loadWorkspaces();
                } else {
                    throw new Error(result.error || 'Failed to update workspace');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message || 'Failed to update workspace');
            });
        };
    }

    function deleteWorkspace(id) {
        if (confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
            fetch('../backend/api/delete_workspace.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    loadWorkspaces();
                } else {
                    throw new Error(result.error || 'Failed to delete workspace');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message || 'Failed to delete workspace');
            });
        }
    }

    // Add click event listener for menu buttons
    document.addEventListener('click', function(event) {
        const dropdowns = document.querySelectorAll('.workspace-card__dropdown');
        dropdowns.forEach(dropdown => {
            if (!event.target.closest('.workspace-card__options')) {
                dropdown.classList.remove('active');
            }
        });
    });

    // Add click handler for workspace cards
    document.addEventListener('click', function(event) {
        const workspaceCard = event.target.closest('.workspace-card');
        if (workspaceCard) {
            const workspaceId = workspaceCard.dataset.id;
            window.location.href = `workspace.php?id=${workspaceId}`;
        }
    });

    function createLoadingCard() {
        return `
            <div class="workspace-card--loading">
                <div class="workspace-card__content">
                    <div class="loading-cover loading-shimmer"></div>
                    <div class="loading-title loading-shimmer"></div>
                    <div class="loading-id loading-shimmer"></div>
                </div>
            </div>
        `;
    }

    // Add click event listeners after workspace cards are loaded
    function addWorkspaceCardListeners() {
        // Add click handlers for actions
        document.querySelectorAll('.workspace-card__actions').forEach(actionContainer => {
            actionContainer.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click when clicking actions
                const actionButton = e.target.closest('.workspace-card__action');
                if (!actionButton) return;

                const action = actionButton.dataset.action;
                const id = actionButton.dataset.id;
                const name = actionButton.dataset.name;

                if (action === 'edit') {
                    editWorkspace(id, name);
                } else if (action === 'delete') {
                    deleteWorkspace(id);
                }
            });
        });

        // Add click handler for workspace cards
        document.querySelectorAll('.workspace-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.workspace-card__actions')) {
                    const workspaceId = card.dataset.id;
                    window.location.href = `workspace.php?id=${workspaceId}`;
                }
            });
        });
    }

    function loadWorkspaces() {
        // Show loading state first
        let loadingHtml = `
            <div class="workspace-card--add" id="createWorkspaceBtn">
                <svg class="workspace-card__icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 8V40M8 24H40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                </svg>
                <h3 class="workspace-card__title">Create Workspace</h3>
                <p class="workspace-card__text">Start a new workspace</p>
            </div>
        `;
        
        for (let i = 0; i < 8; i++) {
            loadingHtml += createLoadingCard();
        }
        elements.workspaceGrid.innerHTML = loadingHtml;

        fetch('../backend/api/get_workspaces.php')
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    let workspacesHtml = `
                        <div class="workspace-card--add" id="createWorkspaceBtn">
                            <svg class="workspace-card__icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 8V40M8 24H40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                            </svg>
                            <h3 class="workspace-card__title">Create Workspace</h3>
                            <p class="workspace-card__text">Start a new workspace</p>
                        </div>
                    `;

                    if (data.workspaces && data.workspaces.length > 0) {
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
                    
                    // Add event listeners to workspace cards
                    addWorkspaceCardListeners();
                    
                    // Reattach event listener to new create button
                    document.querySelector('#createWorkspaceBtn').addEventListener('click', () => {
                        elements.createWorkspacePopup.style.display = 'block';
                    });
                }, 1000);
            })
            .catch(error => {
                console.error('Error:', error);
                elements.workspaceGrid.innerHTML = `
                    <div class="workspace-card--add" id="createWorkspaceBtn">
                        <svg class="workspace-card__icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 8V40M8 24H40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                        </svg>
                        <h3 class="workspace-card__title">Create Workspace</h3>
                        <p class="workspace-card__text">Start a new workspace</p>
                    </div>
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