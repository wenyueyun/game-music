import MainView from "./MainView";
import Mediator from "../../mvc/patterns/mediator/Mediator";
import IMediator from "../../mvc/interfaces/IMediator";
import MainConst from "./MainConst";
import INotification from "../../mvc/interfaces/INotification";
import LevelConst from "../Level/LevelConst";
import LoginConst from "../login/LoginConst";
import GameConst from "../../core/const/GameConst";
import WXManager from "../../core/manager/WXManager";

export default class MainMediator extends Mediator implements IMediator {
    public static NAME: string = "MainMediator";

    listNotificationInterests(): string[] {
        return [
            MainConst.MAIN_MEDIATOR_OPEN,
            MainConst.MAIN_MEDIATOR_CLOSE,
            MainConst.MAIN_MEDIATOR_UPDATE,
            MainConst.MAIN_MEDIATOR_LOGIN
        ];
    }

    private preNotification: boolean;

    public constructor(viewComponent: any) {
        super(MainMediator.NAME, viewComponent);
    }

    public getViewComponent(): MainView {
        return this.viewComponent as MainView;
    }

    public onRegister() {
        super.onRegister();
        //mediator注册后，打开登录界面
        // this.sendNotification(MainConst.MAIN_MEDIATOR_OPEN);
    }

    public handleNotification(notification: INotification): void {
        super.handleNotification(notification);
        const data: any = notification.getBody();
        switch (notification.getName()) {
            case MainConst.MAIN_MEDIATOR_OPEN:
                cc.log("打开主界面");
                this.addEvent();
                this.getViewComponent().open();
                break;
            case MainConst.MAIN_MEDIATOR_CLOSE:
                cc.log("关闭主界面");
                this.removeEvent();
                this.getViewComponent().close();
                break;
            case MainConst.MAIN_MEDIATOR_LOGIN:
                this.getViewComponent().showLogin(data);
                break;
            case MainConst.MAIN_MEDIATOR_UPDATE:
                this.getViewComponent().updateView(data);
                break;
        }
    }

    //侦听UI发送的事件
    private addEvent(): void {
        cc.systemEvent.on(MainConst.MAIN_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.on(MainConst.MAIN_VIEW_START_CLICK, this.onStart, this);
        cc.systemEvent.on(MainConst.MAIN_VIEW_SHARE_CLICK, this.onShare, this);
    }

    //移除UI发送的事件
    private removeEvent(): void {
        cc.systemEvent.off(MainConst.MAIN_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.off(MainConst.MAIN_VIEW_START_CLICK, this.onStart, this);
        cc.systemEvent.off(MainConst.MAIN_VIEW_SHARE_CLICK, this.onShare, this);
    }

    //UI打开成功
    private onOpenSucc(): void {
        cc.log("MainView打开成功");
    }

    //点击进入按钮
    private onStart(): void {
        this.sendNotification(LevelConst.LEVEL_MEDIATOR_OPEN);
        this.sendNotification(MainConst.MAIN_MEDIATOR_CLOSE);
    }

    //点击分享按钮
    private onShare(): void {
        if (GameConst.isWX) {
            WXManager.getInstance().share();
        }
    }
}