<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Authentication</title>
    <?php include '../backend/link.php'; ?>

</head>
<body>
    <h2>Sign Up</h2>
    <form id="signupForm">
        <input type="text" id="username" placeholder="Username" required>
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Password" required>
        <input type="password" id="confirmPassword" placeholder="Confirm Password" required>
        <button type="button" id="signupButton">Sign Up</button>
    </form>
    
    <h2>Login</h2>
    <form id="loginForm">
        <input type="text" id="loginUsername" placeholder="Username" required>
        <input type="password" id="loginPassword" placeholder="Password" required>
        <button type="button" id="loginButton">Login</button>
    </form>

    <script src="script.js"></script>
</body>
</html>
