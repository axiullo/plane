import { debug, Node, Widget } from 'cc';

export default class AppUtil {
    /**
     * 添加对齐组件(默认铺满父节点)
     * @param node 要添加对齐组件的节点
     * @param target 对齐目标(不设置默认父节点)
     */
    public static setWidget(node: Node, target: Node = null, top: number = 0, bottom: number = 0, left: number = 0, right: number = 0) {
        if (node.getComponent(Widget)) return

        const widget = node.addComponent(Widget)

        if (target) widget.target = target

        widget.isAlignTop = true
        widget.isAlignBottom = true
        widget.isAlignLeft = true
        widget.isAlignRight = true

        widget.top = top
        widget.bottom = bottom
        widget.left = left
        widget.right = right
    }

    // 异步封装
    public static async asyncWrap<T>(promise: Promise<T>): Promise<[T?, any?]> {
        try {
            return [await promise, null]
        } catch (error) {
            return [null, error]
        }
    }

    //带颜色的日志
    public static logWithColor(message: string, style: string = null) {
        if (!style) {
            style = "color:blue;font-size: 16px;"
        }

        // console.log("%c" + message, style);
        debug("%c" + message, style);
    }
}