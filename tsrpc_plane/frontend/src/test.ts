import { getClient } from "./getClient";
import { MsgUserLogin } from "./shared/protocols/MsgUserLogin";

//测试端状态
export enum TestStatus
{
    UnLogin,
    Logined,
}

export class Test {
    curStatus: TestStatus = TestStatus.UnLogin;
    client = getClient();
    curEventEmitter:any = null;

    constructor() {
        var self = this;

        this.curStatus = TestStatus.UnLogin;

        // Connect at startup
        this.client.connect().then(v => {
            if (!v.isSucc) {
                alert('= Client Connect Error =\n' + v.errMsg);
            }
        });

        // Listen Msg
        this.client.listenMsg('UserLogin', v => { 
            console.log(`Login suc ${v.userId}, ${v.time}`)
        })

        // When disconnected
        this.client.flows.postDisconnectFlow.push(v => {
            alert('Server disconnected');
            return v;
        })
    }

    public setEventEmitter(eventEmitter: any):void
    {
        this.curEventEmitter = eventEmitter;
    }

    public async login(userid:string) {
        let ret = await this.client.callApi('Login', {
            userId: userid
        });

        // Error
        if (!ret.isSucc) {
            alert(ret.err.message);
            return;
        }

        this.SetStatus(TestStatus.Logined);
    }

    private SetStatus(status: TestStatus) {
        this.curStatus = status;
        this.curEventEmitter.emit("changeStatus", status);
    }
}