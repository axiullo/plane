import { Canvas, Color, debug, director, ImageAsset, Node, Sprite, SpriteFrame, Texture2D, UITransform, Widget } from 'cc';
import { UIView } from './view/UIView';


export default class AppUtil {
    /**
     * 添加对齐组件(默认铺满父节点)
     * @param node 要添加对齐组件的节点
     * @param target 对齐目标(不设置默认父节点)
     */
    public static setWidget(node: Node, target: Node = null, top: number = 0, bottom: number = 0, left: number = 0, right: number = 0) {
        if (node.getComponent(Widget))
            return

        const widget = node.addComponent(Widget)

        if (target)
            widget.target = target

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
    public static debugWithColor(message: string, style: string = null) {
        if (!style) {
            style = "color:blue;font-size: 16px;"
        }

        // console.log("%c" + message, style);
        debug("%c" + message, style);
    }

    public static getUIName(viewCls: any): string {
        return (new viewCls() as UIView).uiName;
    }

    // 生成默认白色 100x100 大小 Sprite (单色) 节点
    public static newSpriteNode(name: string = 'newSpriteNode'): Node {
        let width = 1;
        let height = 1;
        let color: Color = new Color(255, 255, 255, 255);

        const data: any = new Uint8Array(width * height * 4)

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                data[index] = color.r;     // R
                data[index + 1] = color.g; // G
                data[index + 2] = color.b; // B
                data[index + 3] = color.a; // A
            }
        }

        const image = new ImageAsset();
        image.reset({
            _data: data,
            _compressed: false,
            width: width,
            height: height,
            format: Texture2D.PixelFormat.RGBA8888
        });

        const texture = new Texture2D()
        texture.image = image;

        const spriteFrame = new SpriteFrame()
        spriteFrame.texture = texture;
        spriteFrame.packable = false;

        const node = new Node(name)
        const sprite = node.addComponent(Sprite)
        sprite.sizeMode = Sprite.SizeMode.CUSTOM
        sprite.spriteFrame = spriteFrame

        const uiTransform = node.addComponent(UITransform);
        uiTransform.width = 100;
        uiTransform.height = 100;
        return node
    }
}