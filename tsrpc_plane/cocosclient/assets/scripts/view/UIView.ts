/**
 * 界面基类
 */
import { _decorator, Asset, Component, Enum, log, Node, UIOpacity } from 'cc';
import AppUtil from '../AppUtil';

const { ccclass, property } = _decorator;

/** 界面展示类型 */
export enum UIShowTypes {
    UIFullScreen,       // 全屏显示，全屏界面使用该选项可获得更高性能
    UIAddition,         // 叠加显示，性能较差
    UISingle,           // 单界面显示，只显示当前界面和背景界面，性能较好
};

// UI 显示方式
export enum UIShowStyle {
    // 默认
    Normal = 1,
    // 渐入
    FadeIn,
}

@ccclass('UIView')
export class UIView extends Component {
    public get uiName(): string {
        return this.constructor.name;
    }

    public uiId: number;
    private resCache = new Set<Asset>();
    protected fromUIId: number = 0; //
    protected isfirst: boolean = true;

    /** 快速关闭 */
    @property
    quickClose: boolean = false;
    /** 界面显示类型 */
    @property({ type: Enum(UIShowTypes) })
    showType: UIShowTypes = UIShowTypes.UISingle;
    /** 缓存选项 */
    @property
    cache: boolean = false;
    @property({ type: Enum(UIShowStyle) })
    showStyle: UIShowStyle = UIShowStyle.Normal;

    public duration: number = 0.5;

    public onOpen(uiId, fromUI: number = 0, ...uiArgs: any): void {
        this.uiId = uiId;
        this.fromUIId = fromUI;
    }

    //第一次展示, 没有特殊操作子类不需要实现
    public firstShow() {
        this.isfirst = false;
        this.show();
    }

    public show() {

    }

    public onClose(): void {

    }

    /**
 * 缓存资源  暂时没啥用
 * @param asset 
 */
    public cacheAsset(asset: Asset) {
        if (!this.resCache.has(asset)) {
            asset.addRef();
            this.resCache.add(asset);
        }
    }

    /**
     * 释放资源，组件销毁时自动调用
     */
    public releaseAssets() {
        this.resCache.forEach(element => {
            element.decRef();
        });
        this.resCache.clear();
    }

    // 开始隐藏
    public hiding() {
        this.onHiding()
    }

    // 隐藏完成
    public hided() {
        this.onHided()
    }

    // 销毁
    public doDestroy() {
        this.onDestroy()
        this.node.destroy()
    }

    /**
 * * 组件销毁时自动释放所有keep的资源
 *  */
    public onDestroy() {
        this.releaseAssets();
    }

    protected onHiding() { }
    protected onHided() { }

    public get opacity() {
        let opacityComponent = this.getComponent(UIOpacity);

        if (!opacityComponent) {
            AppUtil.debugWithColor(`${this.uiName} does not have an opacity component`);
        }

        if (opacityComponent)
            return opacityComponent.opacity;

        return 0;
    }

    public set opacity(value: number) {
        let opacityComponent = this.getComponent(UIOpacity);

        if (!opacityComponent) {
            AppUtil.debugWithColor(`${this.uiName} does not have an opacity component`);
            return;
        }

        opacityComponent.opacity = value;
    }

    public updateView(args: any[]) {
        this.onUpdateView(args);
    }

    protected onUpdateView(args: any[]): void {
        log('args:', args)
    }
}