<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <?php include '../backend/link.php'; ?>
</head>
<body>

    <div class="login-container">
        <div class="login">
            <div class="login__header">
                <h2 class="login__header--title text-heading-medium">Login to Your Account</h2>
                <p class="login__header--info text-body-regular">Don't have an account? <a href="signup.php">Create one</a></p>
                <div class="divider"></div>
            </div>
        
            <!-- Login form -->
            <form class="login__form" id="loginForm" autocomplete = "on">
                <div class="login__field">
                    <label for="username" class="text-body-regular">Username:</label>
                    <input type="text" name="username" id="username" class="login__input" required placeholder="Enter your username">
                </div>
                <!-- <div class="login__field">
                    <label for="email" class="login__label text-body-regular">Email:</label>
                    <input type="email" name="email" id="email" class="login__input" required placeholder="Enter your email">
                </div> -->
                <div class="login__field">
                    <label for="password" class="text-body-regular">Password:</label>
                    <input type="password" name="password" id="password" class="login__input" required placeholder="Enter your password">
                </div>
                <p id="login_msg" class="text-body-small" style="color: red;"></p>

                <div class="login__submit">
                    
                    <button type="submit" name="submit" class="btn btn__primary">Login</button>
                </div>
            </form>

        </div>
        <div class="hero-image">
        </div>
    </div>

    <script src="../public/js/login.js" defer></script>
</body>
</html>
