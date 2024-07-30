export enum UIID {
    UILogin,
    UIClock,
    UIMain,
    UIBag,
}

export interface UIConf {
    prefab: string;
    preventTouch?: boolean;
    bundlename?: string;
}

export class UIConfig {
    public static UICF: { [key: number]: UIConf } = {
        [UIID.UILogin]: { prefab: "prefab/login" },
        [UIID.UIClock]: { prefab: "prefab/clock", preventTouch: true },
        [UIID.UIMain]: { prefab: "prefab/uimain" },
        [UIID.UIBag]: { prefab: "prefab/uibag" },
    }
}