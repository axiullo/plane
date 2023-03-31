import { Chatroom } from "./Chatroom";
import { Test } from "./test";


document.querySelectorAll('.chat-room').forEach(v => {
    new Chatroom(v as HTMLDivElement);
});

var ins = new Test();

export { };
