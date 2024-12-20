// Handle Sign-Up
document.querySelector("#signup").addEventListener("submit", (event => {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm_password").value;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirm_password", confirmPassword);

    
    fetch("../backend/signup.php", {
        method: "POST",
        body: formData
    })
    .then (response => {
        console.log(response.status);
        return response.text();
    })
    .then(data => {
        alert(data);
    })
}));

// // Handle Login
// document.getElementById("loginButton").addEventListener("click", () => {
//     const username = document.getElementById("loginUsername").value;
//     const password = document.getElementById("loginPassword").value;

//     const formData = new FormData();
//     formData.append("username", username);
//     formData.append("password", password);

//     fetch("login.php", {
//         method: "POST",
//         body: formData
//     })
//     .then(response => response.text())
//     .then(data => {
//         if (data.includes("Login successful!")) {
//             alert("Welcome!");
//             window.location.href = "dashboard.php"; // Redirect after successful login
//         } else {
//             alert(data);
//         }
//     })
//     .catch(error => console.error("Error:", error));
// });
