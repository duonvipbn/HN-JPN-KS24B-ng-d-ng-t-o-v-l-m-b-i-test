let dataName = "dataProject";
let dataLoginID = "saveLoginID";

localStorage[dataLoginID] = -1;

function getData() {
    return JSON.parse(localStorage.getItem(dataName)) || [];
}

function validate() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirmPassword").value.trim();

    let nameError = document.getElementById("nameError");
    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");
    let confirmPasswordError = document.getElementById("confirmPasswordError");
    let data = getData();
    if (name === "") {
        nameError.style.display = "block";
        return;
    } else {
        nameError.style.display = "none";
    }

    const regex = /^[a-zA-Z0-9]+@gmail\.com$/;

    if (!regex.test(email)) {
        emailError.innerHTML = "Email không hợp lệ.";
        emailError.style.display = "block";
        return;
    } else {
        emailError.style.display = "none";
    }

    
    for (let i = 0; i < data.length; i++){
        if (email === data[i].email) {
            emailError.innerHTML = "Email đã tồn tại!";
            emailError.style.display = "block";
            return;
        }
    }
    emailError.style.display = "none";
    if (password === "" || password.length < 8) {
        passwordError.style.display = "block";
        return;
    } else {
        passwordError.style.display = "none";
    }

    if (confirmPassword === "" || confirmPassword !== password) {
        confirmPasswordError.style.display = "block";
        return;
    } else {
        confirmPasswordError.style.display = "none";
    }
    // location.reload();
    let id;
    if (data.length === 0) {
        id = 1;
    } else {
        id = data[data.length - 1].id + 1;
    }
    let temp = {
        id,
        name,
        email,
        password,
        role: "user",
    };
    data.push(temp);
    localStorage[dataName] = JSON.stringify(data);
    localStorage[dataLoginID] = id;
    window.location.href = "../pages/dashboard.html";
}