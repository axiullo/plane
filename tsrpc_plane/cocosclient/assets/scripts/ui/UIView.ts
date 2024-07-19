/**
 * 界面基类
 */
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIView')
export class UIView extends Component {
    /**
     * 当界面被创建时回调，生命周期内只调用
     * @param args 可变参数
     */
    public init(...args : any): void {

    }
}


