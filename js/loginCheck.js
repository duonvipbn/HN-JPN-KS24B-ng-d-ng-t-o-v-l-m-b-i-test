let dataLoginID = "saveLoginID";
let dataName = "dataProject";

function getLoginID() {
    return JSON.parse(localStorage.getItem(dataLoginID)) || -1;
}

function getData() {
    return JSON.parse(localStorage.getItem(dataName)) || [];
}

function checkLogin() {
    let loginID = getLoginID();

    if (loginID === -1) {
        window.location.href = "../pages/login.html";
        return;
    }
    
    // KIEM TRA ADMIN HAY USER

    // let data = getData();
    // for (let i = 0; i < data.length; i++) {
    //     if (data[i].id === loginID) {
    //         if (data[i].role === "admin") {
    //             return;
    //         } else {
    //             const path = window.location.pathname;

    //             if (path.endsWith("addProduct-manager.html") || path.endsWith("category-manager.html") || path.endsWith("product-manager.html")) {
    //                 window.location.href = "../pages/dashboard.html";
    //             }
    //             return;
    //         }
    //     }
    // }
}

checkLogin();
