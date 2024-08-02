import { log, Node } from 'cc';
import LayerMgr from "./view/LayerMgr"
import { UIMgr } from './view/UIMgr';
import { UIConfig,UIID } from './UIConfig';

export default class App {
    private static _uiMainUIId:number = UIID.UIMain;

    // 初始化
    public static init() {
        this.initFramework();
    }

    // 递归显示节点信息
    public static showNode(node: Node, sep: string = '', depth: number = 0, depthMax: number = 4) {
        log(sep + node.name + ':' + node.getSiblingIndex() + ':' + node.active)
        
        if (node.children.length <= 0) return

        depth++
        if (depth >= depthMax) return

        node.children.forEach(child => this.showNode(child, sep + '\t', depth, depthMax))
    }

    // 初始化框架
    private static initFramework() {
        LayerMgr.init()
        UIMgr.inst.initUIConf( this._uiMainUIId);
    }
}