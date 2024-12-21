// Handle Sign-Up
document.querySelector("#signup").addEventListener("submit", (event => {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm_password").value;
    const terms = document.querySelector("#terms").checked;


    if (!terms) {
        alert("You must agree to the Terms of Service and Privacy Statement.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    

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
    .catch((error) => {
        alert("Something went wrong");
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
