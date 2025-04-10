// let dataName = "dataProject";
let dataProductName = "dataProduct";
let dataCategoryName = "dataCategory";
let saveIDFixItemName = "saveIDFixItem";

let selectIndexDelete = -1;
let page = 1;
let pageSpace = 5;

let overlay = document.getElementById("overlay");
let addOrFixGui = document.getElementById("addOrFixGui");
let nameProduct = document.getElementById("nameProduct");
let choiceDirectory = document.getElementById("choiceDirectory");
let timePlay = document.getElementById("timePlay");
let nameItemInput = document.getElementById("nameItemInput");
let answerList = document.getElementById("answerList");
let errorAnswerItemInput = document.getElementById("errorAnswerItemInput");
let tableList = document.getElementById("tableList");
let deleteGui = document.getElementById("deleteGui");
let pageList = document.getElementById("pageList");

let errorTimePlay = document.getElementById("errorTimePlay");
let errorNameProduct = document.getElementById("errorNameProduct");
let errorChoiceDirectory = document.getElementById("errorChoiceDirectory");
let errorAddQuestion = document.getElementById("errorAddQuestion");
let errorNameItemInput = document.getElementById("errorNameItemInput");

let modeIndexFix = -1;

let questions = [];
let answers = [];

// function getData() {
//     return JSON.parse(localStorage.getItem(dataName)) || [];
// }

function getDataProduct() {
    return JSON.parse(localStorage.getItem(dataProductName)) || [];
}

function getDataCategory() {
    return JSON.parse(localStorage.getItem(dataCategoryName)) || [];
}

function getSaveIDFixItem() {
    return JSON.parse(localStorage.getItem(saveIDFixItemName)) || -1;
}

function showAddOrFixQuestionGui(modeIndexFixA) {
    if (modeIndexFixA >= 0) {
        modeIndexFix = modeIndexFixA;
    } else {
        modeIndexFix = -1;
    }
    overlay.style.display = "block";
    addOrFixGui.style.display = "block";
}

function closeAddOrFixQuestionGui() {
    nameItemInput.value = "";
    answerList.innerHTML = "";
    answers = [];

    errorAnswerItemInput.style.display = "none";

    overlay.style.display = "none";
    addOrFixGui.style.display = "none";
}
function loadDataCategory() {
    let dataCategory = getDataCategory();
    let message = `<option value="nothing">Chọn danh mục</option>`;
    for (let i = 0; i < dataCategory.length; i++){
        message += `<option value="${dataCategory[i].id}">${dataCategory[i].categoryEmoji} ${dataCategory[i].categoryName}</option>`;
    }
    choiceDirectory.innerHTML = message;
}
function showAnswer() {
    let message = ``;
    for (let i = 0; i < answers.length; i++) {
        message += `
            <div class="itemAnswer">
                <input type="checkbox" class="checkbox" ${answers[i].isCorrected ? 'checked' : ''} onclick="toggleCorrect(${i}, this)">
                <input type="text" class="input-field" placeholder="Nhập câu trả lời" value="${answers[i].answer}" oninput="updateAnswer(${i}, this.value)">
                <button class="delete-btn" onclick="removeAnswer(${i})">🗑️</button>
            </div>
        `;
    }
    answerList.innerHTML = message;
}

function addAnswer() {
    if (answers.length >= 5) {
        errorAnswerItemInput.innerHTML = "Câu hỏi không quá 5 câu trả lời";
        errorAnswerItemInput.style.display = "block";
        return;
    } else {
        errorAnswerItemInput.style.display = "none";
    }
    answers.push({ answer: "", isCorrected: false });
    showAnswer();
}

function updateAnswer(index, value) {
    answers[index].answer = value;
}

function toggleCorrect(index, checkbox) {
    answers[index].isCorrected = checkbox.checked;
}

function removeAnswer(index) {
    answers.splice(index, 1);
    showAnswer();
    if (answers.length < 5) {
        errorAnswerItemInput.style.display = "none";
    }
}

function addQuestion() {
    let nameItemInputA = nameItemInput.value.trim();

    if (questions.length > 39) {
        errorAnswerItemInput.innerHTML = "Bài test không quá 40 câu hỏi!";
        errorAnswerItemInput.style.display = "block";
        return;
    } else {
        errorAnswerItemInput.style.display = "none";
    }

    if (!nameItemInputA) {
        errorNameItemInput.innerHTML = "Tên không được để trống";
        errorNameItemInput.style.display = "block";
        return;
    } else {
        errorNameItemInput.style.display = "none";
    }

    if (nameItemInputA.length > 60) {
        errorNameItemInput.innerHTML = "tên không được dài quá 60 chữ!";
        errorNameItemInput.style.display = "block";
        return;
    } else {
        errorNameItemInput.style.display = "none";
    }
    if (answers.length < 2) {
        errorAnswerItemInput.innerHTML = "Câu hỏi phải có ít nhất 2 câu trả lời";
        errorAnswerItemInput.style.display = "block";
        return;
    } else {
        errorAnswerItemInput.style.display = "none";
    }

    let count = -1;
    for (let i = 0; i < answers.length; i++){
        if (answers[i].isCorrected) {
            count = i;
        }
        if (answers[i].answer.length === 0) {
            errorAnswerItemInput.innerHTML = "Các câu trả lời không được để trống!!";
            errorAnswerItemInput.style.display = "block";
            return;
        }
        if (answers[i].answer.length > 30) {
            errorAnswerItemInput.innerHTML = "Độ dài của các câu trả lời phải nhỏ hơn hoặc bằng 30 chữ";
            errorAnswerItemInput.style.display = "block";
            return;
        }
    }
    if (count === -1) {
        errorAnswerItemInput.innerHTML = "Phải có ít nhất 1 câu trả lời đúng!!!!";
        errorAnswerItemInput.style.display = "block";
        return;
    } else {
        errorAnswerItemInput.style.display = "none";
    }
    let temp = {
        content: nameItemInputA,
        answers, 
    }
    
    if (modeIndexFix !== -1) {
        questions[modeIndexFix] = temp;
    } else {
        questions.push(temp);
    }

    nameItemInput.value = "";
    answerList.innerHTML = "";
    answers = [];

    modeIndexFix = -1;
    
    updateAnswerList();
    closeAddOrFixQuestionGui();
}

function addTest() {
    let nameProductA = nameProduct.value.trim();
    let choiceDirectoryA = choiceDirectory.value;
    let timePlayA = Number(timePlay.value);
    let dataProduct = getDataProduct();
    let dataSaveIDFixItem = getSaveIDFixItem();

    if (!nameProductA) {
        errorNameProduct.innerHTML = "Tên không được để trống";
        errorNameProduct.style.display = "block";
        return;
    } else {
        errorNameProduct.style.display = "none";
    }

    if (nameProductA.length > 60) {
        errorNameProduct.innerHTML = "Tên không được để quá 60 chữ";
        errorNameProduct.style.display = "block";
        return;
    } else {
        errorNameProduct.style.display = "none";
    }
    
    for (let i = 0; i < dataProduct.length; i++){
        if (nameProductA === dataProduct[i].testName) {
            if (dataSaveIDFixItem !== -1) {
                break;
            }
            errorNameProduct.innerHTML = "Tên đã tồn tại!!";
            errorNameProduct.style.display = "block";
            return;
        }
    }

    errorNameProduct.style.display = "none";

    if (choiceDirectoryA === "nothing") {
        errorChoiceDirectory.innerHTML = "Hãy chọn danh mục!";
        errorChoiceDirectory.style.display = "block";
        return;
    } else {
        errorChoiceDirectory.style.display = "none";
    }
    
    if (timePlayA <= 0 || !timePlayA) {
        errorTimePlay.innerHTML = "Thời gian không được để rỗng va phải lớn hơn 0";
        errorTimePlay.style.display = "block";
        return;
    } else {
        errorTimePlay.style.display = "none";
    }
    
    if (!Number.isInteger(timePlayA)) {
        errorTimePlay.innerHTML = "Thời gian phải là số nguyên!";
        errorTimePlay.style.display = "block";
        return;
    } else {
        errorTimePlay.style.display = "none";
    }

    if (timePlayA > 120) {
        errorTimePlay.innerHTML = "Thời gian không dược quá 120 phút";
        errorTimePlay.style.display = "block";
        return;
    } else {
        errorTimePlay.style.display = "none";
    }

    if (questions.length === 0) {
        errorAddQuestion.innerHTML = "Bài test phải có ít nhất 1 câu hỏi!";
        errorAddQuestion.style.display = "block";
        return;
    } else {
        errorAddQuestion.style.display = "none";
    }
    // SAVEEEEEEEEEEEEEEEEEEEEEEE

    if (dataSaveIDFixItem !== -1) {
        for (let i = 0; i < dataProduct.length; i++) {
            if (dataSaveIDFixItem === dataProduct[i].id) {
                dataProduct[i].testName = nameProductA;
                dataProduct[i].categoryId = Number(choiceDirectoryA);
                dataProduct[i].playerTime = timePlayA;
                dataProduct[i].questions = questions;
                break;
            }
        }
    } else {
        let id;

        if (dataProduct.length === 0) {
            id = 1;
        } else {
            id = dataProduct[dataProduct.length - 1].id + 1;
        }

        let temp = {
            id,
            testName: nameProductA,
            categoryId: Number(choiceDirectoryA),
            playerTime: timePlayA,
            playAmount: 0,
            questions,
        };

        dataProduct.push(temp);
    }

    localStorage[dataProductName] = JSON.stringify(dataProduct);
    localStorage.setItem(saveIDFixItemName, -1);
    window.location.href = "../pages/product-manager.html";
}

function newTabs(numberPage) {
    page = numberPage;
    updateAnswerList();
};

function updateAnswerList() {

    let totalPage = Math.ceil(questions.length / pageSpace);
    let start = (page - 1) * pageSpace;
    let end = page * pageSpace;

    let message = `
            <tr>
                <th class="idTable">ID</th>
                <th class="questionTable">Câu hỏi</th>
                <th class="statusTable">Hành động</th>
            </tr>
    `;
    for (let i = start; i < end; i++) {
        if (i >= questions.length) break;
        message += `
            <tr>
                <td class="idTable">${i}</td>
                <td class="questionTable">${questions[i].content}</td>
                <td class="statusTable"><button class="fixButton" onclick="openFixItem(${i})">Sửa</button><button class="delButton" onclick="openDelItem(${i})">Xóa</button>
            </td>
        `;
    }

    tableList.innerHTML = message;

    let buttonMessage = `<button class="paginationButton" onclick="newTabs(${page - 1})" ${page === 1 || questions.length === 0 ? "disabled" : ""}>&lt;</button>`;
    for (let i = 1; i <= totalPage; i++) {
        buttonMessage += `<button class="paginationButton" onclick="newTabs(${i})" ${page === i ? "disabled" : ""}>${i}</button>`;
    }
    buttonMessage += `<button class="paginationButton" onclick="newTabs(${page + 1})" ${page === totalPage || questions.length === 0 ? "disabled" : ""}>&gt;</button>`;

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

function delCategory() {
    if (selectIndexDelete !== -1) {
        questions.splice(selectIndexDelete, 1);
        selectIndexDelete = -1;
        closeDeleteItem();
        updateAnswerList();
    }
}

function openFixItem(index) {
    nameItemInput.value = questions[index].content;
    answers = questions[index].answers;
    showAddOrFixQuestionGui(index);
    showAnswer();
}

function workingIfFix() {
    let dataSaveIDFixItem = getSaveIDFixItem();
    let dataProduct = getDataProduct();
    if (dataSaveIDFixItem === -1) {
        return;
    }

    // tim index :)
    for (let i = 0; i < dataProduct.length; i++){
        if (dataSaveIDFixItem === dataProduct[i].id) {
            nameProduct.value = dataProduct[i].testName;   
            choiceDirectory.value = dataProduct[i].categoryId;
            timePlay.value = dataProduct[i].playerTime;
            questions = dataProduct[i].questions;
            break;
        }
    }
    updateAnswerList();
}

updateAnswerList();
loadDataCategory();
workingIfFix();