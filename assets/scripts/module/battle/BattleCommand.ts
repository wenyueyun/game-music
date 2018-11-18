import SimpleCommand from "../../mvc/patterns/command/SimpleCommand";
import ICommand from "../../mvc/interfaces/ICommand";
import INotification from "../../mvc/interfaces/INotification";

export default class BattleCommand extends SimpleCommand implements ICommand {
    public static NAME: string = "BattleCommand";

    public constructor() {
        super();
    }

    public execute(notification: INotification): void {

    }
}