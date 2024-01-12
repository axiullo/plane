import { getClient } from "./getClient";
import { Sdata } from "./mod/SData";
import { user } from "./shared/db/dbstruct";
import { RoomData } from "./shared/module/ModRoom";
import { SyncDataOpt } from "./shared/protocols/MsgSyncData";
import { ResJoinRoom } from "./shared/protocols/PtlJoinRoom";
import { ServiceType } from "./shared/protocols/serviceProto";

//测试端状态
export enum TestStatus {
    Test,
    UnLogin,
    Logined,
    Regist,
}

export class Test {
    curStatus: TestStatus = TestStatus.UnLogin;
    client = getClient();
    curEventEmitter: any = null;
    roomData: RoomData | undefined;

    constructor() {
        let self = this;
        this.curStatus = TestStatus.UnLogin;

        // Connect at startup
        this.client.connect().then(v => {
            if (!v.isSucc) {
                alert('= Client Connect Error =\n' + v.errMsg);
            }
        });

        // Listen Msg
        this.client.listenMsg('UserLogin', v => {
            console.log(`Logined ${v.userid}, ${v.time}`)
        })

        this.client.listenMsg('SyncData', v => {
            v.datas.forEach((data) => {
                if (data.opt == SyncDataOpt.Delete) {

                }
                else if (data.opt == SyncDataOpt.Set) {
                    Sdata.getInstance().setData(data.tbname, data.data);
                }
                else if (data.opt == SyncDataOpt.Update) {
                    Sdata.getInstance().updateValue(data.tbname, data.data);
                }
            });
        });

        this.client.listenMsg("RoomData", res => {
            self.roomData = res.data;
        });

        // When disconnected
        this.client.flows.postDisconnectFlow.push(v => {
            alert('Server disconnected');
            return v;
        })
    }

    public setEventEmitter(eventEmitter: any): void {
        this.curEventEmitter = eventEmitter;
    }

    public async login(userid: string, password: string) {
        let ret = await this.client.callApi('Login', {
            userid: userid,
            password: password
        });

        // Error
        if (!ret.isSucc) {
            alert(ret.err.message);

            if (ret.err.code == 1) {
                this.SetStatus(TestStatus.Regist);
            }
            return;
        }

        // let userdata: user = {
        //     userid: userid, //用户id
        //     password: password, //密码
        //     lastlogin: 0, //上次登录时间
        //     createtime: 0, //创建时间
        //     name: userid,//昵称
        //     id: "",
        // }

        Sdata.getInstance().setData("user", {
            userid: userid,
            password: password,
        });

        this.SetStatus(TestStatus.Logined);
    }

    public async regist(userid: string, password: string) {
        let ret = await this.client.callApi('Regist', {
            userid: userid,
            password: password,
            name: userid,
        });

        // Error
        if (!ret.isSucc) {
            alert(ret.err.message);

            if (ret.err.code == 1) {
                this.SetStatus(TestStatus.Regist);
            }
            return;
        }

        this.SetStatus(TestStatus.Logined);
    }

    public async sendMsg(msgName: string & keyof ServiceType['api'], args: any) {
        let ret = await this.client.callApi(msgName, args);

        if (!ret.isSucc) {
            alert(ret.err.message);
            return;
        }

        switch (msgName) {
            case "JoinRoom":
                this.roomData = (ret as ResJoinRoom).roomData;
                break;
        }

        alert("success");
    }

    private SetStatus(status: TestStatus) {
        this.curStatus = status;
        this.curEventEmitter.emit("changeStatus", status);
    }
}