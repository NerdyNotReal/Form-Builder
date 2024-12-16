// Handle Sign-Up
document.getElementById("signupButton").addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirm_password", confirmPassword);

    fetch("signup.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => alert(data))
    .catch(error => console.error("Error:", error));
});

// Handle Login
document.getElementById("loginButton").addEventListener("click", () => {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    fetch("login.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes("Login successful!")) {
            alert("Welcome!");
            window.location.href = "dashboard.php"; // Redirect after successful login
        } else {
            alert(data);
        }
    })
    .catch(error => console.error("Error:", error));
});
