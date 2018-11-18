import SimpleCommand from "../../mvc/patterns/command/SimpleCommand";
import INotification from "../../mvc/interfaces/INotification";
import ICommand from "../../mvc/interfaces/ICommand";
import MainProxy from "./MainProxy";
import MainConst from "./MainConst";

export default class MainCommand extends SimpleCommand implements ICommand {
    public static NAME: string = "MainCommand";

    public constructor() {
        super();
        cc.log("MainCommand.constructor");
    }


    public execute(notification: INotification): void {
        cc.log("MainCommand.execute");
        const data: any = notification.getBody();
        const proxy:MainProxy = <MainProxy>(this.facade.retrieveProxy(MainProxy.NAME));
        switch (notification.getName()) {
            case MainConst.MAIN_COMMAND:
                break;
        }
    }
}