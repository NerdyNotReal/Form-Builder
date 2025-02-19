// Handle Sign-Up
document.querySelector("#signup").addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm_password").value;
    const terms = document.querySelector("#terms").checked;

    // validation i fronted section
    if (!terms) {
        alert("You must agree to the Terms of Service and Privacy Statement.");
        return;
    }

    //username validation
    if (!/^[a-zA-Z][a-zA-Z0-9._]+[a-zA-Z0-9]$/.test(username)) {
        alert("Username must start with a letter and can only contain letters, numbers, dots, and underscores.");
        return;
    }

    if (username.length < 3 || username.length > 20) {
        alert("Username must be between 3 and 20 characters.");
        return;
    }

    if (/[._]{2,}/.test(username)) {
        alert("Username can't have two or more dots or underscores in a row.");
        return;
    }


    // password validation
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
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
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
        }
        else {
            console.log(data);
            alert(data.message);
        }

    })
    .catch((error) => {
        alert("An error occurred. Please try again.");
    });
});
