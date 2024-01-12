import { Chatroom } from "./Chatroom";
import { Test } from "./clitest";


document.querySelectorAll('.chat-room').forEach(v => {
    new Chatroom(v as HTMLDivElement);
});

var ins = new Test();

export { };
