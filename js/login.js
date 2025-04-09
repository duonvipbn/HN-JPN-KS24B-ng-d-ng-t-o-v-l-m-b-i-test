let dataName = "dataProject";
let dataLoginID = "saveLoginID";

localStorage[dataLoginID] = -1;

function getData() {
    return JSON.parse(localStorage.getItem(dataName)) || [];
}

function validate() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let errorSecret = document.getElementById("errorSecret");

    let data = getData();
    let emailIndex = -1;

    for (let i = 0; i < data.length; i++) {
        if (email === data[i].email) {
            emailIndex = i;
            break;
        }
    }
    if (emailIndex === -1) {
        errorSecret.style.display = "block";
        return;
    } else {
        errorSecret.style.display = "none";
    }

    if (password !== data[emailIndex].password) {
        errorSecret.style.display = "block";
        return;
    } else {
        errorSecret.style.display = "none";
    }

    localStorage[dataLoginID] = JSON.stringify(data[emailIndex].id);
    
    if (data[emailIndex].role === "admin") {
        window.location.href = "../pages/category-manager.html";
    } else {
        window.location.href = "../pages/dashboard.html";
    }
}