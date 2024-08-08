import { error, instantiate, Prefab, Node, Sprite, Color, UIOpacity, BlockInputEvents, UITransform, Input, EventTouch, tween, Vec3, v3, director, view, log, find, Canvas } from "cc";
import AppUtil from "../AppUtil";
import { UIConfig } from "../UIConfig";
import PanelBase from "./PanelBase";
import TopBlock from "./TopBlock";
import ResMgr from "../ResMgr";
import LayerMgr from "./LayerMgr";
import AppConstants from "../AppConstants";
import App from "../App";


/** UI栈结构体 */
export interface PanelInfo {
    uiId: number;
    uiView: PanelBase;
}

export default class PanelMgr {
    // 所有面板
    private static _panels: Map<number, PanelInfo> = new Map();

    private static _maskName = "_mask";
    private static _maskPrefab: Node;

    public static init() {
        this._panels.clear()

        if (!this._maskPrefab || !this._maskPrefab.isValid) {
            this._maskPrefab = AppUtil.newSpriteNode(this._maskName);
            this._maskPrefab.getComponent(Sprite).color = Color.BLACK;
            this._maskPrefab.addComponent(UIOpacity).opacity = 0;
        }
    }

    public static async open(uiId: number, ...panelArgs: any[]) {
        TopBlock.show();

        let currentPanelInfo = this._panels.get(uiId)
        let panelView = null

        if (!currentPanelInfo) {
            let uiConfig = UIConfig.UICF[uiId];
            let panelNode = null;

            if (uiConfig.bundleName == "null") {
                const panelPrefab = find(uiConfig.prefab, LayerMgr.canvasNode);

                if (!panelPrefab) {
                    TopBlock.hide()
                    console.error(`PanelMgr.show cc.find 找不到[${uiId}] 面板场景对象:${uiConfig.prefab}`)
                    return
                }

                panelNode = instantiate(panelPrefab);
            }
            else {
                const [panelPrefab, err] = await AppUtil.asyncWrap<Prefab>(ResMgr.load(uiConfig.bundleName, uiConfig.prefab))
                if (err) {
                    TopBlock.hide();
                    console.error(`PanelMgr.show load bundleName:${uiConfig.bundleName},skinPath:${uiConfig.prefab},err:${err}`)
                    return
                }

                panelNode = instantiate(panelPrefab);
            }

            panelView = panelNode.getComponent(PanelBase);

            if (null == panelView) {
                error(`Panel open getComponent ${uiId} failed,uiView null, path: ${uiConfig.prefab}`);
                panelNode.destroy();
                return;
            }

            LayerMgr.setLayer(panelView.node, AppConstants.viewLayer.Panel);
            this.maskStyle(panelView);

            currentPanelInfo = { uiId: uiId, uiView: panelView };
            this._panels.set(uiId, currentPanelInfo);
        }
        else {
            panelView = currentPanelInfo.uiView;
            LayerMgr.setLayer(panelView.node, AppConstants.viewLayer.Panel);
        }

        panelView.node.active = false;
        panelView.onOpen(uiId, 0, ...panelArgs);
        this.onOpenUI(currentPanelInfo);
    }

    private static onOpenUI(panelInfo: PanelInfo) {
        let panelView = panelInfo.uiView

        switch (panelView.panelShowStyle) {
            case AppConstants.panelShowStyle.Normal:
                this.showNormal(panelInfo)
                break;
            case AppConstants.panelShowStyle.CenterSmallToBig:
                this.showCenterScale(panelInfo);
                break;
            case AppConstants.panelShowStyle.LeftToCenter:
                {
                    const visibleSize = view.getVisibleSize(); // 获取可见区域尺寸（窗口大小）
                    let winWidth = visibleSize.width
                    this.showSideToCenter(panelInfo, v3(-winWidth, 0, 0))
                }

                break
            case AppConstants.panelShowStyle.RightToCenter:
                {
                    const visibleSize = view.getVisibleSize(); // 获取可见区域尺寸（窗口大小）
                    let winWidth = visibleSize.width
                    this.showSideToCenter(panelInfo, v3(winWidth, 0, 0))
                }
                break
            case AppConstants.panelShowStyle.DownToCenter:
                {
                    const visibleSize = view.getVisibleSize(); // 获取可见区域尺寸（窗口大小）
                    let height = visibleSize.height
                    this.showSideToCenter(panelInfo, v3(0, height, 0))
                }
                break
            case AppConstants.panelShowStyle.UpToCenter:
                {
                    const visibleSize = view.getVisibleSize(); // 获取可见区域尺寸（窗口大小）
                    let height = visibleSize.height
                    this.showSideToCenter(panelInfo, v3(0, -height, 0))
                }
                break
            case AppConstants.panelShowStyle.Custom:
                {
                    if (!panelView.tweenShow) {
                        this.showNormal(panelInfo)
                    }
                    else {
                        this.showCustom(panelInfo);
                    }
                }
                break;
        }

        this.showPanelAfter(panelView)
    }

    private static showNormal(panelInfo: PanelInfo) {
        let panelView = panelInfo.uiView
        panelView.node.active = true
        panelView.firstShow();
    }

    /** 中间变大 */
    private static showCenterScale(panelInfo: PanelInfo) {
        let panelView = panelInfo.uiView
        panelView.node.scale = Vec3.ZERO;
        panelView.node.active = true

        tween(panelView.node).to(panelView.duration, { scale: Vec3.ONE }, panelView.easingShow).call(() => {
            //panelView.showed()
            this.showPanelAfter(panelView)
        }).start()
    }

    /** 从四边移动到中间 */
    private static showSideToCenter(panelInfo: PanelInfo, from: Vec3) {
        let panelView = panelInfo.uiView
        const to = Vec3.ZERO
        panelView.node.setPosition(from)
        panelView.from = from;
        panelView.node.active = true
        tween(panelView.node).to(panelView.duration, { position: to }, panelView.easingShow).call(() => {
            this.showPanelAfter(panelView)
        }).start()
    }

    private static showCustom(panelInfo: PanelInfo) {
        let panelView = panelInfo.uiView
        panelView.node.active = true
        panelView.tweenShow.call(() => {
            this.showPanelAfter(panelView)
        }).start()
    }

    private static showPanelAfter(go: PanelBase) {
        // 重置位置(有移动位置的显示方式遮罩位置会错乱)
        const mask = go.node.getChildByName(this._maskName)
        mask.setPosition(0, 0)

        if ((go.panelMaskStyle & AppConstants.panelMaskStyle.Black) > 0) {
            tween(mask.getComponent(UIOpacity)).to(0.1, { opacity: 125 }).call(() => {
                this.showPanelAfter2()
            }).start()
        } else {
            this.showPanelAfter2()
        }
    }

    private static showPanelAfter2() {
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

        if (!panelView.cache) {
            this._panels.delete(uiId)
            panelView.doDestroy();
            panelInfo = null
        }
    }

    private static closeUI(panelInfo: PanelInfo) {
        let panelView = panelInfo.uiView
        this.closeBefore(panelView);

        switch (panelView.panelShowStyle) {
            case AppConstants.panelShowStyle.Normal:
                this.destroy(panelInfo.uiId)
                this.showPanelAfter2()
                break;
            case AppConstants.panelShowStyle.CenterSmallToBig:
                {
                    tween(panelView.node).to(panelView.duration, { scale: Vec3.ZERO }, panelView.easingHide).call(() => {
                        this.destroy(panelView.uiId)
                        this.showPanelAfter2()
                    }).start()
                }
                break;
            case AppConstants.panelShowStyle.LeftToCenter:
            case AppConstants.panelShowStyle.RightToCenter:
            case AppConstants.panelShowStyle.DownToCenter:
            case AppConstants.panelShowStyle.UpToCenter:
                {
                    tween(panelView.node).to(panelView.duration, { position: panelView.from }, panelView.easingHide).call(() => {
                        this.destroy(panelView.uiId)
                        this.showPanelAfter2()
                    }).start()
                }
                break;
            case AppConstants.panelShowStyle.Custom:
                {
                    panelView.tweenHide.call(() => {
                        this.destroy(panelView.uiId)
                        this.showPanelAfter2()
                    }).start()
                }
                break;
        }
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

        TopBlock.show();
        this.closeUI(panelInfo);
    }

    private static maskStyle(panelView: PanelBase): void {
        const mask = instantiate(this._maskPrefab)
        panelView.node.insertChild(mask, 0) //渲染在 skin 最底层
        AppUtil.setWidget(mask, panelView.node.parent) //跟 Panel 层级一样大小

        if ((panelView.panelMaskStyle & AppConstants.panelMaskStyle.NoThrough) > 0) {
            mask.addComponent(BlockInputEvents);
        }

        if ((panelView.panelMaskStyle & AppConstants.panelMaskStyle.Close) > 0) {
            // 面板如果没设置 NoThrough 属性是不会有 cc.BlockInputEvents 组件的
            if (!mask.getComponent(BlockInputEvents)) {
                mask.addComponent(BlockInputEvents)
            }

            // 点击面板内的ui元素不会关闭面板
            mask.on(Input.EventType.TOUCH_START, (et: EventTouch) => {
                const worldPos = et.getLocation();
                // AppUtil.debugWithColor(worldPos.toString());

                for (const child of panelView.node.children) {
                    if (child == mask)
                        continue;

                    let uiTransform = child.getComponent(UITransform);

                    if (uiTransform.hitTest(worldPos)) {
                        AppUtil.debugWithColor(`hit in! ${child.getWorldPosition()}  ${uiTransform.getBoundingBox()}`);
                        return;
                    }
                }

                this.hide(panelView.uiId);
            });
        }
    }

    private static closeBefore(panelView: PanelBase) {
        // 如果有 半透明 组件，先隐藏组件
        if ((panelView.panelMaskStyle & AppConstants.panelMaskStyle.Black) > 0) {
            const mask = panelView.node.getChildByName(this._maskName)
            mask.getComponent(UIOpacity).opacity = 0
        }
    }

    // 判断 Panel 是否打开
    public static isAlive(uiId: number): boolean {
        return this._panels.has(uiId) && this._panels.get(uiId).uiView.node.active
    }


    // 更新 Panel
    public static updateView(uiId: number, ...args: any[]) {
        if (!this.isAlive(uiId)) {
            console.error('PanelMgr.updateView [%s] 更新 view 失败, 未打开或未激活', uiId)
            return
        }

        this._panels.get(uiId).uiView.updateView(args)
    }

    // 隐藏所有 Panel
    public static hideAll() {
        this._panels.forEach(panel => {
            if (panel.uiView.node.active) {
                this.destroy(panel.uiId)
            }
        })
    }
}