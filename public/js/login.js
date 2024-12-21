document.querySelector('#loginForm').addEventListener("submit", (event) =>{
    event.preventDefault();

    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;

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
            loginMsg.innerText = data;
            window.location.href = "../templates/dashboard.php";
        } else {
            loginMsg.innerText = data;
        }
    })
    .catch(error => {
        console.log("ERROR");
    });
})