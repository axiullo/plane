export interface user {
    userid: string; //用户id
    createtime: number; //创建时间
    password: string; //密码
}

//全局表
export interface sys {
    autoid: number; //全局的自增id
}

//所有集合类型
export interface DbCollectionType {
    // 表名：类型名
    user: user,
}

//所有集合类型
export type AllCollectionType = user | sys;