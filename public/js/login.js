// document.querySelector('#loginForm').addEventListener("submit", (event) =>{
//     event.preventDefault();

//     let username = document.querySelector("#username").value;
//     let password = document.querySelector("#password").value;

//     let formdata = new FormData();
//     formdata.append("username", username);
//     formdata.append("password", password);

//     fetch("../login.php", {
//         method: "POST",
//         body: formdata
//     })
//     .then(Response => {
//         return Response.text();
//     })
//     .then(data => {
//         if (data.includes("Login successful!")) {
//             document.querySelector('#login_msg').innerText = data;
//         }
//     })
//     .catch(error => {
//         console.log("ERROR");
//     });
// })