import LoginConst from "./LoginConst";
import PathConst from "../../core/const/PathConst";
import ResourceManager from "../../core/manager/ResourceManager";
import BaseView from "../../core/component/BaseView";


export default class LoginView extends BaseView {


    private loginBtn: cc.Button = null;


    public constructor()
    {
        super();
        this.viewName = "LoginView";
    }

    //加载成功，初始化界面
    protected loadSucc(prefab: cc.Prefab) {
        super.loadSucc(prefab);
        // this.loginBtn = cc.find("LoginBtn", this.root).getComponent(cc.Button);
        // this.loginBtn.node.on(cc.Node.EventType.TOUCH_END, this.onLoginClick, this);
        cc.systemEvent.dispatchEvent(new cc.Event(LoginConst.LOGIN_VIEW_OPEN_SUCC, false));
    }

    //登记登录按钮
    private onLoginClick() {
        // cc.log("onClick");
        // cc.systemEvent.dispatchEvent(new cc.Event(LoginConst.LOGIN_VIEW_LOGIN_CLICK, false));
    }

    //关闭界面
    public close(): void {
        // this.loginBtn.node.off(cc.Node.EventType.TOUCH_END, this.onLoginClick, this);
        // this.loginBtn = null;
        super.close();
    }
}