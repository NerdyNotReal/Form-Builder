<?php
    session_start();
    include ('../backend/db.php');
    
    if (!isset($_SESSION['user_id'])) {
        header("Location: login.php");
        exit();
    }
    
    $userId = $_SESSION['user_id'];
    
    if (isset($_POST['logout'])) {
        session_unset();
        session_destroy();
        header("Location: login.php");
        exit();
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Workspaces - Dashboard</title>
    <?php include '../backend/link.php'; ?>
    <link rel="stylesheet" href="../public/css/dashboard.css">
</head>
<body>
    <div class="container">
        <nav class="dashboard-nav">
            <div class="dashboard-nav__user">
                <h1 class="text-heading-large">My Workspaces</h1>
                <form action="" method="post">
                    <button type="submit" name="logout" class="btn btn--secondary">Logout</button>
                </form>
            </div>
        </nav>

        <header class="dashboard-header">
            <div class="dashboard-header__content">
                <h2 class="dashboard-header__title text-heading-medium">Welcome to your workspaces</h2>
                <p class="dashboard-header__description text-body-regular">Create and manage your workspaces to organize your forms efficiently</p>
            </div>
        </header>

        <main class="dashboard-content">
            <div class="workspace-grid">
                <!-- Create Workspace Button Card -->
                <div class="workspace-card workspace-card--add" id="createWorkspaceBtn">
                    <div class="workspace-card__content">
                        <svg class="workspace-card__icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 8V40M8 24H40" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                        </svg>
                        <h3 class="workspace-card__title">Create New Workspace</h3>
                        <p class="workspace-card__text">Click to create a new workspace</p>
                    </div>
                </div>

                <!-- Loading state -->
                <div class="workspace-card workspace-card--loading">
                    <div class="workspace-card__content">
                        <p>Loading workspaces...</p>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Create Workspace Popup -->
    <div class="popup" id="createWorkspacePopup">
        <div class="popup__content">
            <span class="popup__close" id="closeWorkspacePopupBtn">&times;</span>
            <h2 class="popup__title">Create New Workspace</h2>
            <form id="createWorkspaceForm" class="form">
                <div class="form__group">
                    <label class="form__label" for="workspaceName">Workspace Name</label>
                    <input type="text" id="workspaceName" name="workspaceName" class="form__input" placeholder="Enter workspace name" required>
                </div>

                <div class="form__group">
                    <label class="form__label" for="workspaceDescription">Workspace Description</label>
                    <textarea id="workspaceDescription" name="workspaceDescription" class="form__input" placeholder="Enter workspace description"></textarea>
                </div>

                <div class="form__actions">
                    <button type="submit" class="btn btn--primary">Create Workspace</button>
                </div>
            </form>
        </div>
    </div>

    <script src="../public/js/dashboard.js"></script>
</body>
</html>
