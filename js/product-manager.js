let dataProductName = "dataProduct";
// let dataName = "dataProject";
let dataCategoryName = "dataCategory";

let overlay = document.getElementById("overlay");
let deleteGui = document.getElementById("deleteGui");
let tableList = document.getElementById("tableList");
let pageList = document.getElementById("pageList");

let selectIndexDelete = -1;
let page = 1;
let pageSpace = 8;

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
    return JSON.parse(localStorage.getItem(dataProductName)) || [];
}

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
    render();
};

function render() {
    let dataProduct = getDataProduct();

    let totalPage = Math.ceil(dataProduct.length / pageSpace);
    let start = (page - 1) * pageSpace;
    let end = page * pageSpace;

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
    for (let i = start; i < end; i++) {
        if (i >= dataProduct.length) break;
        message += `
                <tr>
                    <td class="idTable">${dataProduct[i].id}</td>
                    <td class="nameTable">${dataProduct[i].testName}</td>
                    <td class="typeTable">${getEmoji(dataProduct[i].categoryId)}</td>
                    <td class="numQuestTable">${dataProduct[i].questions.length}</td>
                    <td class="timeTable">${dataProduct[i].playerTime} min</td>
                    <td class="statusTable"><button class="fixButton">Sửa</button><button class="delButton" onclick="openDelItem(${i})">Xóa</button></td>
                </tr>
        `;
    }
    tableList.innerHTML = message;

    let buttonMessage = `<button class="paginationButton" onclick="newTabs(${page - 1})" ${page === 1 || dataProduct.length === 0 ? "disabled" : ""}>&lt;</button>`;
    for (let i = 1; i <= totalPage; i++) {
        buttonMessage += `<button class="paginationButton" onclick="newTabs(${i})" ${page === i ? "disabled" : ""}>${i}</button>`;
    }
    buttonMessage += `<button class="paginationButton" onclick="newTabs(${page + 1})" ${page === totalPage || dataProduct.length === 0 ? "disabled" : ""}>&gt;</button>`;

    pageList.innerHTML = buttonMessage;
}

function closeDeleteItem() {
    overlay.style.display = "none";
    deleteGui.style.display = "none";
}

function openDelItem(index) {
    selectIndexDelete = index;
    overlay.style.display = "block";
    deleteGui.style.display = "block";
}

function delProductManager() {
    if (selectIndexDelete !== -1) {

        let dataProduct = getDataProduct();
        dataProduct.splice(selectIndexDelete, 1);
        localStorage[dataProductName] = JSON.stringify(dataProduct);
        
        selectIndexDelete = -1;
        closeDeleteItem();
        render();
    }
}

render();