class UserManager {
    //用户id对应的链接id
    private userId2connId:Map<string,string> = new Map<string,string>;
     //链接id对应的用户id
    private connId2userId:Map<string,string> = new Map<string,string>;
    
    constructor()
    {
    }
    
    addUserId(uid:string, connId:string):boolean
    {
        if(this.userId2connId.has(uid))
        {
            return false;
        }

        this.userId2connId.set(uid, connId);
        this.connId2userId.set(connId, uid);
        return true;
    }

    deleteUserByUid(uid:string):boolean
    {
        var connId = this.userId2connId.get(uid);

        if(connId)
        {
            this.connId2userId.delete(connId);
            this.userId2connId.delete(uid);       
        }

        return true;
    }

    deleteUserByConnId(connId:string):boolean
    {
        var uid = this.connId2userId.get(connId);

        if(uid)
        {
            this.connId2userId.delete(connId);
            this.userId2connId.delete(uid);       
        }

        return true;
    }

    hasUserId(uid:string):boolean
    {
        return this.userId2connId.has(uid);
    }    
}

export var UserManagerIns = new UserManager();