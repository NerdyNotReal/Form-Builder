const createFormBtn =  document.querySelector(".createForm");
const createFormPopup = document.querySelector('#createFormPopup');
const closepopupBtn = document.querySelector("#closepopupBtn");
const createForm = document.querySelector("#createForm");

createFormBtn.addEventListener('click', () => {
    createFormPopup.style.display = "block";
});

closepopupBtn.addEventListener("click", () => {
    createFormPopup.style.display = "none";
});

createForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formdata = new FormData(createForm);

    fetch("../backend/api/saveForm.php", {
        method: "POST", 
        body: formdata,
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Form created Successfully!");
            console.log(data);
            createFormPopup.style.display = "none";
        } else {
            alert("Something went wrong.");
        }
    })
    .catch(error => {
        alert('Error'+  error);
    });
})

fetch("../backend/api/fetchforms.php")
.then(response => {
    return response.json();
})
.then(data => {
    console.log(data);
    const tableBody = document.querySelector(".form-table__body")
    data.forEach(form => {
        const row = document.createElement('tr');
        row.dataset.formId = form.id;
        row.innerHTML = `
        <td>${form.id}</td>
        <td>${form.title}</td>
        <td>${form.description}</td>
        `;
        tableBody.appendChild(row);
    });

    // cickevent to redirect to creation page
    const forms = tableBody.querySelectorAll("tr");
    forms.forEach(form => {
        form.addEventListener('click', () => {
            const formId = form.dataset.formId;
            window.location.href = `../templates/createForm.php?formId=${formId}`;
        });
    });
})
.catch(error => {
    alert("Error fetching forms: " + error);
});