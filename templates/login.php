<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>    
</head>
<body>
    <div class="container">
        <h2>Login</h2>
        
        <!-- Login form -->
        <form action="" method="POST" id="loginForm">
            <div>
                <label for="username">Username:</label>
                <input type="text" name="username" id="username" required placeholder="Enter your username">
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" name="password" id="password" required placeholder="Enter your password">
            </div>
            <button type="submit" name="submit">Login</button>
        </form>
        <p id="login_msg"></p>

        <p>Don't have an account? <a href="signup.html">Sign up here</a></p>
    </div>
</body>
</html>
