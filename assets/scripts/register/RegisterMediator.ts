import SimpleCommand from "../mvc/patterns/command/SimpleCommand";
import ICommand from "../mvc/interfaces/ICommand";
import INotification from "../mvc/interfaces/INotification";
import LoginMediator from "../module/login/LoginMediator";
import LoginView from "../module/login/LoginView";
import RankMediator from "../module/rank/RankMediator";
import RankView from "../module/rank/RankView";
import LoadingMediator from "../module/loading/LoadingMediator";
import LoadingView from "../module/loading/LoadingView";
import LevelMediator from "../module/level/LevelMediator";
import LevelView from "../module/Level/levelView";
import BattleMediator from "../module/battle/BattleMediator";
import BattleView from "../module/battle/BattleView";
import MainMediator from "../module/main/MainMediator";
import MainView from "../module/main/MainView";
import OverMediator from "../module/over/OverMediator";
import OverView from "../module/over/OverView";
import PauseMediator from "../module/pause/PauseMediator";
import PauseView from "../module/pause/PauseView";

export default class RegisterMediator extends SimpleCommand implements ICommand {
    public constructor() {
        super();
    }

    public execute(notification: INotification): void {
        cc.log("RegisterMediator");
        this.facade.registerMediator(new LoginMediator(new LoginView()));
        this.facade.registerMediator(new MainMediator(new MainView()));
        this.facade.registerMediator(new BattleMediator(new BattleView()));
        this.facade.registerMediator(new RankMediator(new RankView()));
        this.facade.registerMediator(new LoadingMediator(new LoadingView()));
        this.facade.registerMediator(new LevelMediator(new LevelView()));
        this.facade.registerMediator(new OverMediator(new OverView()));
        this.facade.registerMediator(new PauseMediator(new PauseView()));
    }
}