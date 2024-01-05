import { PlaneDirection } from "../module/ModPlane";

export interface ReqPlaneTurn {
    roomid:string,
    enemyUid:string;
    dir:PlaneDirection;
    x:number;
    y:number;
}

export interface ResPlaneTurn {

}