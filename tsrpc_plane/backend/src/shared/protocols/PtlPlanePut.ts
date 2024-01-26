import { PlaneDirection } from "../module/GamePlane";

export interface ReqPlanePut {
    roomid:string,
    dir:PlaneDirection,
    x:number,
    y:number,
}

export interface ResPlanePut {

}