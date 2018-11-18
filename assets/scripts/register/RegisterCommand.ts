
import SimpleCommand from "../mvc/patterns/command/SimpleCommand";
import ICommand from "../mvc/interfaces/ICommand";
import INotification from "../mvc/interfaces/INotification";
import LoginCommand from "../module/login/LoginCommand";
import LoginConst from "../module/login/LoginConst";
import RankCommand from "../module/rank/RankCommand";
import RankConst from "../module/rank/RankConst";
import LoadingConst from "../module/loading/LoadingConst";
import LoadingCommand from "../module/loading/LoadingCommand";
import LevelConst from "../module/level/LevelConst";
import LevelCommand from "../module/level/LevelCommand";
import BattleConst from "../module/battle/BattleConst";
import BattleCommand from "../module/battle/BattleCommand";
import MainConst from "../module/main/MainConst";
import MainCommand from "../module/main/MainCommand";
import OverConst from "../module/over/OverConst";
import OverCommand from "../module/over/OverCommand";

export default class RegisterCommand extends SimpleCommand implements ICommand {
    public constructor() {
        super();
    }

    public execute(notification: INotification): void {
        cc.log("RegisterCommand");
        //login
        this.facade.registerCommand(LoginConst.LOGIN_COMMAND, LoginCommand);
        //main
        this.facade.registerCommand(MainConst.MAIN_COMMAND, MainCommand);
        //map
        this.facade.registerCommand(BattleConst.BATTLE_COMMAND,BattleCommand);
        //rank
        this.facade.registerCommand(RankConst.RANK_COMMAND,RankCommand);
        this.facade.registerCommand(RankConst.RANK_COMMAND_UPDATE_DATA,RankCommand);
        this.facade.registerCommand(RankConst.RANK_COMMAND_BATTLE,RankCommand);
        //loading
        this.facade.registerCommand(LoadingConst.LOADING_COMMAND,LoadingCommand);
        //level
        this.facade.registerCommand(LevelConst.LEVEL_COMMAND,LevelCommand);
        //over
        this.facade.registerCommand(OverConst.OVER_COMMAND,OverCommand);
    }
}