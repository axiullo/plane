import { getClient } from "./getClient";
import { MsgUserLogin } from "./shared/protocols/MsgUserLogin";

export class Test {
    client = getClient();

    constructor() {
        var self = this;
        // Connect at startup
        this.client.connect().then(v => {
            if (!v.isSucc) {
                alert('= Client Connect Error =\n' + v.errMsg);
            }

            self.Login();
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

    private async Login() {
        let ret = await this.client.callApi('Login', {
            userId: "1"
        });

        // Error
        if (!ret.isSucc) {
            alert(ret.err.message);
            return;
        }
    }
}