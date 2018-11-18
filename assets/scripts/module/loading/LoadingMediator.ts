import Mediator from "../../mvc/patterns/mediator/Mediator";
import IMediator from "../../mvc/interfaces/IMediator";
import INotification from "../../mvc/interfaces/INotification";
import LevelConst from "../Level/LevelConst";
import LoadingConst from "./LoadingConst";
import LoadingView from "./LoadingView";

export default class LoadingMediator extends Mediator implements IMediator {
    public static NAME: string = "LoadingMediator";

    listNotificationInterests(): string[] {
        return [
            LoadingConst.LOADING_MEDIATOR_OPEN,
            LoadingConst.LOADING_MEDIATOR_CLOSE,
            LoadingConst.LOADING_MEDIATOR_UPDATE,
        ];
    }

    public constructor(viewComponent: any) {
        super(LoadingMediator.NAME, viewComponent);
    }

    public getViewComponent(): LoadingView {
        return this.viewComponent as LoadingView;
    }

    public handleNotification(notification: INotification): void {
        super.handleNotification(notification);
        const data: any = notification.getBody();
        switch (notification.getName()) {
            case LoadingConst.LOADING_MEDIATOR_OPEN:
                cc.log("打开加载界面");
                this.addEvent();
                this.getViewComponent().open();
                break;
            case LoadingConst.LOADING_MEDIATOR_CLOSE:
                this.removeEvent();
                this.getViewComponent().close();
                break;
            case LoadingConst.LOADING_MEDIATOR_UPDATE:
                this.getViewComponent().updateView(data);
                break;
        }
    }


    public addEvent(): void {
        cc.systemEvent.on(LoadingConst.LOADING_VIEW_OPEN_SUCC, this.onOpenSucc, this);

    }

    public removeEvent(): void {
        cc.systemEvent.off(LoadingConst.LOADING_VIEW_OPEN_SUCC, this.onOpenSucc, this);
    }

    //UI打开成功
    private onOpenSucc(): void {
        cc.log("加载界面完全打开");

    }
}
