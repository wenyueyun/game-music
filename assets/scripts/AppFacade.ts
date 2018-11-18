import Facade from "./mvc/patterns/facade/Facade";
import GameConst from "./core/const/GameConst";
import StartCommand from "./module/start/StartCommand";


export default class AppFacade extends Facade {

    public static instance: AppFacade;

    public static getInstance(): AppFacade {
        if (AppFacade.instance == null) {
            AppFacade.instance = new AppFacade();
        }
        return <AppFacade><any>(AppFacade.instance);
    }

    /**
      * 启动PureMVC
      */
    public startup(): void {
        cc.log("AppFacade.starUp");
        this.sendNotification(GameConst.GAME_START);
        this.removeCommand(GameConst.GAME_START); // PureMVC初始化完成，注销STARUP命令
    }

    /**
     * 更新
     */
    public update(dt):void
    {
        this.sendNotification(GameConst.GAME_UPDATE,dt);
    }

    /**
     * 以下 是 该类的初始化函数，创建改类实例后会自动调用改函数
     */
    public initializeFacade(): void {
        super.initializeFacade();
    }

    /**
     * 注册数据模型
     */
    public initializeModel(): void {
        super.initializeModel();
    }

    /**
     * 注册控制器
     */
    public initializeController(): void {
        super.initializeController();
        this.registerCommand(GameConst.GAME_START, StartCommand);
    }

    /**
     * 注册View视图
     */
    public initializeView(): void {
        super.initializeView();
    }

}