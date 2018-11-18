import RegisterCommand from "../../Register/RegisterCommand";
import RegisterModel from "../../Register/RegisterModel";
import RegisterMediator from "../../Register/RegisterMediator";
import MacroCommand from "../../mvc/patterns/command/MacroCommand";
import ICommand from "../../mvc/interfaces/ICommand";
import ConfigManager from "../../Core/Manager/ConfigManager";
import WXManager from "../../core/manager/WXManager";
import MainConst from "../main/MainConst";
import GameConst from "../../core/const/GameConst";
import INotification from "../../mvc/interfaces/INotification";
import LoadingConst from "../loading/LoadingConst";
import ResourceManager from "../../core/manager/ResourceManager";
import PathConst from "../../core/const/PathConst";

export default class StartCommand extends MacroCommand implements ICommand {
    public static NAME: string = "StartCommand";

    public initializeMacroCommand(): void {
        this.addSubCommand(RegisterModel);
        this.addSubCommand(RegisterMediator);
        this.addSubCommand(RegisterCommand);
    }

    public execute(notification: INotification): void {
        super.execute(notification)

        cc.loader.loadRes(PathConst.UI + "MainView",
            (err, prefab) => {
                if (err) {
                    cc.error(err.message || err);
                }
                else {
                    this.sendNotification(MainConst.MAIN_MEDIATOR_OPEN);
                    ResourceManager.getInstance().loadResDir("preload",
                        (resource) => {
                            //读取json文件
                            ConfigManager.getInstance().loadConfig(resource);

                            //登录
                            if (GameConst.isWX) {
                                WXManager.getInstance().checkSession();
                            }
                            else {
                                this.sendNotification(MainConst.MAIN_MEDIATOR_OPEN);
                                this.sendNotification(MainConst.MAIN_MEDIATOR_LOGIN,false);
                            }
                        },
                        (progress) => {
                            //更新加载进度
                            this.sendNotification(MainConst.MAIN_MEDIATOR_UPDATE, progress);
                        });
                }
            })
    }
}