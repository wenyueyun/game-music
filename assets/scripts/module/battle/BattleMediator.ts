import Mediator from "../../mvc/patterns/mediator/Mediator";
import IMediator from "../../mvc/interfaces/IMediator";
import INotification from "../../mvc/interfaces/INotification";
import BattleView from "./BattleView";
import NoteItem from "./NoteItem";
import BattleProxy from "./BattleProxy";
import MusicConfig from "../../core/config/AudioConfig";
import LevelConfig from "../../core/config/LevelConfig";
import Player from "../../core/entity/Player";
import BattleConst from "./BattleConst";
import GameConst from "../../core/const/GameConst";
import LevelConst from "../level/LevelConst";
import NoteConfig from "../../core/config/NoteConfig";
import PoolManager from "../../core/manager/PoolManager";
import ConfigManager from "../../core/manager/ConfigManager";
import PathConst from "../../core/const/PathConst";
import ResourceManager from "../../core/manager/ResourceManager";
import LoadingConst from "../loading/LoadingConst";
import OverConst from "../Over/OverConst";
import PauseConst from "../pause/PauseConst";
import MainConst from "../main/MainConst";
import Game from "../../Game";

export default class BattleMediator extends Mediator implements IMediator {
    public static NAME: string = "BattleMediator";
    private curAudio: number = -1;
    private noteArr: Array<NoteItem>;
    private musicConfig: MusicConfig;
    private levelConfig: LevelConfig;
    private defaultDis: number = 1200;
    private defaultTime: number = 5000;
    private speed: number = this.defaultDis / this.defaultTime;
    private curLev: number;
    private isPlay: boolean;
    private proxy: BattleProxy;
    private player: Player;
    private noteWidth: number;
    private audio: cc.AudioClip;

    private touchNote: NoteItem;

    private isTouchLeft: boolean; //是否按下左边
    private isTouchRight: boolean;//是否按下右边

    private isPressLeft: boolean;//是否按住左边
    private isPressRight: boolean;//是否按住右边

    private resArr: Array<string> = new Array<string>();

    private _isPause: boolean = false;


    public set isPause(v: boolean) {
        this._isPause = v;
        if (this.curAudio != -1) {
            if (v == true) {
                cc.audioEngine.pause(this.curAudio);
            }
            else {
                cc.audioEngine.resume(this.curAudio);
            }
        }
    }

    
    public get isPause() : boolean {
        return  this._isPause;
    }
    

    public constructor(viewComponent: any) {
        super(BattleMediator.NAME, viewComponent)
        this.proxy = <BattleProxy>(this.facade.retrieveProxy(BattleProxy.NAME));
        this.noteArr = new Array<NoteItem>();
    }

    public listNotificationInterests(): string[] {
        return [
            //mediator
            BattleConst.BATTLE_MEDIATOR_OPEN,
            BattleConst.BATTLE_MEDIATOR_CLOSE,
            BattleConst.BATTLE_MEDIATOR_RESTART,
            BattleConst.BATTLE_MEDIATOR_CONTINUE,
            BattleConst.BATTLE_MEDIATOR_EXIT,
            //evelt
            GameConst.GAME_UPDATE,
        ];
    }

    public getViewComponent(): BattleView {
        return this.viewComponent as BattleView;
    }

    public onRegister() {
        super.onRegister();
    }

    public handleNotification(notification: INotification): void {
        super.handleNotification(notification);
        const data: any = notification.getBody();
        switch (notification.getName()) {
            case BattleConst.BATTLE_MEDIATOR_OPEN:
                cc.log("准备进入战斗");
                this.isPlay = false;
                this.curLev = data;
                this.loadRes();
                break;
            case BattleConst.BATTLE_MEDIATOR_CLOSE:
            case BattleConst.BATTLE_MEDIATOR_EXIT:
                //退出
                this.onClose();
                for (let index = 0; index < this.noteArr.length; index++) {
                    const element = this.noteArr[index];
                    PoolManager.getInstance().putNode(PoolManager.NOTE_POOL, element.getNode());
                }
                this.removeEvent();
                this.getViewComponent().close();
                this.sendNotification(LevelConst.LEVEL_MEDIATOR_OPEN);
                this.isPause = false;
                this.isPlay = false;
                break
            case BattleConst.BATTLE_MEDIATOR_RESTART:
                //重开
                this.isPause = false;
                break;
            case BattleConst.BATTLE_MEDIATOR_CONTINUE:
                //继续
                this.isPause = false;
                break;
            case GameConst.GAME_UPDATE:
                this.onUpdate(data);
                break;
        }
    }

    //预加载资源
    private loadRes() {
        cc.log("准备预加载资源");
        this.resArr = [];
        this.levelConfig = ConfigManager.getInstance().getLevel(this.curLev);
        if (this.levelConfig != null) {
            this.resArr.push(PathConst.MAP + this.levelConfig.map);
            this.musicConfig = ConfigManager.getInstance().getMusic(this.levelConfig.music);
            if (this.musicConfig != null) {
                this.noteWidth = this.defaultDis / (this.defaultTime / (60 / this.musicConfig.bpm * 1000));
                this.resArr.push(PathConst.AUDIO + this.musicConfig.audioName);
            }
        }

        this.sendNotification(LoadingConst.LOADING_MEDIATOR_OPEN);
        ResourceManager.getInstance().loadResArray(this.resArr,
            () => {
                this.sendNotification(LoadingConst.LOADING_MEDIATOR_CLOSE);
                this.addEvent();
                this.getViewComponent().open();
            },
            (progress) => {
                //更新加载进度
                this.sendNotification(LoadingConst.LOADING_MEDIATOR_UPDATE, progress);
            });
    }

    //UI资源加载成功
    private onOpenSucc() {
        cc.log("初始化UI完成");
        this._isPause=false;

        this.audio = ResourceManager.getInstance().getRes(PathConst.AUDIO + this.musicConfig.audioName);
        this.curAudio = cc.audioEngine.play(this.audio, false, 1);

        var map: any = ResourceManager.getInstance().getRes(PathConst.MAP + this.levelConfig.map);
        this.getViewComponent().initMap(map);

        cc.audioEngine.setFinishCallback(this.curAudio, () => {
            cc.log("音乐播放结束");
            this.sendNotification(OverConst.OVER_MEDIATOR_OPEN);
        });

        this.getViewComponent().setLevName(this.levelConfig.name);

        //显示主角
        this.player = new Player();
        this.player.setParent(this.getViewComponent().play);
        this.player.setScale(new cc.Vec2(0.5, 0.5));
        this.player.setPos(new cc.Vec2(-520, -210));
        this.player.setVO(null);

        cc.log("go -------->");
        this.isPlay = true;
    }

    private onUpdate(dt): void {
        if (this.isPause == false && this.isPlay == true)
         {
            if (cc.audioEngine.isMusicPlaying) {
                if (this.curAudio != -1) {
                    let audioTime = cc.audioEngine.getCurrentTime(this.curAudio);
                    this.getViewComponent().setMusicTime(audioTime);
                    this.updateNote(audioTime);
                    for (let i = 0; i < this.noteArr.length; i++) {
                        this.noteArr[i].update(audioTime, dt, this.speed);
                    }
                }
            }
            this.getViewComponent().updateMap(dt);


            //检测按住的长节奏
            if (this.touchNote != null) {
                this.touchNote.getVO().endTime -= dt * 1000;
                if (this.touchNote.getVO().endTime <= this.touchNote.getVO().startTime) {
                    this.touchNote.dispose();
                    this.touchNote = null;

                    if (this.isPressLeft) {
                        this.player.getModel().runAction(cc.moveTo(0.1, new cc.Vec2(-500, -210)));
                    }
                }
            }
        }
    }


    private updateNote(time: number): void {
        if (this.musicConfig.tracks.length > 0) {
            this.createNote(time, this.musicConfig.tracks[0].notes, "up", this.getViewComponent().upVec.y)
        }

        if (this.musicConfig.tracks.length > 1) {
            this.createNote(time, this.musicConfig.tracks[1].notes, "down", this.getViewComponent().downVec.y)
        }
    }

    private createNote(time: number, value: Array<NoteConfig>, track: string, posy: number) {
        for (let index = 0; index < value.length; index++) {
            var noteVo: NoteConfig = value[index];
            if ((noteVo.startTime - time * 1000) <= this.defaultTime) {
                var node: cc.Node = PoolManager.getInstance().getNode(PoolManager.NOTE_POOL);
                var noteItem: NoteItem = new NoteItem(track, node, this.getViewComponent().play, new cc.Vec2((noteVo.startTime - time * 1000) * this.speed - 400, posy), this.destroyNote.bind(this));
                noteItem.setVO(noteVo);
                if (noteVo.startTime == noteVo.endTime) {
                    noteItem.setWidth(this.noteWidth);
                }
                else {
                    noteItem.setWidth(this.noteWidth * (noteVo.endTime - noteVo.startTime) / (60 / this.musicConfig.bpm * 1000));
                }

                this.noteArr.push(noteItem);
                value.splice(index, 1);
            }
            else {
                index++;
            }
        }
    }

    private destroyNote(value: NoteItem) {
        PoolManager.getInstance().putNode(PoolManager.NOTE_POOL, value.getNode());

        for (let index = 0; index < this.noteArr.length; index++) {
            const element = this.noteArr[index];
            if (element == value) {
                this.noteArr.splice(index, 1);
                break;
            }
        }
    }

    private addEvent(): void {
        cc.systemEvent.on(BattleConst.BATTLE_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.on(BattleConst.BATTLE_VIEW_PAUSE_CLICK, this.onPause, this);
        cc.systemEvent.on(BattleConst.BATTLE_VIEW_EXIT_CLICK, this.onExit, this);
        cc.systemEvent.on(BattleConst.BATTLE_VIEW_VIDEO_CLICK, this.onVideo, this);
        cc.systemEvent.on(BattleConst.BATTLE_VIEW_TOUCH_LEFT_START, this.onTouchLeftStart, this);
        cc.systemEvent.on(BattleConst.BATTLE_VIEW_TOUCH_RIGHT_START, this.onTouchRightStart, this);
        cc.systemEvent.on(BattleConst.BATTLE_VIEW_TOUCH_LEFT_END, this.onTouchLeftEnd, this);
        cc.systemEvent.on(BattleConst.BATTLE_VIEW_TOUCH_RIGHT_END, this.onTouchRightEnd, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    private removeEvent(): void {
        cc.systemEvent.off(BattleConst.BATTLE_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.off(BattleConst.BATTLE_VIEW_PAUSE_CLICK, this.onPause, this);
        cc.systemEvent.off(BattleConst.BATTLE_VIEW_EXIT_CLICK, this.onExit, this);
        cc.systemEvent.off(BattleConst.BATTLE_VIEW_VIDEO_CLICK, this.onVideo, this);
        cc.systemEvent.off(BattleConst.BATTLE_VIEW_TOUCH_LEFT_START, this.onTouchLeftStart, this);
        cc.systemEvent.off(BattleConst.BATTLE_VIEW_TOUCH_RIGHT_START, this.onTouchRightStart, this);
        cc.systemEvent.off(BattleConst.BATTLE_VIEW_TOUCH_LEFT_END, this.onTouchLeftEnd, this);
        cc.systemEvent.off(BattleConst.BATTLE_VIEW_TOUCH_RIGHT_END, this.onTouchRightEnd, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    private onKeyDown(evt: cc.Event.EventKeyboard): void {
        switch ((evt as any).keyCode) {
            case cc.macro.KEY.a:
                this.onTouchLeftStart();
                break;

            case cc.macro.KEY.d:
                this.onTouchRightStart();
                break;
        }
    }

    private onKeyUp(evt: cc.Event.EventKeyboard): void {
        switch ((evt as any).keyCode) {
            case cc.macro.KEY.a:
                this.onTouchLeftEnd();
                break;

            case cc.macro.KEY.d:
                this.onTouchRightEnd();
                break;
        }
    }

    private onTouchLeftStart(): void {
        cc.log("onTouchLeftStart-------------------2");
        if (!this.isTouchLeft) {
            this.isTouchLeft = true;
            this.tween(this.getViewComponent().laneUp);
            this.player.getModel().stopAllActions();
            var seq = cc.sequence(cc.moveTo(0.1, new cc.Vec2(-500, -90)), cc.delayTime(0.2), cc.moveTo(0.1, new cc.Vec2(-520, -210)))
            this.player.getModel().runAction(seq);
            this.hitNote("up", this.hitResult.bind(this));
        }
    }

    private onTouchLeftEnd(): void {
        this.isTouchLeft = false;

        if (this.isPressLeft) {
            this.touchNote == null;
            this.player.getModel().runAction(cc.moveTo(0.1, new cc.Vec2(-500, -210)));
        }

    }

    private onTouchRightStart(): void {
        if (!this.isTouchRight) {
            this.isTouchRight = true;
            this.tween(this.getViewComponent().laneDown);
            this.hitNote("down", this.hitResult.bind(this));
        }

    }

    private onTouchRightEnd(): void {
        this.isTouchRight = false;
        if (this.isPressRight) {
            this.touchNote == null;
        }
    }

    private hitNote(track: string, result: Function): void {
        this.player.atk();
        for (let index = 0; index < this.noteArr.length; index++) {
            var note: NoteItem = this.noteArr[index];
            if (note.getTrack() == track) {
                note.isHit(result);
            }
        }
    }

    private hitResult(value: NoteItem) {
        var vo = value.getVO();
        if (vo.endTime > vo.startTime) {
            this.touchNote = value;
            this.touchNote.setColor(cc.Color.GRAY);
            if (value.getTrack() == "up") {
                this.isPressLeft = true;
                this.player.getModel().stopAllActions();
                this.player.getModel().runAction(cc.moveTo(0.1, new cc.Vec2(-500, -90)));
            }
            else {
                this.isPressRight = true;
            }
        }
        else {
            value.dispose();
        }
    }

    private tween(node: cc.Node) {
        var seq = cc.sequence(cc.scaleTo(0.1, 1.2, 1.2), cc.scaleTo(0.1, 1, 1))
        node.runAction(seq);
    }

    private onPause(): void {
        this.isPause = true;
        this.sendNotification(PauseConst.PAUSE_MEDIATOR_OPEN);
    }

    private onExit(): void {
        this.sendNotification(MainConst.MAIN_MEDIATOR_CLOSE);
    }

    private onVideo(): void {
        cc.log("观看视频复活");
    }

    private onClose() {
        this.isPlay = false;
        for (let index = 0; index < this.resArr.length; index++) {
            const element = this.resArr[index];
            var deps = cc.loader.getDependsRecursively(element);
            cc.loader.release(deps);
        }

        if (this.curAudio != -1) {
            cc.audioEngine.setFinishCallback(this.curAudio, null);
            cc.audioEngine.stop(this.curAudio);
            cc.audioEngine.uncacheAll();
            this.curAudio = -1;
        }

    }
}