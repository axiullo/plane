import { ApiReturn } from 'tsrpc';
import { server } from './';
 //import { ReqRegist,ResRegist } from './shared/protocols/PtlRegist';
import { ReqRegist } from './shared/protocols/PtlRegist';
import { ReqLogin, ResLogin } from "./shared/protocols/PtlLogin";

class Test {
    private static _singleton: Test;
    private constructor() {

    }

    public static get instance(): Test {
        if (!this._singleton) {
            this._singleton = new Test();
        }

        return this._singleton;
    }

    username: string = "testuser";
    password: string = "testpassword";

    public async testRegist(): Promise<void> {
        let msg: ReqRegist = { userid: this.username, password: this.password };
        // server.callApi("Regist", msg).then((ret: ApiReturn<ResRegist>) => {
        //     server.logger.debug("22222");
        //     server.logger.debug("Regist then", typeof (ret), ret);
        // });

        let ret = await server.callApi("Regist", msg);

        if(!ret.isSucc){
            server.logger.debug("$$$testRegist", ret.err);
            return;
        }
    }

    async testLogin(): Promise<void> {
        let msg: ReqLogin = { userId: this.username, password: this.password };
        server.callApi("Login", msg).then((ret: ApiReturn<ResLogin>) =>{
            server.logger.debug("$$$testLogin", typeof (ret), ret);
        });
    }

    async startAction():Promise<void>{
        await this.testRegist();
        await this.testLogin();
    }
}

export { Test };