import ICommand from "../../mvc/interfaces/ICommand";
import INotification from "../../mvc/interfaces/INotification";
import SimpleCommand from "../../mvc/patterns/command/SimpleCommand";
import LoginProxy from "./LoginProxy";
import LoginConst from "./LoginConst";

export default class LoginCommand extends SimpleCommand implements ICommand {
    public static NAME: string = "LoginCommand";

    public constructor() {
        super();
        cc.log("LoginCommand.constructor");
    }


    public execute(notification: INotification): void {
        cc.log("LoginCommand.execute");
        const data: any = notification.getBody();
        const proxy: LoginProxy = <LoginProxy>(this.facade.retrieveProxy(LoginProxy.NAME));
        switch (notification.getName()) {
            case LoginConst.LOGIN_COMMAND:
                proxy.SendSocket();
                break;
        }
    }
}
