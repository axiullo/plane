export interface base {
    id: string; //主键
    iid?:string; //二级的主键
    [key:string]:any; //index赋值
}

export interface user extends base {
    userid: string; //用户id
    createtime: number; //创建时间
    password: string; //密码
    lastlogin:number; //上次登录时间
    name:string; //昵称
}

export interface apple extends base {
    day0:number; //
    isqiandao:boolean; //是否签到
}

//全局表
export interface sys extends base {
    autoid: number; //全局的自增id
}



// //所有集合类型
// export interface DbCollectionType {
//     // 表名：类型名
//     user: user,
// }

// //所有集合类型
// export type AllCollectionType = user | sys;