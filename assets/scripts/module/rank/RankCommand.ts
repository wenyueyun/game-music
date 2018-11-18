import SimpleCommand from "../../mvc/patterns/command/SimpleCommand";
import ICommand from "../../mvc/interfaces/ICommand";
import INotification from "../../mvc/interfaces/INotification";
import RankProxy from "./RankProxy";
import RankConst from "./RankConst";

export default class RankCommand extends SimpleCommand implements ICommand {

    public static NAME: string = "RankCommand";

    public constructor() {
        super();
        cc.log("RankCommand.constructor");
    }

    public execute(notification: INotification): void {
        cc.log("RankCommand.execute------->" + notification.getName());
        const data: any = notification.getBody();
        const proxy: RankProxy = <RankProxy>(this.facade.retrieveProxy(RankProxy.NAME));

        switch (notification.getName()) {
            case RankConst.RANK_COMMAND:
                break;
            case RankConst.RANK_COMMAND_UPDATE_DATA:
                proxy.sendUpdate();
                break;
            case RankConst.RANK_COMMAND_BATTLE:
                proxy.sendBattle();
                break;
        }
    }
}
