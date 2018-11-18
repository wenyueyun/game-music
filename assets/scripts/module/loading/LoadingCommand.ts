import SimpleCommand from "../../mvc/patterns/command/SimpleCommand";
import ICommand from "../../mvc/interfaces/ICommand";
import INotification from "../../mvc/interfaces/INotification";
import LoadingProxy from "./LoadingProxy";

export default class LoadingCommand extends SimpleCommand implements ICommand {
    public static NAME:string = "LoadingCommand";

    public constructor()
    {
        super();
    }

    public execute(notification: INotification): void {
        cc.log("RankCommand.execute------->" + notification.getName());
        const data: any = notification.getBody();
        const proxy: LoadingProxy = <LoadingProxy>(this.facade.retrieveProxy(LoadingProxy.NAME));
        switch (notification.getName()) {
        }
    }
}
