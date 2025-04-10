let dataProductName = "dataProduct";
let dataCategoryName = "dataCategory";


let list = document.getElementById("list");
let pageList = document.getElementById("pageList");
let sortUp = document.getElementById("sortUp");
let sortDown = document.getElementById("sortDown");

let page = 1;
let pageSpace = 8;

function getDataProduct() {
    return JSON.parse(localStorage.getItem(dataProductName)) || [{ "id": 1, "testName": "Hóa học cơ bản", "categoryId": 1, "playerTime": 12, "playAmount": 0, "questions": [{ "content": "H2 +O2 =", "answers": [{ "answer": "hehe", "isCorrected": false }, { "answer": "hoho", "isCorrected": false }, { "answer": "haha", "isCorrected": false }, { "answer": "H2O", "isCorrected": true }] }, { "content": "Chất X có công thức phân tử C3H6O2, là este của axit axetic", "answers": [{ "answer": "C2H5COOH.", "isCorrected": false }, { "answer": "HO-C2H4-CHO.", "isCorrected": false }, { "answer": "CH3COOCH3", "isCorrected": true }, { "answer": "HCOOC2H5.", "isCorrected": false }] }] }];
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
                    <button class="playItemButton">Chơi</button>
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

render();
