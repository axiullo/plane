import { _decorator, log, Node, game, Game, Label, EventHandler, Event, math, Button, Sprite, ProgressBar } from 'cc';
import { UIView } from './UIView';
import { WButton } from '../components/WButton';
import { WProgressBar } from '../components/WProgressBar';
const { ccclass, property } = _decorator;

const MsMax = 1000;
const SecMax = 60;
const MinMax = 60;
const HourMax = 24;
const ScaleTotal = 60; //小刻度总个数
const NumTotal = 12; //表盘上总共有12个数字
const PerSecScale = 360 / ScaleTotal; //每秒之间的角度
const PerNumScale = 360 / NumTotal; //数字之间的角度

@ccclass('UIClock')
export class UIClock extends UIView {
    @property(Node)
    private minHand: Node = null;
    @property(Node)
    private secHand: Node = null;
    @property(Node)
    private hourHand: Node = null;
    @property(Label)
    private title: Label = null;
    @property(WButton)
    private resetBtn: WButton = null;
    @property(WProgressBar)
    private progressBar: WProgressBar = null;

    private curms: number = 0; //
    private cursec: number = 0; //
    private curmin: number = 0; //
    private curhour: number = 0; //
    private setTs: number = 0; //设置的时间戳

    public onOpen(fromUI: number, ...uiArgs: any): void {
        this.fromUIId = fromUI;
    }

    onLoad(): void {
        log("onLoad", this.name, this.uiname);

        this.title.string = "时钟";

        //https://docs.cocos.com/creator/3.8/api/zh/class/Button
        this.resetBtn.transition = Button.Transition.SCALE;
        const clickEventHandler = new EventHandler();
        clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = 'UIClock';// 这个是脚本类名
        clickEventHandler.handler = 'OnResetClick';
        clickEventHandler.customEventData = 'hello';
        this.resetBtn.clickEvents.push(clickEventHandler);
        this.resetBtn.setText("重置");
        this.resetBtn.setFontSize(50);
        this.resetBtn.node.on(Node.EventType.MOUSE_ENTER, this.BtnEnter); //监听事件
        this.resetBtn.setDisabled(false);

        this.setTs = 1721868436 * 1000;

        //this.progressBar.progress = 0.5;

        // setTimeout(() => {
        //     game.frameRate = 30; //设置帧率
        // }, 10000);

        // game.on(Game.EVENT_HIDE, function () {
        //     console.log("游戏进入后台");
        //     //this.doSomeThing();
        //     this.enabled = false;
        // }, this);


        // game.on(Game.EVENT_SHOW, function () {
        //     console.log("游戏进入前台");
        //     this.enabled = true;
        //     this.show();
        // }, this);
    }

    start() {
        log("start");
    }

    update(deltaTime: number) {
        this.curms += (deltaTime * 1000);

        if (this.curms >= MsMax) {
            let addnum = Math.floor(this.curms / MsMax);
            this.curms %= MsMax;
            this.cursec += addnum;

            if (this.cursec >= SecMax) {
                this.cursec -= SecMax;
                this.curmin += 1;

                if (this.curmin >= MinMax) {
                    this.curmin -= MinMax;
                    this.curhour += 1;

                    if (this.curhour >= HourMax) {
                        this.curhour -= HourMax;
                    }
                }
            }

            this.refreshHands();
        }

        this.progressBar.progress = this.curms / MsMax;
    }

    public show() {
        this.initData();
    }

    //刷新指针
    private refreshHands() {
        let secAngle = this.cursec * PerSecScale * -1;
        let minAngle = this.curmin * PerSecScale * -1;

        let hourNum = this.curhour;

        if (hourNum > NumTotal) {
            hourNum = hourNum % NumTotal;
        }

        let hourAngle = Math.floor((hourNum + this.curmin / MinMax) * PerNumScale) * -1;

        this.secHand.angle = secAngle;
        this.minHand.angle = minAngle;
        this.hourHand.angle = hourAngle;
    }

    initData() {
        let nowtime = new Date();

        if (this.setTs > 0) {
            nowtime = new Date(this.setTs);
        }

        this.curhour = nowtime.getHours();
        this.curmin = nowtime.getMinutes();
        this.cursec = nowtime.getSeconds();
        this.curms = nowtime.getMilliseconds();
        this.refreshHands();
    }

    protected onEnable(): void {
        log("onEnable");
    }

    protected onDisable(): void {
        log("onDisable");
    }

    public onDestroy(): void {
        log("onDestroy");
    }

    OnResetClick(event: Event, customEventData: string) {
        log(`OnResetClick customEventData= ${customEventData}`);

        this.setTs = 0;
        const resetBtn = event.target.getComponent(WButton);  //target 是触发事件节点的node
        resetBtn.setDisabled(true);

        setTimeout(() => {
            resetBtn.setDisabled(false);
        }, 3000);
    }

    BtnEnter(event: Event): void {
        log("BtnEnter event");
    }
}