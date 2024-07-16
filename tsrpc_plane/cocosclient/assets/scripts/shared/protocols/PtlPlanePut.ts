import { PlaneDirection } from "../mod/GamePlane";

export interface ReqPlanePut {
    roomid:string,
    dir:PlaneDirection,
    x:number,
    y:number,
}

export interface ResPlanePut {

}