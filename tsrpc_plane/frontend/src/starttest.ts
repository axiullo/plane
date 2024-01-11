import { ServiceType, serviceProto } from "./shared/protocols/serviceProto";
import { Test, TestStatus } from "./test";
const eventEmitter = require('events').EventEmitter;

let myevent = new eventEmitter();
let testIns = new Test();
testIns.setEventEmitter(myevent);
// testIns.curStatus = TestStatus.Test;

document.body.setAttribute("class", "app");

function showPage() {
    switch (testIns.curStatus) {
        case TestStatus.Test:
            testPage();
            break;
        case TestStatus.UnLogin:
            showLoginPage();
            break;
        case TestStatus.Regist:
            registPage();
            break;
        case TestStatus.Logined:
            loginedPage();
            break;
        default:
            alert("todo  status=" + testIns.curStatus);
            break;
    }
}

function testPage(){
    loginedPage();
}

function showLoginPage() {
    var firstDiv = document.createElement("div");

    var useridDiv = document.createElement("div");
    useridDiv.setAttribute("class", "oneblock");
    var nameLabel = document.createElement("label");
    nameLabel.textContent = "userid:";
    useridDiv.appendChild(nameLabel);

    var nameInput = document.createElement("input");
    useridDiv.appendChild(nameInput);

    var div2 = document.createElement("div");
    div2.setAttribute("class", "oneblock");
    var btn = document.createElement("Button");
    btn.setAttribute("class", "button");
    btn.textContent = "Login";
    btn.addEventListener("click", async function () {
        testIns.login(nameInput.value, "123456");
    });

    div2.append(btn);

    firstDiv.append(useridDiv);
    firstDiv.append(div2);
    document.body.appendChild(firstDiv);
}

function registPage() {
    var useridDiv = document.createElement("div");
    var nameLabel = document.createElement("label");
    nameLabel.textContent = "userid:";
    useridDiv.appendChild(nameLabel);
    var nameInput = document.createElement("input");
    useridDiv.appendChild(nameInput);

    var btn = document.createElement("Button");
    btn.textContent = "Regist";
    btn.addEventListener("click", async function () {
        testIns.regist(nameInput.value, "123456");
    });

    useridDiv.append(btn);
    document.body.appendChild(useridDiv);
}

function loginedPage() {
    var firstDiv = document.createElement("div");

    var panelDiv = document.createElement("div");
    panelDiv.setAttribute("class", "oneblock");
    var msgnameLabel = document.createElement("label");
    msgnameLabel.textContent = "消息名称：";
    panelDiv.append(msgnameLabel);
    var msgnameSelect = document.createElement("select");

    serviceProto['services'].forEach(function (service) {
        let option = document.createElement("option");
        option.value = service.name;
        option.text = service.name;
        msgnameSelect.appendChild(option);
    });

    msgnameSelect.selectedIndex = 4;

    panelDiv.appendChild(msgnameSelect);

    var panelDiv2 = document.createElement("div");
    panelDiv2.setAttribute("class", "oneblock");
    var argsLabel = document.createElement("label");
    argsLabel.textContent = "参数：";
    panelDiv2.append(argsLabel);
    var argsText = document.createElement("textarea");
    panelDiv2.appendChild(argsText);

    var btnDiv = document.createElement("div");
    btnDiv.setAttribute("class", "oneblock");
    var btn = document.createElement("Button");
    btn.textContent = "发送";
    btn.addEventListener("click", async function () {
        let msgname = msgnameSelect.options[msgnameSelect.selectedIndex].value;

        let str = argsText.value;

        if (str.length <= 0) {
            str = "{}";
        }

        testIns.sendMsg(msgname as (keyof ServiceType['api']), JSON.parse(str));
    });
    btnDiv.append(btn);

    firstDiv.append(panelDiv);
    firstDiv.append(panelDiv2);
    firstDiv.append(btnDiv);
    document.body.appendChild(firstDiv);
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