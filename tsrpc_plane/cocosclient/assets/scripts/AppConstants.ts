// 原文作者：mirahs
// 转自链接：https://learnku.com/articles/86861
// 版权声明：著作权归作者所有。商业转载请联系作者获得授权，非商业转载请保留以上作者信息和原文链接。



export default class AppConstants {
    // View 层级   设置的SiblingIndex的值，所以这里值没有意义了。
    public static readonly viewLayer = {
        // UI
        UI: 100,
        // 面板
        Panel: 200,
        // 顶层
        Top: 900,
    }

    // Panel 显示方式
    public static readonly panelShowStyle = {
        // 正常出现
        Normal: 1,
        // 中间变大
        CenterSmallToBig: 2,
        // 上往中
        UpToCenter: 3,
        // 下往中
        DownToCenter: 4,
        // 左往中
        LeftToCenter: 5,
        // 右往中
        RightToCenter: 6,
        // 自定义
        Custom: 7,
    }

    // Panel 遮罩类型
    public static readonly panelMaskStyle = {
        // 不可穿透
        NoThrough: 0b1,
        // 半透明
        Black: 0b10,
        // 关闭组件
        Close: 0b100,
    }
}


