import { WsClient } from "tsrpc-browser";
import { ServiceType, serviceProto } from "../shared/protocols/serviceProto";
import  Config from "../config.json";

export class ModNet
{
    private _wsclient:WsClient<ServiceType>;

    private constructor()
    {
        let url = "ws://" + Config.host + ":" + Config.port;
        this._wsclient = new WsClient(serviceProto, {
            server: url,
            json: true
        });
    }

    private static instance: ModNet = new ModNet();

    public static getInstance(): ModNet
    {
        return ModNet.instance;
    }

    public async connect(){
        let result = await ModNet.instance._wsclient.connect();

        if(!result.isSucc){
            console.log(result.errMsg);            
            return;
        }
    }

    public async reconnect(){
    }

    static WsClient(){
        return ModNet.instance._wsclient;
    }
}