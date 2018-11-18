import SimpleCommand from "../../mvc/patterns/command/SimpleCommand";
import ICommand from "../../mvc/interfaces/ICommand";
import INotification from "../../mvc/interfaces/INotification";
import OverProxy from "./OverProxy";
import OverConst from "./OverConst";

export default class OverCommand extends SimpleCommand implements ICommand {
    public static NAME: string = "OverCommand";

    public constructor() {
        super();
        cc.log("OverCommand.constructor");
    }


    public execute(notification: INotification): void {
        cc.log("OverCommand.execute");
        const data: any = notification.getBody();
        const proxy:OverProxy = <OverProxy>(this.facade.retrieveProxy(OverProxy.NAME));
        switch (notification.getName()) {
            case OverConst.OVER_COMMAND:
                break;
        }
    }
}