// let dataName = "dataProject";
let dataCategory = "dataCategory";

let page = 1;
let pageSpace = 8;
let selectIDDelete = -1;
let saveMode;
let idFix;

let overlay = document.getElementById("overlay");
let addOrFixGui = document.getElementById("addOrFixGui");
let deleteGui = document.getElementById("deleteGui");
let nametitleAddFixGui = document.getElementById("nametitleAddFixGui");


let nameItemInput = document.getElementById("nameItemInput");
let emojiItemInput = document.getElementById("emojiItemInput");

let errorNameItem = document.getElementById("errorNameItem");
let errorEmojiItem = document.getElementById("errorEmojiItem");


function getDataCategory() {
    return JSON.parse(localStorage.getItem(dataCategory)) || [
        {
            "id": 1,
            "categoryName": "Hóa",
            "categoryEmoji": "😵‍💫"
        },
        {
            "id": 2,
            "categoryName": "CSS",
            "categoryEmoji": "🥰"
        },
        {
            "id": 3,
            "categoryName": "Toán",
            "categoryEmoji": "😯"
        },
        {
            "id": 4,
            "categoryName": "Văn",
            "categoryEmoji": "👽"
        }
    ];
}

// function getData() {
//     return JSON.parse(localStorage.getItem(dataName)) || [];
// }

localStorage[dataCategory] = JSON.stringify(getDataCategory()); 
// gui du lieu vao localstorage

function openFixOrAddItem(mode, id) {
    if (mode === "add") {
        nametitleAddFixGui.innerHTML = "Thêm danh mục";
    } else {
        nametitleAddFixGui.innerHTML = "Sửa danh mục";
        let data = getDataCategory();
        for (let i = 0; i < data.length; i++){
            if (data[i].id === id) {
                idFix = id;
                nameItemInput.value = `${data[i].categoryName}`;
                emojiItemInput.value = `${data[i].categoryEmoji}`;
                break;
            }
        }
    }
    saveMode = mode;
    overlay.style.display = "block";
    addOrFixGui.style.display = "block";
}
function closeFixOrAddGui() {
    overlay.style.display = "none";
    addOrFixGui.style.display = "none";
    nameItemInput.value = "";
    emojiItemInput.value = "";
    errorNameItem.style.display = "none";
    errorEmojiItem.style.display = "none";
}

function fixOrAddCategory() {
    let data = getDataCategory();
    let nameItem = nameItemInput.value.trim();
    let emojiItem = emojiItemInput.value.trim();
    if (!nameItem) {
        errorNameItem.innerHTML = "không được để rỗng!";
        errorNameItem.style.display = "block";
        errorEmojiItem.style.display = "none";
        return;
    } else {
        errorNameItem.style.display = "none";
    }
    if (nameItem.length > 12) {
        errorNameItem.innerHTML = "không được dài quá 12 chữ!";
        errorNameItem.style.display = "block";
        errorEmojiItem.style.display = "none";
        return;
    } else {
        errorNameItem.style.display = "none";
    }
    for (let i = 0; i < data.length; i++){
        if (data[i].categoryName === nameItem) {
            if (saveMode === "fix" && data[i].id === idFix) {
                break;
            }
            errorNameItem.innerHTML = "Tên danh mục đã tồn tại!";
            errorNameItem.style.display = "block";
            errorEmojiItem.style.display = "none";
            return;
        }
    }
    
    if (!emojiItem) {
        errorEmojiItem.innerHTML = "không được để rỗng!";
        errorEmojiItem.style.display = "block";
        return;
    } else {
        errorEmojiItem.style.display = "none";
    }
    
    if (emojiItem.length > 7) {
        errorEmojiItem.innerHTML = "không được dài quá 7 chữ!";
        errorEmojiItem.style.display = "block";
        return;
    } else {
        errorEmojiItem.style.display = "none";
    }
    
    if (saveMode === "add") {
        let id;
        if (data.length === 0) {
            id = 1;
        } else {
            id = data[data.length - 1].id + 1;
        }
        let temp = {
            id,
            categoryName: nameItem,
            categoryEmoji: emojiItem,
        };
        data.push(temp);
    } else if (saveMode === "fix") {
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === idFix) {
                idFix = -1;
                data[i].categoryName = nameItem;
                data[i].categoryEmoji = emojiItem;
                break;
            }
        }
    }
    localStorage[dataCategory] = JSON.stringify(data);

    render()
    closeFixOrAddGui()
}

function newTabs(numberPage) {
    page = numberPage;
    render();
};


function render() {
    let data = getDataCategory();

    let totalPage = Math.ceil(data.length / pageSpace);
    let start = (page - 1) * pageSpace;
    let end = page * pageSpace;

    let message = `
        <tr>
            <th class="idTable">ID</th>
            <th class="nameTable">Tên danh mục</th>
            <th class="statusTable">Hoạt động</th>
        </tr>
    `;

    for (let i = start; i < end; i++) {
        if (i >= data.length) break;
        message += `
            <tr>
                <td class="idTable">${data[i].id}</td>
                <td class="nameTable">${data[i].categoryEmoji} ${data[i].categoryName}</td>
                <td class="statusTable"><button class="fixButton" onclick="openFixOrAddItem('fix', ${data[i].id})">Sửa</button><button class="delButton" onclick="openDelItem(${data[i].id})">Xóa</button></td>
            </tr>
        `;
    }
    document.getElementById("tableList").innerHTML = message;

    let buttonMessage = `<button class="paginationButton" onclick="newTabs(${page - 1})" ${page === 1 || data.length === 0 ? "disabled" : ""}>&lt;</button>`;
    for (let i = 1; i <= totalPage; i++) {
        buttonMessage += `<button class="paginationButton" onclick="newTabs(${i})" ${page === i ? "disabled" : ""}>${i}</button>`;
    }
    buttonMessage += `<button class="paginationButton" onclick="newTabs(${page + 1})" ${page === totalPage || data.length === 0 ? "disabled" : ""}>&gt;</button>`;

    document.getElementById("pageList").innerHTML = buttonMessage;
}

function delCategory() {
    let data = getDataCategory();
    for (let i = 0; i < data.length; i ++){
        if (data[i].id === selectIDDelete) {
            data.splice(i, 1);
            break;
        }
    }
    localStorage[dataCategory] = JSON.stringify(data);
    selectIDDelete = -1;
    closeDeleteItem();
    render();
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



render();