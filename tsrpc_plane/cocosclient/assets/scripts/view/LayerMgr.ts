import { Node, debug, director, error, log } from 'cc';
import AppConstants from "../AppConstants"
import AppUtil from "../AppUtil"


export default class LayerMgr {
    private static viewLayer:number;

    // 层级及对应节点
    private static _layerMap: Map<number, Node> = new Map()
    private static _zIndex: number = 0

    // 初始化层级
    public static init(viewLayer:number) {
        this.viewLayer = viewLayer;

        // 框架初始化和切换场景后都会调用, 所以要清除之前的数据
        this._layerMap.clear()

        for (const name in AppConstants.viewLayer) {
            const value = AppConstants.viewLayer[name] as number
            this.newLayer(name, value)
        }
    }

    private static _canvasNode: Node = null;

    public static get canvasNode() {
        if (!this._canvasNode) {
            this._canvasNode = director.getScene().getChildByName('Canvas');
        }

        return this._canvasNode;
    }

    /**
     * 创建新层级
     * @param name 层级名称
     * @param value 层级 zIndex
     * @returns
     */
    public static newLayer(name: string, value: number) {
        let layer = this.canvasNode.getChildByName(name);
        if (layer) return

        layer = new Node(name)
        layer.parent = this.canvasNode;
        layer.layer = this.viewLayer;
        layer.setSiblingIndex(value);

        // 挂载 Widget 组件, 保持跟 Canvas 一样大小
        AppUtil.setWidget(layer)

        this._layerMap.set(value, layer)
    }

    /**
     * 为节点设置层级父节点并把节点显示在最上层
     * @param node 节点
     * @param layer 层级
     */
    public static setLayer(node: Node, layer: number) {
        const layerNode = this._layerMap.get(layer)

        if (!layerNode) {
            error(`LayerMgr.setLayer layer[${layer}] 不存在`)
            return
        }

        if (!node.parent) {
            node.parent = layerNode
        }

        //AppUtil.debugWithColor("$$$ ui node set parent");

        node.setSiblingIndex(this._zIndex++);
    }
}