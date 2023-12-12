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

    /**
     * 用户注册
     * @returns 注册成功返回true，否则返回false
     */
    public async testRegist(): Promise<boolean> {
        let msg: ReqRegist = { userid: this.username, password: this.password };
        // server.callApi("Regist", msg).then((ret: ApiReturn<ResRegist>) => {
        //     server.logger.debug("22222");
        //     server.logger.debug("Regist then", typeof (ret), ret);
        // });

        let ret = await server.callApi("Regist", msg);

        if(!ret.isSucc){
            server.logger.debug("$$$testRegist", ret.err);
            return false;
        }

        return true;
    }

    /**
     * 用户登录
     */
    async testLogin(): Promise<boolean> {
        let msg: ReqLogin = { userId: this.username, password: this.password };
        
        return server.callApi("Login", msg).then((ret: ApiReturn<ResLogin>) =>{
            server.logger.debug("$$$testLogin", typeof (ret), ret);

            if(!ret.isSucc){
                server.logger.debug("$$$testLogin", ret.err);
                return false;
            }

            return true;
        });
    }

    async startAction():Promise<void>{
        let retRegist = await this.testRegist();

        if(!retRegist){
            let retLogin = await this.testLogin();

            if(!retLogin){
                server.logger.debug("登录失败");
                return;
            }
        }
    }
}

export { Test };