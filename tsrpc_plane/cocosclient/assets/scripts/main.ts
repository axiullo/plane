import { _decorator, Component, Game, game, instantiate, log, Node, Prefab, sys } from 'cc';
const { ccclass, property } = _decorator;
import { ModNet } from './mod/modnet';
import { UIMgr } from './UIMgr';
import { UIID } from './UIConfig';
import { AudioMgr } from './AudioMgr';
import App from './App';

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

        App.init();
    }

    start() {
        //ModNet.getInstance().connect();
        UIMgr.inst.open(UIID.UIMain);

        //this.scheduleOnce(() => App.showNode(LayerMgr.canvasNode), 1)

        //todo 不能同时播放多个文件
        AudioMgr.inst.play("bg");

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
}


