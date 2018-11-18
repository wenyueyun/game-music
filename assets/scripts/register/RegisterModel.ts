import SimpleCommand from "../mvc/patterns/command/SimpleCommand";
import ICommand from "../mvc/interfaces/ICommand";
import INotification from "../mvc/interfaces/INotification";
import LoginProxy from "../Module/Login/LoginProxy";
import RankProxy from "../Module/Rank/RankProxy";
import LoadingProxy from "../Module/Loading/LoadingProxy";
import LevelProxy from "../Module/Level/LevelProxy";
import BattleProxy from "../Module/Battle/BattleProxy";
import MainProxy from "../module/main/MainProxy";
import OverProxy from "../module/over/OverProxy";

export default class RegisterModel extends SimpleCommand implements ICommand {
    public constructor() {
        super();
    }

    public execute(notification: INotification): void {
        cc.log("RegisterModel");
        this.facade.registerProxy(new LoginProxy());
        this.facade.registerProxy(new MainProxy());
        this.facade.registerProxy(new BattleProxy());
        this.facade.registerProxy(new RankProxy());
        this.facade.registerProxy(new LoadingProxy());
        this.facade.registerProxy(new LevelProxy());
        this.facade.registerProxy(new OverProxy());
    }
}