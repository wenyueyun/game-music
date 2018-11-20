import Mediator from "../../mvc/patterns/mediator/Mediator";
import IMediator from "../../mvc/interfaces/IMediator";
import INotification from "../../mvc/interfaces/INotification";
import BattleView from "./BattleView";
import BattleProxy from "./BattleProxy";
import MusicConfig from "../../core/config/AudioConfig";
import LevelConfig from "../../core/config/LevelConfig";
import Player from "../../core/entity/Player";
import BattleConst from "./BattleConst";
import GameConst from "../../core/const/GameConst";
import LevelConst from "../level/LevelConst";
import NoteConfig from "../../core/config/NoteConfig";
import ConfigManager from "../../core/manager/ConfigManager";
import PathConst from "../../core/const/PathConst";
import ResourceManager from "../../core/manager/ResourceManager";
import LoadingConst from "../loading/LoadingConst";
import OverConst from "../Over/OverConst";
import PauseConst from "../pause/PauseConst";
import MainConst from "../main/MainConst";
import Monster from "../../core/entity/Monster";
import MonsterVO from "../../core/entity/MonsterVO";
import EntityEvent from "../../core/const/EntityEvent";
import PlayerVO from "../../core/entity/PlayerVO";
import EffectManager from "../../core/manager/EffectManager";
import WXManager from "../../core/manager/WXManager";

export default class BattleMediator extends Mediator implements IMediator {
    public static NAME: string = "BattleMediator";
    private curAudio: number = -1;
    private monsterArr: Array<Monster>;
    private musicConfig: MusicConfig;
    private levelConfig: LevelConfig;

    //轨道位置（固定值）
    private trackX: number = -365;
    //每一个节拍在游戏中显示的宽度（固定值）
    public tempoWidth: number = 150;
    //显示的节拍数量（固定值    tempoNum*tempoWidth <= 1280/2+400）
    private tempoNum: number = 7;
    //速度(节拍宽度/节拍时间)
    private speed: number;
    //每一个节拍的时间(毫秒)
    private tempoTime: number;

    private curLev: number;
    private isPlay: boolean;
    private proxy: BattleProxy;
    private player: Player;
    private audio: cc.AudioClip;

    private touchMonster: Monster;
    private doubleMonster: Monster;
    private doubleTime: number;

    private isDoubleLeft:boolean;
    private isDoubleRight:boolean;

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


    public get isPause(): boolean {
        return this._isPause;
    }


    public constructor(viewComponent: any) {
        super(BattleMediator.NAME, viewComponent)
        this.proxy = <BattleProxy>(this.facade.retrieveProxy(BattleProxy.NAME));
        this.monsterArr = new Array<Monster>();
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
                cc.log("this.curLev-----------" + this.curLev);
                this.loadRes();
                break;
            case BattleConst.BATTLE_MEDIATOR_CLOSE:
            case BattleConst.BATTLE_MEDIATOR_EXIT:
                //退出
                this.onClose();

                for (let index = 0; index < this.monsterArr.length; index++) {
                    this.monsterArr[index].destroy();
                }
                this.monsterArr = [];

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

        cc.systemEvent.on(EntityEvent.ENTITIY_DIE, this.onEntityDie, this);
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

        cc.systemEvent.off(EntityEvent.ENTITIY_DIE, this.onEntityDie, this);
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
                this.tempoTime = 60 / this.musicConfig.bpm * 1000;
                this.speed = this.tempoWidth / this.tempoTime;
                this.resArr.push(PathConst.AUDIO + this.musicConfig.audioName);
            }
        }

        for (let index = 0; index < this.resArr.length; index++) {
            const element = this.resArr[index];
            cc.log(element);
        }

        this.sendNotification(LoadingConst.LOADING_MEDIATOR_OPEN);
        ResourceManager.getInstance().loadResArray(this.resArr,
            () => {
                cc.log("预加载资源完成");
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
        this._isPause = false;

        this.audio = ResourceManager.getInstance().getRes(PathConst.AUDIO + this.musicConfig.audioName);
        this.curAudio = cc.audioEngine.play(this.audio, false, 1);

        var map: any = ResourceManager.getInstance().getRes(PathConst.MAP + this.levelConfig.map);
        this.getViewComponent().initMap(map);

        cc.audioEngine.setFinishCallback(this.curAudio, () => {
            cc.log("音乐播放结束");
            this.sendNotification(OverConst.OVER_MEDIATOR_OPEN);
        });

        //显示主角
        this.player = new Player();
        this.player.setParent(this.getViewComponent().play);
        // this.player.setScale(new cc.Vec2(0.5, 0.5));
        this.player.setPos(new cc.Vec2(-520, -210));
        this.player.setVO(new PlayerVO(2));

        cc.log("go -------->");
        this.isPlay = true;

        if (GameConst.isWX) {
            this.getViewComponent().setUserInfo(WXManager.getInstance().nickName, WXManager.getInstance().avatarUrl);
        }
    }

    private onUpdate(dt): void {
        if (this.isPause == false && this.isPlay == true) {
            if (cc.audioEngine.isMusicPlaying) {
                if (this.curAudio != -1) {
                    let audioTime = cc.audioEngine.getCurrentTime(this.curAudio);
                    this.getViewComponent().setMusicTime(audioTime);
                    this.updateNote(audioTime);
                    for (let i = 0; i < this.monsterArr.length; i++) {
                        this.monsterArr[i].onUpdate(audioTime, dt, this.speed);
                    }
                }
            }
            this.getViewComponent().updateMap(dt);


            //检测按住的长节奏
            if (this.touchMonster != null) {
                this.touchMonster.getNote().endTime -= dt * 1000;
                if (this.touchMonster.getNote().endTime <= this.touchMonster.getNote().startTime) {

                    if (this.isPressLeft) {
                        this.player.getNode().runAction(cc.moveTo(0.1, new cc.Vec2(-520, -200)));
                    }
                    this.touchMonster.die();
                    this.touchMonster = null;
                    this.isPressLeft = false;
                    this.isPressRight = false;
                }
            }
            else 
            {
                if (this.doubleTime > 0.1) {
                    this.doubleMonster = null;
                    this.isDoubleLeft = false;
                    this.isDoubleRight = false;
                    return;
                }

                if(this.doubleMonster != null) 
                {
                    if (this.isDoubleLeft == true && this.isDoubleRight == true) {
                        this.doubleMonster.die();
                        this.doubleMonster = null;
                    }
                }
                this.doubleTime += dt;
            }
        }
    }


    private updateNote(time: number): void {
        if (this.musicConfig.tracks.length > 0) {
            this.createNote(time, this.musicConfig.tracks[0].notes, this.getViewComponent().upVec.y)
        }

        if (this.musicConfig.tracks.length > 1) {
            this.createNote(time, this.musicConfig.tracks[1].notes, this.getViewComponent().downVec.y)
        }
    }

    private createNote(time: number, value: Array<NoteConfig>, posy: number) {
        for (let index = 0; index < value.length; index++) {
            var note: NoteConfig = value[index];
            if ((note.startTime - time * 1000) <= this.tempoTime * this.tempoNum) {
                var mon_vo: MonsterVO = new MonsterVO(parseInt(note.val));
                var mon: Monster = new Monster();
                mon.setParent(this.getViewComponent().play);
                mon.setPos(new cc.Vec2((note.startTime - time * 1000) * this.speed + this.trackX, posy));
                mon.setNote(note);
                mon.setTempoTime(this.tempoTime);
                mon.setVO(mon_vo);
                this.monsterArr.push(mon);
                value.splice(index, 1);
            }
            else {
                index++;
            }
        }
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
        cc.log("onTouchLeftStart-------------------");
        if (!this.isTouchLeft) {
            this.isTouchLeft = true;
            this.doubleTime = 0;
            this.isDoubleLeft = true;

            this.tween(this.getViewComponent().laneUp);
            this.player.getModel().stopAllActions();
            var seq = cc.sequence(cc.moveTo(0.1, new cc.Vec2(-520, 0)), cc.delayTime(0.2), cc.moveTo(0.1, new cc.Vec2(-520, -200)))
            this.player.getNode().runAction(seq);
            this.hitNote("A");
        }
    }

    private onTouchLeftEnd(): void {
        cc.log("onTouchLeftEnd-------------------");
        this.isDoubleLeft = false;
        this.isTouchLeft = false;
        if (this.isPressLeft) {
            this.touchMonster.touchEnd();
            this.touchMonster == null;
            this.isPressLeft = false;
            this.player.getNode().runAction(cc.moveTo(0.1, new cc.Vec2(-520, -200)));
        }

    }

    private onTouchRightStart(): void {
        cc.log("onTouchRightStart-------------------");
        if (!this.isTouchRight) {
            this.doubleTime = 0;
            this.isDoubleRight = true;

            this.tween(this.getViewComponent().laneDown);
            this.hitNote("B");
        }
    }

    private onTouchRightEnd(): void {
        cc.log("onTouchRightEnd-------------------");
        this.isDoubleRight = false;
        this.isTouchRight = false;
        if (this.isPressRight) {
            this.touchMonster.touchEnd();
            this.touchMonster == null;
            this.isPressRight = false;
        }
    }

    private hitNote(track: string): void {
        this.player.atk();
        for (let index = 0; index < this.monsterArr.length; index++) {
            var mon: Monster = this.monsterArr[index];
            if (mon != null) {
                var pos = mon.getPos();
                var dis = Math.abs(this.trackX - pos.x);
                var type = mon.getVO().getType();
                if (mon.getNote().track == track) {
                    if (dis < 60) {
                        // EffectManager.getInstance().showEffect("Atk02",this.player,this.player.getTopPos());
                        // EffectManager.getInstance().showEffect("Atk01",this.player,this.player.getRightPos());
                        // EffectManager.getInstance().showEffect("HP", this.player, this.player.getTopPos(), "30");
                        cc.log("击中怪物------------->" + mon.getNote().startTime);
                        if (type == 1) {
                            var score: number = ConfigManager.getInstance().getGrade(dis);
                            this.proxy.getData().score += score;
                            mon.die();
                        }
                        else if (type == 3) {
                            mon.touch();
                            if (track == "A") {
                                this.isPressLeft = true;
                            }
                            else if (track == "B") {
                                this.isPressRight = true;
                            }
                            this.touchMonster = mon;
                        }
                        else if (type == 2) {
                            this.doubleMonster = mon;
                            cc.log("获取双击怪物");
                        }
                        break;
                    }
                }
            }
        }
    }



    private onEntityDie(evt: cc.Event.EventCustom) {
        for (let index = 0; index < this.monsterArr.length; index++) {
            const element = this.monsterArr[index];
            if (element.getVO().ID == evt.detail) {
                element.destroy();
                this.monsterArr.splice(index, 1); 
                break;
            }
        }
    }


    // private hitResult(value: NoteItem) {
    //     var vo = value.getVO();
    //     if (vo.endTime > vo.startTime) {
    //         this.touchNote = value;
    //         this.touchNote.setColor(cc.Color.GRAY);
    //         if (value.getTrack() == "up") {
    //             this.isPressLeft = true;
    //             this.player.getModel().stopAllActions();
    //             this.player.getModel().runAction(cc.moveTo(0.1, new cc.Vec2(-500, -90)));
    //         }
    //         else {
    //             this.isPressRight = true;
    //         }
    //     }
    //     else {
    //         value.dispose();
    //     }
    // }

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