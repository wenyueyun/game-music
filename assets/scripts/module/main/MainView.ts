import ResourceManager from "../../core/manager/ResourceManager";
import PathConst from "../../core/const/PathConst";
import MainConst from "./MainConst";
import BaseView from "../../core/component/BaseView";

export default class MainView extends BaseView {

    shareBtn: cc.Button = null;

    startBtn: cc.Button = null;

    login: cc.Node = null;

    progress: cc.Node = null;

    progressBar: cc.ProgressBar = null;

    progressLabel: cc.Label = null;

    public constructor() {
        super();
        this.viewName = "MainView";
    }


    //加载成功，初始化界面
    protected loadSucc(asset: cc.Prefab) {
        super.loadSucc(asset);

        this.login = cc.find("LoginBtn", this.root);
        this.login.active = false;

        this.progress = cc.find("Progress", this.root);

        this.progressBar = cc.find("Progress/ProgressBar", this.root).getComponent(cc.ProgressBar);
        this.progressBar.progress = 0;

        this.progressLabel = cc.find("Progress/ProgressLabel", this.root).getComponent(cc.Label);

        this.shareBtn = cc.find("ShareBtn", this.root).getComponent(cc.Button);
        this.shareBtn.node.on(cc.Node.EventType.TOUCH_END, this.onShareClick);

        this.startBtn = cc.find("StartBtn", this.root).getComponent(cc.Button);
        // this.startBtn.node.active = false;
        this.startBtn.node.on(cc.Node.EventType.TOUCH_END, this.onStartClick);

        this.showPro(true);

        cc.systemEvent.dispatchEvent(new cc.Event(MainConst.MAIN_VIEW_OPEN_SUCC, false));
    }

    //点击分享按钮
    private onShareClick(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(MainConst.MAIN_VIEW_SHARE_CLICK, false));
    }

    //点击开始按钮
    private onStartClick(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(MainConst.MAIN_VIEW_START_CLICK, false));
    }

    public updateView(value: number) {
        if (this.progressBar != null) {
            var pro = Math.max(this.progressBar.progress, Math.min(value, 1));
            this.progressBar.progress = pro;
            this.progressLabel.string = (pro * 100).toString() + "%";
        }

        if (value >= 1) {
            this.showPro(false);
        }
    }

    public showPro(flag: boolean) {
        this.progress.active = flag;
    }

    public showLogin(flag: boolean) {
        this.login.active = flag;
        this.startBtn.node.active = !flag;
        this.shareBtn.node.active = !flag;
    }

    //关闭界面
    public close(): void {
        this.shareBtn.node.off(cc.Node.EventType.TOUCH_END, this.onShareClick);
        this.startBtn.node.off(cc.Node.EventType.TOUCH_END, this.onStartClick);
        this.shareBtn = null;
        this.startBtn = null;
        super.close();
    }
}