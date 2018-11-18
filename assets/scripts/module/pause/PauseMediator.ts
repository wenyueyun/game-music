import Mediator from "../../mvc/patterns/mediator/Mediator";
import IMediator from "../../mvc/interfaces/IMediator";
import INotification from "../../mvc/interfaces/INotification";
import PauseConst from "./PauseConst";
import PauseView from "./PauseView";
import BattleConst from "../battle/BattleConst";

export default class PauseMediator extends Mediator implements IMediator {
    public static NAME: string = "PauseMediator";

    listNotificationInterests(): string[] {
        return [
            PauseConst.PAUSE_MEDIATOR_OPEN,
            PauseConst.PAUSE_MEDIATOR_CLOSE
        ];
    }


    public constructor(viewComponent: any) {
        super(PauseMediator.NAME, viewComponent);
    }

    public getViewComponent(): PauseView {
        return this.viewComponent as PauseView;
    }


    public handleNotification(notification: INotification): void {
        super.handleNotification(notification);
        const data: any = notification.getBody();
        switch (notification.getName()) {
            case PauseConst.PAUSE_MEDIATOR_OPEN:
                this.addEvent();
                this.getViewComponent().open();
                break;
            case PauseConst.PAUSE_MEDIATOR_CLOSE:
                this.removeEvent();
                this.getViewComponent().close();
                break;
        }
    }

    //侦听UI发送的事件
    private addEvent(): void {
        cc.systemEvent.on(PauseConst.PAUSE_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.on(PauseConst.PAUSE_VIEW_EXIT_CLICK, this.onExit, this);
        cc.systemEvent.on(PauseConst.PAUSE_VIEW_RESTART_CLICK, this.onRestart, this);
        cc.systemEvent.on(PauseConst.PAUSE_VIEW_CONTINUE_CLICK, this.onContinue, this);
    }

    //移除UI发送的事件
    private removeEvent(): void {
        cc.systemEvent.off(PauseConst.PAUSE_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.off(PauseConst.PAUSE_VIEW_EXIT_CLICK, this.onExit, this);
        cc.systemEvent.off(PauseConst.PAUSE_VIEW_RESTART_CLICK, this.onRestart, this);
        cc.systemEvent.off(PauseConst.PAUSE_VIEW_CONTINUE_CLICK, this.onContinue, this);
    }

    //UI打开成功
    private onOpenSucc(): void {

    }
    
    //退出当局游戏
    private onExit():void
    {
        this.sendNotification(PauseConst.PAUSE_MEDIATOR_CLOSE);
        this.sendNotification(BattleConst.BATTLE_MEDIATOR_EXIT);
    }

    //重开新的一局游戏
    private onRestart():void
    {
        this.sendNotification(PauseConst.PAUSE_MEDIATOR_CLOSE);
        this.sendNotification(BattleConst.BATTLE_MEDIATOR_RESTART);
    }

    //继续当局游戏
    private onContinue():void
    {
        this.sendNotification(PauseConst.PAUSE_MEDIATOR_CLOSE);
        this.sendNotification(BattleConst.BATTLE_MEDIATOR_CONTINUE);
    }
}