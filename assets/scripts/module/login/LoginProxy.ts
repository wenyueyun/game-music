import IProxy from "../../mvc/interfaces/IProxy";
import Proxy from "../../mvc/patterns/proxy/Proxy";
import LoginConst from "./LoginConst";
import LoginVO from "./LoginVO";

export default class LoginProxy extends Proxy implements IProxy {
    public static NAME: string = "LoginProxy";
    public vo: LoginVO;

    public constructor() {
        super(LoginProxy.NAME);
    }

    //发送网络消息
    public SendSocket(): void {
        //模拟服务器登录完，发消息改变UI
        this.sendNotification(LoginConst.LOGIN_MODEL_SUCC);
    }
}