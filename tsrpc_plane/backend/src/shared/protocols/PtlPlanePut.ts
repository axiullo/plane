import { PlaneDirection } from "../module/ModPlane";

export interface ReqPlanePut {
    roomid:string,
    dir:PlaneDirection,
    x:number,
    y:number,
}

export interface ResPlanePut {

}