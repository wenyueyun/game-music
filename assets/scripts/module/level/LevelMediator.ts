import Mediator from "../../mvc/patterns/mediator/Mediator";
import IMediator from "../../mvc/interfaces/IMediator";
import LevelConst from "./LevelConst";
import LevelView from "./LevelView";
import INotification from "../../mvc/interfaces/INotification";
import BattleConst from "../battle/BattleConst";
import LevelProxy from "./LevelProxy";
import RankConst from "../rank/RankConst";
import WXManager from "../../core/manager/WXManager";
import GameConst from "../../core/const/GameConst";

export default class LevelMediator extends Mediator implements IMediator {

    public static NAME: string = "LevelMediator";

    private proxy: LevelProxy;

    listNotificationInterests(): string[] {
        return [

            //mediator
            LevelConst.LEVEL_MEDIATOR_OPEN,
            LevelConst.LEVEL_MEDIATOR_CLOSE,

            //model
            LevelConst.LEVEL_MODEL_UPDATE_DATA,
            LevelConst.LEVEL_MODEL_UPDATE_LEVEL,
        ];
    }

    public constructor(viewComponent: any) {
        super(LevelMediator.NAME, viewComponent);
        this.proxy = <LevelProxy>(this.facade.retrieveProxy(LevelProxy.NAME));
    }

    public getViewComponent(): LevelView {
        return this.viewComponent as LevelView;
    }

    public handleNotification(notification: INotification): void {
        super.handleNotification(notification);
        const data: any = notification.getBody();
        switch (notification.getName()) {
            case LevelConst.LEVEL_MEDIATOR_OPEN:
                this.addEvent();
                this.getViewComponent().open();
                break;
            case LevelConst.LEVEL_MEDIATOR_CLOSE:
                this.removeEvent();
                this.getViewComponent().close();
                break;
            case LevelConst.LEVEL_MODEL_UPDATE_LEVEL:
                this.getViewComponent().updateLevView(data);
                break;
        }
    }

    public onRegister(): void {
        super.onRegister();

    }

    public addEvent(): void {
        cc.systemEvent.on(LevelConst.LEVEL_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.on(LevelConst.LEVEL_VIEW_FIGHT_CLICK, this.onFight, this);
        cc.systemEvent.on(LevelConst.LEVEL_VIEW_LEVEL_CLICK, this.onLevel, this);
        cc.systemEvent.on(LevelConst.LEVEL_VIEW_HELP_CLICK, this.onHelp, this);
        cc.systemEvent.on(LevelConst.LEVEL_VIEW_PHOTO_CLICK, this.onPhoto, this);
        cc.systemEvent.on(LevelConst.LEVEL_VIEW_RANK_CLICK, this.onRank, this);
    }

    public removeEvent(): void {
        cc.systemEvent.off(LevelConst.LEVEL_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.off(LevelConst.LEVEL_VIEW_FIGHT_CLICK, this.onFight, this);
        cc.systemEvent.off(LevelConst.LEVEL_VIEW_LEVEL_CLICK, this.onLevel, this);
        cc.systemEvent.off(LevelConst.LEVEL_VIEW_HELP_CLICK, this.onHelp, this);
        cc.systemEvent.off(LevelConst.LEVEL_VIEW_PHOTO_CLICK, this.onPhoto, this);
        cc.systemEvent.off(LevelConst.LEVEL_VIEW_RANK_CLICK, this.onRank, this);
    }

    public onOpenSucc(): void {

        this.getViewComponent().updateLevView(this.proxy.CurLev);

        if (GameConst.isWX) {
            this.getViewComponent().setUserInfo(WXManager.getInstance().nickName, WXManager.getInstance().avatarUrl);
            // WXManager.getInstance().createBanner();
        }
    }

    private onLevel(evt: cc.Event.EventCustom): void {
        evt.stopPropagationImmediate();
        this.proxy.CurLev = evt.detail;
    }

    private onFight(evt: cc.Event.EventCustom): void {
        this.sendNotification(LevelConst.LEVEL_MEDIATOR_CLOSE);
        this.sendNotification(BattleConst.BATTLE_MEDIATOR_OPEN, evt.detail);
    }


    private onHelp(evt: cc.Event.EventCustom): void {
        evt.stopPropagationImmediate();
        cc.log("点击帮助按钮");
    }

    private onPhoto(evt: cc.Event.EventCustom): void {
        evt.stopPropagationImmediate();
        cc.log("立绘");
    }

    private onRank(evt: cc.Event.EventCustom): void {
        evt.stopPropagationImmediate();
        this.sendNotification(LevelConst.LEVEL_MEDIATOR_CLOSE);
        this.sendNotification(RankConst.RANK_MEDIATOR_OPEN);
    }
}
