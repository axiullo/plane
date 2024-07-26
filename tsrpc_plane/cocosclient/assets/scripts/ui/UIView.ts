/**
 * 界面基类
 */
import { _decorator, Asset, Component, Enum, Node } from 'cc';
const { ccclass, property } = _decorator;

/** 界面展示类型 */
export enum UIShowTypes {
    UIFullScreen,       // 全屏显示，全屏界面使用该选项可获得更高性能
    UIAddition,         // 叠加显示，性能较差
    UISingle,           // 单界面显示，只显示当前界面和背景界面，性能较好
};

@ccclass('UIView')
export class UIView extends Component {
    public get uiname(): string {
        return this.constructor.name;
    }

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


    public onOpen(fromUI: number, ...uiArgs: any): void {
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
     * 当界面被置顶时回调，Open时并不会回调该函数
     * @param preID 前一个ui
     * @param args 可变参数，
     */
    public onTop(preID: number, ...args: any): void {

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
 * 组件销毁时自动释放所有keep的资源
 */
    public onDestroy() {
        this.releaseAssets();
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
}


