import BaseView from "../../core/component/BaseView";
import PauseConst from "./PauseConst";

export default class PauseView extends BaseView {

    private exitBtn: cc.Button = null;
    private restartBtn: cc.Button = null;
    private continueBtn: cc.Button = null;

    public constructor() {
        super();
        this.viewName = "PauseView";
    }

    //加载成功，初始化界面
    protected loadSucc(prefab: cc.Prefab) {
        super.loadSucc(prefab);

        this.exitBtn = cc.find("ExitBtn", this.root).getComponent(cc.Button);
        this.exitBtn.node.on(cc.Node.EventType.TOUCH_END, this.onExitClick, this);

        this.restartBtn = cc.find("RestartBtn", this.root).getComponent(cc.Button);
        this.restartBtn.node.on(cc.Node.EventType.TOUCH_END, this.onRestartClick, this);

        this.continueBtn = cc.find("ContinueBtn", this.root).getComponent(cc.Button);
        this.continueBtn.node.on(cc.Node.EventType.TOUCH_END, this.onContinueClick, this);

        cc.systemEvent.dispatchEvent(new cc.Event(PauseConst.PAUSE_VIEW_OPEN_SUCC, false));
    }

    private onExitClick(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(PauseConst.PAUSE_VIEW_EXIT_CLICK, false));
    }

    private onRestartClick(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(PauseConst.PAUSE_VIEW_RESTART_CLICK, false));
    }

    private onContinueClick(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(PauseConst.PAUSE_VIEW_CONTINUE_CLICK, false));
    }

    //关闭界面
    public close(): void {
        super.close();
    }
}