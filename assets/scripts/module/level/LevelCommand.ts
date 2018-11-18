import SimpleCommand from "../../mvc/patterns/command/SimpleCommand";
import ICommand from "../../mvc/interfaces/ICommand";
import INotification from "../../mvc/interfaces/INotification";
import LevelProxy from "./LevelProxy";
import LevelConst from "./LevelConst";

export default class LevelCommand extends SimpleCommand implements ICommand {
    public static NAME: string = "LevelCommand";

    public constructor() {
        super();
    }

    public execute(notification: INotification): void {
        const data: any = notification.getBody();
        const proxy: LevelProxy = <LevelProxy>(this.facade.retrieveProxy(LevelProxy.NAME));
        switch (notification.getName()) {
            case LevelConst.LEVEL_COMMAND_UPDATE_LEVEL:
                proxy.CurLev = data;
                break;
        }
    }
}
