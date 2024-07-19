import { __private, director, instantiate, log, Node, Prefab, resources, UITransform, view } from "cc";
import { UIView } from "./ui/UIView";
import { UIConf } from "./UIConfig";


export type ProgressCallback = __private._cocos_asset_asset_manager_deprecated__LoadProgressCallback;

/** UI栈结构体 */
export interface UIInfo {
    uiId: number;
    uiView: UIView | null;
    uiArgs: any;
    preventNode?: Node | null;
    zOrder?: number;
    openType?: 'quiet' | 'other';
    isClose?: boolean;
    resToClear?: string[];
    resCache?: string[];
}

export class UIManager {
    private static _instance: UIManager = null;

    /** UI配置 */
    private UIConf: { [key: number]: UIConf } = {};
    /** UI界面栈（{UIID + UIView + UIArgs}数组）*/
    private UIStack: UIInfo[] = [];
    /** UI待打开列表 */
    private UIOpenQueue: UIInfo[] = [];

    /** 是否正在打开UI */
    private isOpening = false;
    /** 是否正在关闭UI */
    private isClosing = false;

    public static getInstance(): UIManager {
        if (this._instance == null) {
            this._instance = new UIManager();
        }
        return this._instance;
    }

    /**
     * 初始化所有UI的配置对象
     * @param conf 配置对象
     * */
    public initUIConf(conf: { [key: number]: UIConf }): void {
        this.UIConf = conf;
    }

    /**
    * 设置或覆盖某uiId的配置
    * @param uiId 要设置的界面id
    * @param conf 要设置的配置
    */
    public setUIConf(uiId: number, conf: UIConf): void {
        this.UIConf[uiId] = conf;
    }

    /** 打开界面并添加到界面栈中 */
    public open(UIID: number, uiArgs: any = null, progressCallback: ProgressCallback | null = null) {
        let uiInfo: UIInfo = {
            uiId: UIID,
            uiArgs: uiArgs,
            uiView: null
        };

        if (this.isOpening || this.isClosing) {
            // 插入待打开队列
            this.UIOpenQueue.push(uiInfo);
            return;
        }

        let uiIndex = this.getUIIndex(UIID);
        if (-1 != uiIndex) {
            // 重复打开了同一个界面，直接回到该界面
            this.closeToUI(UIID, uiArgs);
            return;
        }

        // 设置UI的zOrder
        uiInfo.zOrder = this.UIStack.length + 1;
        this.UIStack.push(uiInfo);

        // 先屏蔽点击
        if (this.UIConf[UIID].preventTouch) {
            uiInfo.preventNode = this.preventTouch(uiInfo.zOrder);
        }

        this.isOpening = true;

        // 预加载资源，并在资源加载完成后自动打开界面
        this.getOrCreateUI(UIID, progressCallback, (uiView: UIView | null): void => {
            // 如果界面已经被关闭或创建失败
            if (uiInfo.isClose || null == uiView) {
                log(`getOrCreateUI ${UIID} faile!
                                close state : ${uiInfo.isClose} , uiView : ${uiView}`);

                this.isOpening = false;
                if (uiInfo.preventNode) {
                    uiInfo.preventNode.destroy();
                    uiInfo.preventNode = null;
                }
                return;
            }

            let prefab = this.loadUIPrefab(uiInfo: UIInfo);

            // 打开UI，执行配置
            this.onUIOpen(uiId, uiView, uiInfo, uiArgs);
            this.isOpening = false;
            this.autoExecNextUI();
        }, uiArgs);
    }

    public getUIIndex(uiId: number): number {
        for (let index = 0; index < this.UIStack.length; index++) {
            const element = this.UIStack[index];
            if (uiId == element.uiId) {
                return index;
            }
        }
        return -1;
    }

    /**
 * 关闭界面，一直关闭到顶部为uiId的界面，为避免循环打开UI导致UI栈溢出
 * @param uiId 要关闭到的uiId（关闭其顶部的ui）
 * @param uiArgs 打开的参数
 * @param bOpenSelf 
 */
    public closeToUI(uiId: number, uiArgs: any, bOpenSelf = true): void {
    }

    /**
 * 添加防触摸层
 * @param zOrder 屏蔽层的层级
 */
    private preventTouch(zOrder: number) {
        let node = new Node()
        node.name = 'preventTouch';

        let uiCom = node.addComponent(UITransform);
        uiCom.setContentSize(view.getVisibleSize());

        node.on(Node.EventType.TOUCH_START, function (event: any) {
            event.propagationStopped = true;
        }, node);

        let child = director.getScene()!.getChildByName('Canvas');
        child!.addChild(node);
        node.setSiblingIndex(zOrder - 0.01);
        return node;
    }

    /**
     * 加载UI预制体
     * @param uiName UI的名称
     */
    private async loadUIPrefab(uiInfo: UIInfo): Promise<Prefab | null> {
        return new Promise((resolve, reject) => {
            resources.load(uiInfo., Prefab, (err, prefab) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(prefab);
                }
            });
        });
    }

        /**
     * 异步加载一个UI的prefab，成功加载了一个prefab之后
     * @param uiId 界面id
     * @param processCallback 加载进度回调
     * @param completeCallback 加载完成回调
     * @param uiArgs 初始化参数
     */
        private getOrCreateUI(uiId: number, processCallback: ProgressCallback | null, completeCallback: (uiView: UIView | null) => void, uiArgs: any): void {
            // 如果找到缓存对象，则直接返回
            let uiView: UIView | null = this.UICache[uiId];
            if (uiView) {
                //todo 这里是不应该加上新的参数
                //uiView.init(uiArgs);
                completeCallback(uiView);
                return;
            }
    
            // 找到UI配置
            let uiPath = this.UIConf[uiId].prefab;
            if (null == uiPath) {
                log(`getOrCreateUI ${uiId} faile, prefab conf not found!`);
                completeCallback(null);
                return;
            }
    
            resLoader.load(uiPath, processCallback, (err, prefab) => {
                // 检查加载资源错误
                if (err) {
                    log(`getOrCreateUI loadRes ${uiId} faile, path: ${uiPath} error: ${err}`);
                    completeCallback(null);
                    return;
                }
                // 检查实例化错误
                let uiNode: Node = instantiate(prefab);
                if (null == uiNode) {
                    log(`getOrCreateUI instantiate ${uiId} faile, path: ${uiPath}`);
                    completeCallback(null);
                    prefab.decRef();
                    return;
                }
                // 检查组件获取错误
                uiView = uiNode.getComponent(UIView);
                if (null == uiView) {
                    log(`getOrCreateUI getComponent ${uiId} faile, path: ${uiPath}`);
                    uiNode.destroy();
                    completeCallback(null);
                    prefab.decRef();
                    return;
                }
                // 异步加载UI预加载的资源
                this.autoLoadRes(uiView, () => {
                    uiView!.init(uiArgs);
                    completeCallback(uiView);
                    uiView!.cacheAsset(prefab);
                })
            });
        }
}