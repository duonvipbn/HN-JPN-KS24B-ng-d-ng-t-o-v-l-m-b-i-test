let dataProductName = "dataProduct";
// let dataName = "dataProject";
let dataCategoryName = "dataCategory";
let saveIDFixItemName = "saveIDFixItem";

let overlay = document.getElementById("overlay");
let deleteGui = document.getElementById("deleteGui");
let tableList = document.getElementById("tableList");
let pageList = document.getElementById("pageList");
let inputFindItemName = document.getElementById("inputFindItemName");
let sort = document.getElementById("sort");

let selectIDDelete = -1;
let page = 1;
let pageSpace = 8;

localStorage.setItem(saveIDFixItemName, -1);

// let aProduct = {
//     id,
//     testName,
//     categoryId,
//     playerTime,
//     playAmount,
//     questions,
// };

// function getData() {
//     return JSON.parse(localStorage.getItem(dataName)) || [];
// }

function getDataCategory() {
    return JSON.parse(localStorage.getItem(dataCategoryName)) || [];
}

function getDataProduct() {
    return JSON.parse(localStorage.getItem(dataProductName)) || [{ "id": 1, "testName": "Hóa học cơ bản", "categoryId": 1, "playerTime": 12, "playAmount": 0, "questions": [{ "content": "H2 +O2 =", "answers": [{ "answer": "hehe", "isCorrected": false }, { "answer": "hoho", "isCorrected": false }, { "answer": "haha", "isCorrected": false }, { "answer": "H2O", "isCorrected": true }] }, { "content": "Chất X có công thức phân tử C3H6O2, là este của axit axetic", "answers": [{ "answer": "C2H5COOH.", "isCorrected": false }, { "answer": "HO-C2H4-CHO.", "isCorrected": false }, { "answer": "CH3COOCH3", "isCorrected": true }, { "answer": "HCOOC2H5.", "isCorrected": false }] }] }];
}

localStorage[dataProductName] = JSON.stringify(getDataProduct());

function teleport() {
    window.location.href = "../pages/addProduct-manager.html";
}

function getEmoji(categoryId) {
    let dataCategory = getDataCategory();
    for (let i = 0; i < dataCategory.length; i++) {
        if (categoryId === dataCategory[i].id) {
            return `${dataCategory[i].categoryEmoji} ${dataCategory[i].categoryName}`;
        }
    }
}

function newTabs(numberPage) {
    page = numberPage;
        if (sort.value === "name") {
            render("select", sort.value);
        } else if (sort.value === "timePlay") {
            render("select", sort.value);
        } else {
            render();
        }
    
};

function render(mode, value) {
    let dataProduct = getDataProduct();
    let dataShow = [];
    let message = `
                <tr>
                    <th class="idTable">ID</th>
                    <th class="nameTable">Tên bài test</th>
                    <th class="typeTable">Danh mục</th>
                    <th class="numQuestTable">Số câu hỏi</th>
                    <th class="timeTable">Thời gian</th>
                    <th class="statusTable">Hành động</th>
                </tr>
    `;

    if (mode === "search") {
        let search = inputFindItemName.value.trim();
        sort.value = 'nothing';
        for (let i = 0; i < dataProduct.length; i++) {
            if (dataProduct[i].testName.toLowerCase().includes(search.toLowerCase())) {
                dataShow.push(dataProduct[i]);
            }
        }
    } else if (mode === "select" && value && value !== "nothing") {
        inputFindItemName.value = "";
        if (value === "name") {
            for (let i = 0; i < dataProduct.length - 1; i++) {
                for (let j = 0; j < dataProduct.length - 1 - i; j++) {
                    if (dataProduct[j].testName < dataProduct[j + 1].testName) {
                        let temp = dataProduct[j];
                        dataProduct[j] = dataProduct[j + 1];
                        dataProduct[j + 1] = temp;
                    }
                }
            }
        } else if (value === "timePlay") {
            for (let i = 0; i < dataProduct.length - 1; i++) {
                for (let j = 0; j < dataProduct.length - 1 - i; j++) {
                    if (dataProduct[j].playerTime < dataProduct[j + 1].playerTime) {
                        let temp = dataProduct[j];
                        dataProduct[j] = dataProduct[j + 1];
                        dataProduct[j + 1] = temp;
                    }
                }
            }
        }
        dataShow = dataProduct;
    } else {
        dataShow = dataProduct;
    }

    let totalPage = Math.ceil(dataShow.length / pageSpace);
    let start = (page - 1) * pageSpace;
    let end = page * pageSpace;

    for (let i = start; i < end; i++) {
        if (i >= dataShow.length) break;
        message += `
                <tr>
                    <td class="idTable">${dataShow[i].id}</td>
                    <td class="nameTable">${dataShow[i].testName}</td>
                    <td class="typeTable">${getEmoji(dataShow[i].categoryId)}</td>
                    <td class="numQuestTable">${dataShow[i].questions.length}</td>
                    <td class="timeTable">${dataShow[i].playerTime} min</td>
                    <td class="statusTable"><button class="fixButton" onclick="openFixItem(${dataShow[i].id})">Sửa</button><button class="delButton" onclick="openDelItem(${dataShow[i].id})">Xóa</button></td>
                </tr>
        `;
    }
    tableList.innerHTML = message;

    let buttonMessage = `<button class="paginationButton" onclick="newTabs(${page - 1})" ${page === 1 || dataShow.length === 0 ? "disabled" : ""}>&lt;</button>`;
    for (let i = 1; i <= totalPage; i++) {
        buttonMessage += `<button class="paginationButton" onclick="newTabs(${i})" ${page === i ? "disabled" : ""}>${i}</button>`;
    }
    buttonMessage += `<button class="paginationButton" onclick="newTabs(${page + 1})" ${page === totalPage || dataShow.length === 0 ? "disabled" : ""}>&gt;</button>`;

    pageList.innerHTML = buttonMessage;
}

function closeDeleteItem() {
    overlay.style.display = "none";
    deleteGui.style.display = "none";
}

function openDelItem(id) {
    selectIDDelete = id;
    overlay.style.display = "block";
    deleteGui.style.display = "block";
}

function delProductManager() {
    if (selectIDDelete !== -1) {  
        let dataProduct = getDataProduct();

        for (let i = 0; i < dataProduct.length; i++){
            if (dataProduct[i].id === selectIDDelete) {
                dataProduct.splice(i, 1);
                localStorage[dataProductName] = JSON.stringify(dataProduct);
                break;
            }
        }
        
        selectIDDelete = -1;
        inputFindItemName.value = "";
        closeDeleteItem();
        render();
    }
}

function openFixItem(id) {
    localStorage.setItem(saveIDFixItemName, id);
    window.location.href = "../pages/addProduct-manager.html";
}
render();