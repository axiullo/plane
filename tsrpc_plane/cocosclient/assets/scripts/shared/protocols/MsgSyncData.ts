/**
 * 同步数据
 */

/**
 * 同步操作枚举
 */
export enum SyncDataOpt {
    Set,
    Update,
    Delete,
}

export interface SyncData {
    tbname: string;
    opt: SyncDataOpt;
    data: any;
}

export interface MsgSyncData {
    datas: SyncData[];
}