<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup</title>
</head>
<body>
    <div class="container">
        <h2>Signup</h2>
        
        <!-- Signup form -->
        <form id="signup">
            <div>
                <label for="username">Username:</label>
                <input type="text" name="username" id="username" required placeholder="Enter your username">
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" name="email" id="email" required placeholder="Enter your email">
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" name="password" id="password" required placeholder="Enter your password">
            </div>
            <div>
                <label for="confirm_password">Confirm Password:</label>
                <input type="password" name="confirm_password" id="confirm_password" required placeholder="Enter your password">
            </div>
            <button type="submit" name="submit">Signup</button>
        </form>

        <p>Already have an account? <a href="login.html">Login here</a></p>
    </div>

    <script src="../public/js/signup.js"></script>
</body>
</html>
