import BattleConst from "./BattleConst";
import PoolManager from "../../core/manager/PoolManager";
import BaseView from "../../core/component/BaseView";

export default class BattleView extends BaseView {

    //play
    play: cc.Node = null;

    laneUp: cc.Node = null;

    laneDown: cc.Node = null;

    noteItem: cc.Node = null;

    pauseBtn: cc.Button = null;

    timeLabel: cc.Label = null;

    scoreLabel: cc.Label = null;

    upVec: cc.Vec2 = null;

    downVec: cc.Vec2 = null;

    touchLeft: cc.Node = null;

    touchRight: cc.Node = null;
    
    //fail
    fail:cc.Node = null;
    exitBtn:cc.Button = null;
    videoBtn:cc.Button = null;

    //map

    map: cc.Node;

    backPart1: cc.Node = null;

    backPart2: cc.Node = null;

    middlePart1: cc.Node = null;

    middlePart2: cc.Node = null;

    frontPart1: cc.Node = null;

    frontPart2: cc.Node = null;


    public constructor() {
        super();
        this.viewName = "BattleView";
    }


    //加载成功，初始化界面
    protected loadSucc(asset: cc.Prefab) {
        super.loadSucc(asset);

        //play
        this.play = cc.find("Play", this.root);
        this.touchLeft = cc.find("Play/TouchLeft", this.root);
        this.touchLeft.on(cc.Node.EventType.TOUCH_START, this.onTouchLeftStart, this);
        this.touchLeft.on(cc.Node.EventType.TOUCH_END, this.onTouchLeftEnd, this);

        this.touchRight = cc.find("Play/TouchRight", this.root);
        this.touchRight.on(cc.Node.EventType.TOUCH_START, this.onTouchRightStart, this);
        this.touchRight.on(cc.Node.EventType.TOUCH_END, this.onTouchRightEnd, this);

        this.timeLabel = cc.find("TimeLabel", this.root).getComponent(cc.Label);
        this.scoreLabel = cc.find("ScoreLabel", this.root).getComponent(cc.Label);

        this.laneUp = cc.find("Play/LaneUp", this.root);
        this.laneDown = cc.find("Play/LaneDown", this.root);
        this.noteItem = cc.find("Play/NoteItem", this.root);
        this.noteItem.active = false;

        this.upVec = this.laneUp.position;
        this.downVec = this.laneDown.position;

        //fail

        this.fail = cc.find("Fail",this.root);

        this.exitBtn = cc.find("Fail/ExitBtn",this.root).getComponent(cc.Button);
        this.exitBtn.node.on(cc.Node.EventType.TOUCH_END, this.onExit, this);

        this.videoBtn = cc.find("Fail/VideoBtn",this.root).getComponent(cc.Button);
        this.videoBtn.node.on(cc.Node.EventType.TOUCH_END, this.onVideo, this);

        this.pauseBtn = cc.find("PauseBtn", this.root).getComponent(cc.Button);
        this.pauseBtn.node.on(cc.Node.EventType.TOUCH_END, this.onPause, this);

        PoolManager.getInstance().createPool(PoolManager.NOTE_POOL, this.noteItem);

        cc.systemEvent.dispatchEvent(new cc.Event(BattleConst.BATTLE_VIEW_OPEN_SUCC, false));
    }

    public initMap(prefab: cc.Prefab): void {
        this.map = cc.instantiate(prefab);
        this.root.addChild(this.map, -1, "Map");
        this.backPart1 = cc.find("Back/Part1", this.map);
        this.backPart2 = cc.find("Back/Part2", this.map);

        this.middlePart1 = cc.find("Middle/Part1", this.map);
        this.middlePart2 = cc.find("Middle/Part2", this.map);

        this.frontPart1 = cc.find("Front/Part1", this.map);
        this.frontPart2 = cc.find("Front/Part2", this.map);
        cc.log("初始化地图");
    }

    public updateMap(dt): void {
        this.updatePos(this.frontPart1, 4);
        this.updatePos(this.frontPart2, 4);

        this.updatePos(this.middlePart1, 2);
        this.updatePos(this.middlePart2, 2);

        this.updatePos(this.backPart1, 1);
        this.updatePos(this.backPart2, 1);
    }

    private updatePos(target: cc.Node, speed: number) {
        if (target != null) {
            var pos: cc.Vec2 = target.getPosition();
            pos.x -= speed;
            target.position = pos;
            if (pos.x <= -1280) {
                pos.x = 1280;
                target.position = pos;
            }
        }
    }

    public setMusicTime(time: number): void {
        this.timeLabel.string = Math.floor(time * 1000).toString();
    }

    public setLevName(name: string): void {
        this.scoreLabel.string = name;
    }

    private onTouchLeftStart(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(BattleConst.BATTLE_VIEW_TOUCH_LEFT_START, false));
    }

    private onTouchLeftEnd(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(BattleConst.BATTLE_VIEW_TOUCH_LEFT_END, false));
    }

    private onTouchRightStart(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(BattleConst.BATTLE_VIEW_TOUCH_RIGHT_START, false));
    }

    private onTouchRightEnd(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(BattleConst.BATTLE_VIEW_TOUCH_RIGHT_END, false));
    }

    private onPause(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(BattleConst.BATTLE_VIEW_PAUSE_CLICK, false));
    }

    private onExit():void
    {
        cc.systemEvent.dispatchEvent(new cc.Event(BattleConst.BATTLE_VIEW_EXIT_CLICK, false));
    }

    private onVideo():void
    {
        cc.systemEvent.dispatchEvent(new cc.Event(BattleConst.BATTLE_VIEW_VIDEO_CLICK, false));
    }

    public close(): void {
        super.close();
    }
}