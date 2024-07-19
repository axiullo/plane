export enum UIID {
    UILogin,
    UIClock,
}

export interface UIConf {
    prefab: string;
    preventTouch?: boolean;
}

export class UIConfig{
    public static UICF: { [key: number]: UIConf } = {
        [UIID.UILogin]: { prefab: "prefab/login" },
        [UIID.UIClock]: { prefab: "prefab/clock" , preventTouch: true},
    }
}