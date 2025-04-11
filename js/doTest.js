let saveDoTestIdName = "saveDoTestId";
let dataProductName = "dataProduct";

let nameQuest = document.getElementById("nameQuest");
let numberQuest = document.getElementById("numberQuest");
let questAsk = document.getElementById("questAsk");
let answerList = document.getElementById("answerList");
let questsList = document.getElementById("questsList");
let timeTest = document.getElementById("timeTest");
let timeTestNow = document.getElementById("timeTestNow");
let doneAQuestButton = document.getElementById("doneAQuestButton");
let errorFinishQuest = document.getElementById("errorFinishQuest");
let finishGui = document.getElementById("finishGui");
let overlay = document.getElementById("overlay");
let totalQuestion = document.getElementById("totalQuestion");
let totalCorrectedQuestion = document.getElementById("totalCorrectedQuestion");
let totalWrongQuestion = document.getElementById("totalWrongQuestion");
let finishPoint = document.getElementById("finishPoint");
let questNumber = 0;

let dataTests = JSON.parse(localStorage.getItem(dataProductName)) || [];

let idTest = JSON.parse(localStorage[saveDoTestIdName]);
let indexTest = -1;

let lockWeb = false;
let countdown;

if (idTest === -1) {
    window.location.href = "../pages/dashboard.html";
}
// tim index
for (let i = 0; i < dataTests.length; i++) {
    if (idTest === dataTests[i].id) {
        indexTest = i;
        break;
    }
}
if (indexTest === -1) {
    window.location.href = "../pages/dashboard.html";
}
let dataPartTime = dataTests[indexTest];

let totalSeconds = dataPartTime.playerTime * 60;

function startCountdown() {
    countdown = setInterval(() => {
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        timeTestNow.innerHTML = `Còn lại: ${minutes}:${seconds}`;

        if (totalSeconds <= 0) {
            clearInterval(countdown);
            finishQuest("timeEnd");
        }

        totalSeconds--;
    }, 1000);
}

startCountdown();

function uploadAnswers(data) {
    let messageAnswers = ``;
    for (let i = 0; i < data.answers.length; i++) {
        let isChecked = dataPartTime.questions[questNumber].answers[i].playerAnswer ? "checked" : "";
        messageAnswers += `
            <div class="answerBox">
                <input type="checkbox" oninput="updateAnswerUser(${i}, this.checked)" ${isChecked}>
                <p>${data.answers[i].answer}</p>
            </div>
        `;
    }
    answerList.innerHTML = messageAnswers;
}


function doneAQuest() {
    dataPartTime.questions[questNumber].playerDone = !dataPartTime.questions[questNumber].playerDone;
    uploadQuestions();

}
function uploadQuestions() {
    let messageQuests = ``;

    for (let i = 0; i < dataPartTime.questions.length; i++) {
        if (questNumber === i) {
            messageQuests += `<button class="questsListItem selectQuestion" onclick="uploadQuestSelect(${i})">${i + 1}</button>`;
        } else if (dataPartTime.questions[i].playerDone === true) {
            messageQuests += `<button class="questsListItem doneQuestion" onclick="uploadQuestSelect(${i})">${i + 1}</button>`;
        } else {
            messageQuests += `<button class="questsListItem" onclick="uploadQuestSelect(${i})">${i + 1}</button>`;
        }
    }
    if (dataPartTime.questions[questNumber].playerDone) {
        doneAQuestButton.innerHTML = "Hủy hoàn thành";
        doneAQuestButton.classList.add("declineQuestionBackground");
    } else {
        doneAQuestButton.innerHTML = "Hoàn thành";
        doneAQuestButton.classList.remove("declineQuestionBackground");
    }

    questsList.innerHTML = messageQuests;
}

function uploadQuestSelect(id) {
    questNumber = id;
    setupWeb();
}
function updateAnswerUser(index, value) {
    if (value === true) {
        dataPartTime.questions[questNumber].answers[index].playerAnswer = true;
    } else {
        dataPartTime.questions[questNumber].answers[index].playerAnswer = false;
    }
}
function setupWeb(mode) {
    if (mode === 'back' && questNumber > 0) {
        questNumber--;
    } else if (mode === 'next' && questNumber < dataPartTime.questions.length - 1) {
        questNumber++;
    }
    let dataPartTimeAQuestion = dataPartTime.questions[questNumber];

    nameQuest.innerHTML = dataPartTime.testName;
    timeTest.innerHTML = `thời gian: ${dataPartTime.playerTime} phút`;
    numberQuest.innerHTML = `Câu hỏi ${questNumber + 1} trên ${dataPartTime.questions.length}`;
    questAsk.innerHTML = dataPartTimeAQuestion.content;

    uploadAnswers(dataPartTimeAQuestion);
    uploadQuestions();
}
function checkCorrectedQuestion() {
    let correctCount = 0;
    
    for (let i = 0; i < dataPartTime.questions.length; i++) {

        let maybeCorrect = true;
        for (let j = 0; j < dataPartTime.questions[i].answers.length; j++) {

            let answer = dataPartTime.questions[i].answers[j];

            if (answer.playerAnswer === undefined || answer.playerAnswer === null) {
                answer.playerAnswer = false;
            }

            if (answer.playerAnswer !== answer.isCorrected) {
                maybeCorrect = false;
                break;
            }
        }

        if (maybeCorrect) {
            correctCount++;
        }
    }
    
    return correctCount;
}

function finishQuest(mode) {
    if (mode !== "timeEnd") {
        for (let i = 0; i < dataPartTime.questions.length; i++) {
            if (!dataPartTime.questions[i].playerDone) {
                errorFinishQuest.innerHTML = "Người dùng vẫn chưa hoàn thành hết các câu hỏi!?!";
                errorFinishQuest.style.display = "block";
                return;
            }
        }
    }
    errorFinishQuest.style.display = "none";
    clearInterval(countdown);
    // ........phần tính điểm.........
    if (!lockWeb) {
        lockWeb = true;
        let correctQuest = checkCorrectedQuestion();
        finishPoint.innerHTML = `Điểm của bạn: ${Math.round((correctQuest / dataPartTime.questions.length) * 100)}%`;
        totalQuestion.innerHTML = `Tổng số câu hỏi: ${dataPartTime.questions.length}`;
        totalCorrectedQuestion.innerHTML = `Câu trả lời đúng: ${correctQuest}`;
        totalWrongQuestion.innerHTML = `Câu trả lời sai: ${dataPartTime.questions.length - correctQuest}`;
        
        let storedData = JSON.parse(localStorage[dataProductName]);
        storedData[indexTest].playAmount += 1;
        localStorage[dataProductName] = JSON.stringify(storedData);
    }

    openFinishGui();
}


function closeFinishGui() {
    overlay.style.display = "none";
    finishGui.style.display = "none";
}
function openFinishGui() {
    overlay.style.display = "block";
    finishGui.style.display = "block";
}

function ReturnToDashboard() {
    window.location.href = "../pages/dashboard.html";
}
function doTestAgain() {
    location.reload();
}
setupWeb();