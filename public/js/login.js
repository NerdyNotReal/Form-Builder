document.addEventListener("DOMContentLoaded", () => {
    const savedUsername = localStorage.getItem("rememberedUsername");
    const savedPassword = localStorage.getItem("rememberedPassword");

    if (savedUsername && savedPassword) {
        document.querySelector("#username").value = savedUsername;
        document.querySelector("#password").value = savedPassword;
        document.querySelector("#rememberMe").checked = true;
    }
    
});

// Add password toggle functionality
document.querySelector('.password-toggle').addEventListener('click', function() {
    const passwordInput = document.querySelector('#password');
    const eyeIcon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
});

document.querySelector('#loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let rememberMe = document.querySelector("#rememberMe").checked;

    let formdata = new FormData();
    formdata.append("username", username);
    formdata.append("password", password);

    fetch("../backend/login.php", {
        method: "POST",
        body: formdata
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network Response Error");
        }
        return response.text();
    })
    .then(data => {
        const loginMsg = document.querySelector("#login_msg");

        if (data.includes("Login successful!")) {
            if (rememberMe) {
                localStorage.setItem("rememberedUsername", username);
                localStorage.setItem("rememberedPassword", password);
            } else {
                localStorage.removeItem("rememberedUsername");
                localStorage.removeItem("rememberedPassword");
            }
            loginMsg.innerText = data;
            window.location.href = "../templates/dashboard.php";
        } else {
            loginMsg.innerText = data;
        }
    })
    .catch(error => {
        console.log("ERROR");
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");

    });
})