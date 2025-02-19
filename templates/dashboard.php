<?php
    session_start();
    include ('../backend/db.php');
    echo "id: ".$_SESSION['user_id'];
    $formId = $_GET['formId'];
    
    $sql = "SELECT title From forms where id = '$formId'";
    $result = mysqli_query($conn, $sql);
    $row = mysqli_fetch_assoc($result);
    

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
    <title>Dashboard</title>
    <?php include '../backend/link.php'; ?>
</head>
<body>
    <div class="quick-action">
        <!-- <button class="quick-action__close">&times;</button> -->
        <div class="quick-action__header">
            <h2 class="quick-action__title text-heading-large">Quick Actions</h2>
            <p class="quick-action__subtitle text-body-regular">Your one-stop spot to create, import, and explore forms effortlessly!</p>
        </div>
        <div class="cards">
            <div class="card createForm">
                <div class="card__icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                </div>
                <h3 class="card__title text-body-regular">Create New Form</h3>
            </div>
            <div class="card">
                <div class="card__icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z"/>
                    </svg>
                </div>
                <h3 class="card__title text-body-regular">Use Templates</h3>
            </div>
            <div class="card">
                <div class="card__icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                </div>
                <h3 class="card__title text-body-regular">Import Forms</h3>
            </div>
        </div>

    </div>


    <div class="popup" id="createFormPopup">
        <div class="popup-content">
            <span class="close-btn" id="closepopupBtn">&times;</span>
            <h2>Create New Form</h2>
            <form id="createForm">
                <label for="formTitle">Form Title</label>
                <input type="text" id="formTitle" name = "formTitle" class = "form__input" placeholder="Enter form title" required>

                <label for="formDescription">Form Description</label>
                <textarea id="formDescription" name = "formDescription" class = "form__input" placeholder="Enter form description"></textarea>

                <button type="submit" class="btn btn__primary">Create Form</button>
            </form>
        </div>
    </div>

    <div class="form-table" border = 1>
    <h3 class = "text-heading-large"></h3>
    <table id = "forms-table">
        <thead>
            <tr>
                <th>SN</th>
                <th>title</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody class = "form-table__body">
            <!--  -->
        </tbody>
    </table>
    </div>

    <form action="" method="post">
    <button type="submit" name="logout" class="logout-btn">Logout</button>
</form>

    <?php
    ?>

    <script src="../public/js/createForm.js" defer></script>
</body>
</html>
