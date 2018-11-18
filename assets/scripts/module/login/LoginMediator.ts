import IMediator from "../../mvc/interfaces/IMediator";
import INotification from "../../mvc/interfaces/INotification";
import Mediator from "../../mvc/patterns/mediator/Mediator";
import LoginView from "./LoginView";
import LoginConst from "./LoginConst";
import LoginVO from "./LoginVO";
import MainConst from "../main/MainConst";
import GameConst from "../../core/const/GameConst";
import WXManager from "../../core/manager/WXManager";

export default class LoginMediator extends Mediator implements IMediator {
    public static NAME: string = "LoginMediator";

    listNotificationInterests(): string[] {
        return [
            LoginConst.LOGIN_MEDIATOR_OPEN,
            LoginConst.LOGIN_MEDIATOR_CLOSE,
            LoginConst.LOGIN_MODEL_SUCC,
            LoginConst.LOGIN_MODEL_FAIL
        ];
    }

    public constructor(viewComponent: any) {
        super(LoginMediator.NAME, viewComponent);
    }

    public getViewComponent(): LoginView {
        return this.viewComponent as LoginView;
    }




    public handleNotification(notification: INotification): void {
        super.handleNotification(notification);
        const data: any = notification.getBody();
        switch (notification.getName()) {
            case LoginConst.LOGIN_MEDIATOR_OPEN:
                cc.log("打开登录界面");
                this.addEvent();
                this.getViewComponent().open();
                break;
            case LoginConst.LOGIN_MEDIATOR_CLOSE:
                cc.log("关闭登录界面");
                this.removeEvent();
                this.getViewComponent().close();
                break;
            case LoginConst.LOGIN_MODEL_SUCC:
                cc.log("登录成功");
                // this.sendNotification(MainConst.MAIN_MEDIATOR_OPEN);
                // this.sendNotification(LoginConst.LOGIN_MEDIATOR_CLOSE);
                break;
            case LoginConst.LOGIN_MODEL_FAIL:
                cc.log("登录失败");
                break;
        }
    }

    //侦听UI发送的事件
    private addEvent(): void {
        cc.systemEvent.on(LoginConst.LOGIN_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.on(LoginConst.LOGIN_VIEW_LOGIN_CLICK, this.onLogin, this);
    }

    //移除UI发送的事件
    private removeEvent(): void {
        cc.systemEvent.off(LoginConst.LOGIN_VIEW_OPEN_SUCC, this.onOpenSucc, this);
        cc.systemEvent.off(LoginConst.LOGIN_VIEW_LOGIN_CLICK, this.onLogin, this);
    }

    //UI打开成功
    private onOpenSucc(): void {

        if (GameConst.isWX) {
            WXManager.getInstance().createUserInfoButton();
        }
    }

    //点击登录按钮响应事件
    private onLogin(event: cc.Event): void {
        cc.log("loginmediator.onlogin");
        this.sendNotification(LoginConst.LOGIN_COMMAND, new LoginVO());
    }
}