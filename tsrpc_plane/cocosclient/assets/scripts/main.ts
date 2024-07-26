import { _decorator, Component, Game, game, log, Node } from 'cc';
const { ccclass, property } = _decorator;
import { ModNet } from './mod/modnet';
import { UIMgr } from './UIMgr';
import { UIConfig, UIID } from './UIConfig';
import { AudioMgr } from './AudioMgr';
@ccclass('main')
export class main extends Component {

    onLoad() {
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

        UIMgr.inst.initUIConf(UIConfig.UICF);
    }

    start() {
        //ModNet.getInstance().connect();
        UIMgr.inst.open(UIID.UIClock);

        //todo 不能同时播放多个文件
        AudioMgr.inst.play("bg");

        setTimeout(() => {
            AudioMgr.inst.playOneShot("player");
        }, 10000);


        // setTimeout(() => {
        //     UIManager.getInstance().closeUIByUiId(UIID.UIClock);
        // }, 5000);
    }

    update(deltaTime: number) {

    }
}


