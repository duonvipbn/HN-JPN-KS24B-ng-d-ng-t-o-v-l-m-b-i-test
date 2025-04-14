let dataProductName = "dataProduct";
let dataCategoryName = "dataCategory";
let saveDoTestIdName = "saveDoTestId";

let list = document.getElementById("list");
let pageList = document.getElementById("pageList");
let sortUp = document.getElementById("sortUp");
let sortDown = document.getElementById("sortDown");

let page = 1;
let pageSpace = 8;

localStorage.setItem(saveDoTestIdName, -1);

function getDataProduct() {
    return JSON.parse(localStorage.getItem(dataProductName)) || [];
}
localStorage[dataProductName] = JSON.stringify(getDataProduct());

function getDataCategory() {
    return JSON.parse(localStorage.getItem(dataCategoryName)) || [];
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

function render(modeSort) {
    let dataProduct = getDataProduct();

    let message = ``;

    if (modeSort === "low") {
        sortUp.classList.remove("sortButtonSelect");
        sortDown.classList.add("sortButtonSelect");

        for (let i = 0; i < dataProduct.length - 1; i++){
            for (let j = 0; j < dataProduct.length - 1 - i; j++){
                if (dataProduct[j].playAmount > dataProduct[j+1].playAmount) {
                    let temp = dataProduct[j];
                    dataProduct[j] = dataProduct[j + 1];
                    dataProduct[j + 1] = temp;
                }
            }
        }
    } else {
        sortUp.classList.add("sortButtonSelect");
        sortDown.classList.remove("sortButtonSelect");

        for (let i = 0; i < dataProduct.length - 1; i++) {
            for (let j = 0; j < dataProduct.length - 1 - i; j++) {
                if (dataProduct[j].playAmount < dataProduct[j + 1].playAmount) {
                    let temp = dataProduct[j];
                    dataProduct[j] = dataProduct[j + 1];
                    dataProduct[j + 1] = temp;
                }
            }
        }
    }
    let totalPage = Math.ceil(dataProduct.length / pageSpace);
    let start = (page - 1) * pageSpace;
    let end = page * pageSpace;

    for (let i = start; i < end; i++) {
        if (i >= dataProduct.length) break;
        message += `
            <div class="item">
                <img src="../assets/images/moneyTouch.png" alt="">
                <div class="itemSetup">
                    <p class="typeItem">${getEmoji(dataProduct[i].categoryId)}</p>
                    <p class="nameItem">${dataProduct[i].testName}</p>
                    <p class="valItem">${dataProduct[i].questions.length} câu hỏi - ${dataProduct[i].playAmount} Lượt chơi</p>
                    <button class="playItemButton" onclick="openPlayTab(${dataProduct[i].id})">Chơi</button>
                </div>
            </div>
        `;
    }
    list.innerHTML = message;

    let buttonMessage = `<button class="paginationButton" onclick="newTabs(${page - 1})" ${page === 1 || dataProduct.length === 0 ? "disabled" : ""}>&lt;</button>`;
    for (let i = 1; i <= totalPage; i++) {
        buttonMessage += `<button class="paginationButton" onclick="newTabs(${i})" ${page === i ? "disabled" : ""}>${i}</button>`;
    }
    buttonMessage += `<button class="paginationButton" onclick="newTabs(${page + 1})" ${page === totalPage || dataProduct.length === 0 ? "disabled" : ""}>&gt;</button>`;

    pageList.innerHTML = buttonMessage;
}
function openPlayTab(id) {
    localStorage.setItem(saveDoTestIdName, id);
    window.location.href = "../pages/doTest.html";
}
function randomTest() {
    let dataProduct = getDataProduct();

    if (dataProduct.length === 0) return; 

    if (dataProduct.length === 1) {
        openPlayTab(dataProduct[0].id);
        return;
    }

    let randomIndex = Math.floor(Math.random() * (dataProduct.length - 1)) + 1;
    openPlayTab(dataProduct[randomIndex].id);
}
render();
