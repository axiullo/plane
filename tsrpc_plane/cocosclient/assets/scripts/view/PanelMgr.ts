import { error, instantiate, Prefab } from "cc";
import AppUtil from "../AppUtil";
import { UIConfig } from "../UIConfig";
import PanelBase from "./PanelBase";
import TopBlock from "./TopBlock";
import ResMgr from "../ResMgr";
import LayerMgr from "./LayerMgr";
import AppConstants from "../AppConstants";
import { UIView } from "./UIView";


/** UI栈结构体 */
export interface PanelInfo {
    uiId: number;
    uiView: UIView;
}

export default class PanelMgr {
    // 所有面板
    private static _panels: Map<number, PanelInfo> = new Map();

    public static async open(uiId: number, ...panelArgs: any[]) {
        TopBlock.show();

        let uiConfig = UIConfig.UICF[uiId];

        const [panelPrefab, err] = await AppUtil.asyncWrap<Prefab>(ResMgr.load(uiConfig.bundleName, uiConfig.prefab))
        if (err) {
            TopBlock.hide();
            console.error(`PanelMgr.show load bundleName:${uiConfig.bundleName},skinPath:${uiConfig.prefab},err:${err}`)
            return
        }

        let panelNode = instantiate(panelPrefab);
        let panelView = panelNode.getComponent(PanelBase);

        if (null == panelView) {
            error(`Panel open getComponent ${uiId} failed,uiView null, path: ${uiConfig.prefab}`);
            panelNode.destroy();
            return;
        }

        LayerMgr.setLayer(panelView.node, AppConstants.viewLayer.Panel);
        let panelInfo = { uiId: uiId, uiView: panelView };
        this._panels.set(uiId, panelInfo);
        //this._panels[uiId] = panelInfo;
        panelView.node.active = false;
        panelView.onOpen(uiId, 0, ...panelArgs);
        this.onOpenUI(panelInfo, true);
    }

    private static onOpenUI(panelInfo: PanelInfo, isOpen: boolean) {
        let panelView = panelInfo.uiView

        switch (panelView.showStyle) {
            case AppConstants.panelShowStyle.Normal:
                this.showNormal(panelInfo, isOpen)
                break;
        }

        this.showPanelAfter()
    }

    private static showNormal(panelInfo: PanelInfo, isOpen: boolean) {
        let panelView = panelInfo.uiView

        if (isOpen) {
            panelView.node.active = true
            panelView.firstShow();
        } else {
            this.destroy(panelInfo.uiId)
        }
    }

    private static showPanelAfter() {
        TopBlock.hide()
    }

    // 销毁 Panel
    public static destroy(uiId: number) {
        if (!this._panels.has(uiId)) {
            console.error(`PanelMgr.destroy 面板[${uiId}]不存在`)
            return
        }

        let panelInfo = this._panels.get(uiId)
        let panelView = panelInfo.uiView
        panelView.hiding()
        panelView.node.active = false
        panelView.hided()

        this._panels.delete(uiId)

        panelView.destroy()
        panelInfo = null
    }


    // 隐藏 Panel
    public static hide(uiId: number) {
        if (!this._panels.has(uiId)) {
            console.error(`PanelMgr.hide 面板[${uiId}]不存在`)
            return
        }

        const panelInfo = this._panels.get(uiId)
        let panelView = panelInfo.uiView

        if (!panelView.node.active) {
            console.error(`PanelMgr.hide 面板[${uiId}]已隐藏`)
            return
        }

        TopBlock.show()
        this.onOpenUI(panelInfo, false)
    }
}