import Mediator from "../../mvc/patterns/mediator/Mediator";
import IMediator from "../../mvc/interfaces/IMediator";
import OverConst from "./OverConst";
import OverView from "./OverView";
import INotification from "../../mvc/interfaces/INotification";
import BattleConst from "../battle/BattleConst";

export default class OverMediator extends Mediator implements IMediator {
    public static NAME: string = "OverMediator";

    listNotificationInterests(): string[] {
        return [
            OverConst.OVER_MEDIATOR_OPEN,
            OverConst.OVER_MEDIATOR_CLOSE
        ];
    }


    public constructor(viewComponent: any) {
        super(OverMediator.NAME, viewComponent);
    }

    public getViewComponent(): OverView {
        return this.viewComponent as OverView;
    }


    public handleNotification(notification: INotification): void {
        super.handleNotification(notification);
        const data: any = notification.getBody();
        switch (notification.getName()) {
            case OverConst.OVER_MEDIATOR_OPEN:
                this.addEvent();
                this.getViewComponent().open();
                break;
            case OverConst.OVER_MEDIATOR_CLOSE:
                this.removeEvent();
                this.getViewComponent().close();
                break;
        }
    }

    //侦听UI发送的事件
    private addEvent(): void {
        cc.systemEvent.on(OverConst.OVER_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.on(OverConst.OVER_VIEW_EXIT_CLICK, this.onExit, this);
        cc.systemEvent.on(OverConst.OVER_VIEW_RESTART_CLICK, this.onRestart, this);
    }

    //移除UI发送的事件
    private removeEvent(): void {
        cc.systemEvent.off(OverConst.OVER_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.off(OverConst.OVER_VIEW_EXIT_CLICK, this.onExit, this);
        cc.systemEvent.off(OverConst.OVER_VIEW_RESTART_CLICK, this.onRestart, this);
    }

    //UI打开成功
    private onOpenSucc(): void {

    }

    //点击重开按钮
    private onRestart():void
    {
        cc.log("-----点击重新开始");
        this.sendNotification(OverConst.OVER_MEDIATOR_CLOSE);
        this.sendNotification(BattleConst.BATTLE_MEDIATOR_RESTART);
    }

    //点击退出按钮
    private onExit(): void {
        cc.log("-----点击退出");
        this.sendNotification(OverConst.OVER_MEDIATOR_CLOSE);
        this.sendNotification(BattleConst.BATTLE_MEDIATOR_EXIT);
    }
}