import { _decorator, Component, director, error, Game, game, instantiate, Layers, log, Node, Prefab, sys, view } from 'cc';
const { ccclass, property } = _decorator;
import { ModNet } from './mod/modnet';
import { UIMgr } from './view/UIMgr';
import { UIID } from './UIConfig';
import { AudioMgr } from './AudioMgr';
import App from './App';
import { UIMain } from './ui/UIMain';
import { UIBag } from './ui/UIBag';
import PanelMgr from './view/PanelMgr';
import AppUtil from './AppUtil';
import LayerMgr from './view/LayerMgr';
import Core from './core/Core';

@ccclass('main')
export class main extends Component {
    async onLoad() {
        if (sys.isBrowser) {
            document.title = "MyCustomTitle";
        }

        this.setupGlobalErrorHandler();

        game.on(Game.EVENT_HIDE, function () {
            console.log("游戏进入后台");
            //this.doSomeThing();
        }, this);


        game.on(Game.EVENT_SHOW, function () {
            console.log("游戏进入前台");
            var topui = UIMgr.inst.getTopUI();

            if (topui != null) {
                topui.show();
            }

        }, this);

        // director.loadScene('game', () => {
        //     App.onSceneLoaded()
        // })

        App.init(null, Layers.Enum.UI_2D);
        Core.init()
        UIMgr.inst.open(UIID.UIMain);

        const visibleSize = view.getVisibleSize();
        log(visibleSize);

        this.getCurrentOrientation();
    }

    start() {
        //ModNet.getInstance().connect();



        //todo 不能同时播放多个文件
        // AudioMgr.inst.play("bg");

        // 5 秒后调用
        // this.scheduleOnce(() => {
        //     if (!UIMgr.inst.updateView(UIMain, '血量-10', '体力-5')) {
        //         error('更新 UIMain 失败')
        //     }
        // }, 5)

        // // 10 秒后调用
        // this.scheduleOnce(() => {
        //     if (!UIMgr.inst.updateView(UIBag, '血量+10', '金币-10')) {
        //         error('更新 UIBag 失败')
        //     }
        // }, 10)

        // setTimeout(() => {
        //     AudioMgr.inst.playOneShot("player");
        // }, 10000);


        // setTimeout(() => {
        //     UIManager.getInstance().closeUIByUiId(UIID.UIClock);
        // }, 5000);
    }

    update(deltaTime: number) {

    }

    setupGlobalErrorHandler() {
        window.onerror = (message, source, lineno, colno, error) => {
            this.logError(`Error: ${message} at ${source}:${lineno}:${colno}`, error);
        };

        window.addEventListener('unhandledrejection', event => {
            this.logError('Unhandled Rejection:', event.reason);
        });
    }

    logError(message, error) {
        // 在控制台输出错误信息
        console.error(message, error);

        // 你也可以在这里添加自定义的错误处理逻辑，例如将错误发送到服务器
    }

    // 获取当前屏幕的朝向
    getCurrentOrientation() {
        switch (screen.orientation.type) {
            case "landscape-primary":
                console.log("That looks good.");
                break;
            case "landscape-secondary":
                console.log("Mmmh… the screen is upside down!");
                break;
            case "portrait-secondary":
            case "portrait-primary":
                console.log("Mmmh… you should rotate your device to landscape");
                break;
            default:
                console.log("The orientation API isn't supported in this browser :(");
        }

    }
}


