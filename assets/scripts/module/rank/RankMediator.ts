import Mediator from "../../mvc/patterns/mediator/Mediator";
import IMediator from "../../mvc/interfaces/IMediator";
import INotification from "../../mvc/interfaces/INotification";
import RankConst from "./RankConst";
import RankView from "./RankView";
import LevelConst from "../level/LevelConst";
import GameConst from "../../core/const/GameConst";
import WXManager from "../../core/manager/WXManager";


export default class RankMediator extends Mediator implements IMediator {
    public static NAME: string = "RankMediator";

    listNotificationInterests(): string[] {
        return [
            RankConst.RANK_MEDIATOR_OPEN,
            RankConst.RANK_MEDIATOR_CLOSE,
            RankConst.RANK_MODEL_UPDATE_DATA,
            //evelt
            GameConst.GAME_UPDATE,
        ];
    }

    public constructor(viewComponent: any) {
        super(RankMediator.NAME, viewComponent);
    }

    public getViewComponent(): RankView {
        return this.viewComponent as RankView;
    }

    public handleNotification(notification: INotification): void {
        super.handleNotification(notification);
        const data: any = notification.getBody();
        switch (notification.getName()) {
            case RankConst.RANK_MEDIATOR_OPEN:
                this.addEvent();
                this.getViewComponent().open();
                break;
            case RankConst.RANK_MEDIATOR_CLOSE:
                this.removeEvent();
                this.getViewComponent().close();
                break;
            case GameConst.GAME_UPDATE:
                this.getViewComponent().update();
                break;
        }
    }


    public addEvent(): void {

        cc.systemEvent.on(RankConst.RANK_VIEW_OPEN_SUCC, this.onOpenSucc, this);

        cc.systemEvent.on(RankConst.RANK_VIEW_CLOSE_CLICK, this.onClose, this);

        cc.systemEvent.on(RankConst.RANK_VIEW_SHARE_CLICK, this.onShare, this);
    }

    public removeEvent(): void {

        cc.systemEvent.off(RankConst.RANK_VIEW_OPEN_SUCC, this.onOpenSucc, this);

        cc.systemEvent.off(RankConst.RANK_VIEW_CLOSE_CLICK, this.onClose, this);

        cc.systemEvent.off(RankConst.RANK_VIEW_SHARE_CLICK, this.onShare, this);
    }

    //UI打开成功
    private onOpenSucc(): void {

        if (GameConst.isWX) {
            WXManager.getInstance().post("rank");
            // WXManager.getInstance().createBanner();
        }
    }

    private onClose(): void {
        this.sendNotification(RankConst.RANK_MEDIATOR_CLOSE);
        this.sendNotification(LevelConst.LEVEL_MEDIATOR_OPEN);
    }

    //点击分享按钮
    private onShare(): void {
        
        if (GameConst.isWX) {
            WXManager.getInstance().share();
        }
    }


}
