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
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Form created Successfully!");
            // Refresh the forms table
            location.reload();
        } else {
            alert(data.message || "Something went wrong.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error);
    });
});

fetch("../backend/api/fetchforms.php")
.then(response => response.json())
.then(forms => {
    console.log('Fetched forms:', forms); // Debug output
    const tableBody = document.querySelector(".form-table__body");
    
    if (!tableBody) {
        console.error('Table body element not found');
        return;
    }

    tableBody.innerHTML = ''; // Clear existing rows
    
    if (forms && forms.length > 0) {
        forms.forEach(form => {
            const row = document.createElement('tr');
            row.dataset.formId = form.id;
            row.innerHTML = `
                <td>${form.id}</td>
                <td>${form.title}</td>
                <td>${form.description}</td>
            `;
            tableBody.appendChild(row);
        });

        // Add click handlers
        document.querySelectorAll('.form-table__body tr').forEach(row => {
            row.addEventListener('click', () => {
                const formId = row.dataset.formId;
                window.location.href = `../templates/createForm.php?formId=${formId}`;
            });
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="3">No forms found</td></tr>';
    }
})
.catch(error => {
    console.error('Error fetching forms:', error);
});