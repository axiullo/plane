import { Test, TestStatus } from "./test";
const eventEmitter = require('events').EventEmitter;

let myevent = new eventEmitter();
let testIns = new Test();
testIns.setEventEmitter(myevent);

document.body.setAttribute("class", "app");

function showPage() {
    switch (testIns.curStatus) {
        case TestStatus.UnLogin:
            showLoginPage();
            break;
        case TestStatus.Regist:
            registPage();
            break;
        default:
            alert("todo  status=" + testIns.curStatus);
            break;
    }
}

function showLoginPage() {
    var useridDiv = document.createElement("div");
    useridDiv.setAttribute("style", "display:block;");
    var nameLabel = document.createElement("label");
    nameLabel.textContent = "userid:";
    useridDiv.appendChild(nameLabel);

    var nameInput = document.createElement("input");
    useridDiv.appendChild(nameInput);

    var btnDiv = document.createElement("div");
    btnDiv.setAttribute("style", "display:block;");
    var loginBtn = document.createElement("Button");
    loginBtn.textContent = "Login";
    loginBtn.addEventListener("click", async function () {
        testIns.login(nameInput.value, "123456");
    });

    btnDiv.append(loginBtn);

    document.body.appendChild(useridDiv);
    document.body.append(btnDiv);
}

function registPage() {
    var bodyDiv = document.createElement("div");
    bodyDiv.setAttribute("style", "display:block;");


    var useridDiv = document.createElement("div");
    useridDiv.setAttribute("style", "display:block;");
    var nameLabel = document.createElement("label");
    nameLabel.textContent = "userid:";
    useridDiv.appendChild(nameLabel);

    var nameInput = document.createElement("input");
    useridDiv.appendChild(nameInput);

    var loginBtn = document.createElement("Button");
    loginBtn.textContent = "Regis";
    loginBtn.addEventListener("click", async function () {
        testIns.login(nameInput.value, "123456");
    });

    bodyDiv.append(useridDiv);
    bodyDiv.append(loginBtn);
    document.body.appendChild(bodyDiv);
}

//清除所有组件
function clearComponents() {
    var body = document.body;
    // 获取 body 的所有子元素
    var childElements = body.children;

    // 逐个删除子元素
    while (childElements.length > 0) {
        body.removeChild(childElements[0]);
    }
}

myevent.on("changeStatus", async function () {
    clearComponents();
    showPage();
});

myevent.emit("changeStatus");
export { };