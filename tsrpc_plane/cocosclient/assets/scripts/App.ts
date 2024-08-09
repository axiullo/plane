import { Layers, log, Node } from 'cc';
import LayerMgr from "./view/LayerMgr"
import { UIMgr } from './view/UIMgr';
import { UIConfig, UIID } from './UIConfig';
import PanelMgr from './view/PanelMgr';

export default class App {
    private static _uiMainUIId: number = UIID.UIMain;
    private static _viewLayer: number = Layers.Enum.DEFAULT;

    // 初始化
    public static init(uiMain?: number, viewLayer?: number) {
        if (uiMain)
            this._uiMainUIId = uiMain

        if (viewLayer)
            this._viewLayer = viewLayer

        this.initFramework();
    }

    // 递归显示节点信息
    public static showNode(node: Node, sep: string = '', depth: number = 0, depthMax: number = 4) {
        log(sep + node.name + ':' + node.getSiblingIndex() + ':active=' + node.active + ":isValid=" + node.isValid);

        if (node.children.length <= 0)
            return

        depth++

        if (depth >= depthMax)
            return

        node.children.forEach(child => this.showNode(child, sep + '\t', depth, depthMax))
    }

    // 初始化框架
    private static initFramework() {
        LayerMgr.init(this._viewLayer);
        UIMgr.inst.initUIConf(this._uiMainUIId);
        PanelMgr.init();
    }

    // 场景加载后回调
    public static onSceneLoaded() {
        this.initFramework()
    }
}