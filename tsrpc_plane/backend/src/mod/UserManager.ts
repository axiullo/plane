//用户管理类
class UserMgr {
    //用户id对应的链接id
    private _userId2connId: Map<string, string> = new Map<string, string>;
    //链接id对应的用户id
    private _connId2userId: Map<string, string> = new Map<string, string>;

    constructor() {
    }

    addUserId(uid: string, connId: string): boolean {
        if (this._userId2connId.has(uid)) {
            return false;
        }

        this._userId2connId.set(uid, connId);
        this._connId2userId.set(connId, uid);
        return true;
    }

    deleteUserByUid(uid: string): boolean {
        var connId = this._userId2connId.get(uid);

        if (connId) {
            this._connId2userId.delete(connId);
            this._userId2connId.delete(uid);
        }

        return true;
    }

    deleteUserByConnId(connId: string): string|undefined {
        var uid = this._connId2userId.get(connId);

        if (uid) {
            this._connId2userId.delete(connId);
            this._userId2connId.delete(uid);
        }

        return uid;
    }

    hasUserId(uid: string): boolean {
        return this._userId2connId.has(uid);
    }

    getConnId(uid: string): string | undefined {
        return this._userId2connId.get(uid);
    }

    getUserId(connId: string): string | undefined  {
        return this._connId2userId.get(connId);
    }
}

//用户管理实例
var UserMgrIns = new UserMgr();

export { UserMgrIns };