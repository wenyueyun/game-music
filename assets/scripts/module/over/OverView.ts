import BaseView from "../../core/component/BaseView";
import OverConst from "./OverConst";

export default class OverView extends BaseView {

    puzzle:cc.Node;
    titleLabel:cc.Label = null;
    levelLabel:cc.Label = null;
    tpLabel:cc.Label = null;
    scoreLabel:cc.Label = null;
    comboLabel:cc.Label = null;
    perfectLabel:cc.Label = null;
    goodLabel:cc.Label = null;
    badLabel:cc.Label = null;
    missLabel:cc.Label = null;
    shareBtn:cc.Button = null;
    restartBtn:cc.Button = null
    exiteBtn: cc.Button = null;

    public constructor() {
        super();
        this.viewName = "OverView";
    }


    //加载成功，初始化界面
    protected loadSucc(asset: cc.Prefab) {
        super.loadSucc(asset);

        this.puzzle = cc.find("Puzzle",this.root);
        this.titleLabel = cc.find("TitleLabel",this.root).getComponent(cc.Label);
        this.levelLabel = cc.find("LevelLabel",this.root).getComponent(cc.Label);
        this.tpLabel = cc.find("TpLabel",this.root).getComponent(cc.Label);
        this.scoreLabel = cc.find("ScoreLabel",this.root).getComponent(cc.Label);
        this.comboLabel = cc.find("cCmboLabel",this.root).getComponent(cc.Label);
        this.perfectLabel = cc.find("PerfectLabel",this.root).getComponent(cc.Label);
        this.goodLabel = cc.find("GoodLabel",this.root).getComponent(cc.Label);
        this.badLabel = cc.find("BadLabel",this.root).getComponent(cc.Label);
        this.missLabel = cc.find("MissLabel",this.root).getComponent(cc.Label);

        this.shareBtn = cc.find("ShareBtn", this.root).getComponent(cc.Button);
        this.shareBtn.node.on(cc.Node.EventType.TOUCH_END, this.onShareClick);

        this.restartBtn = cc.find("RestartBtn", this.root).getComponent(cc.Button);
        this.restartBtn.node.on(cc.Node.EventType.TOUCH_END, this.onRestartClick);

        this.exiteBtn = cc.find("ExiteBtn", this.root).getComponent(cc.Button);
        this.exiteBtn.node.on(cc.Node.EventType.TOUCH_END, this.onExitClick);

        cc.systemEvent.dispatchEvent(new cc.Event(OverConst.OVER_VIEW_OPEN_SUCC, false));
    }

    private onShareClick():void
    {

    }

    //点击重开按钮
    private onRestartClick():void
    {
        cc.systemEvent.dispatchEvent(new cc.Event(OverConst.OVER_VIEW_RESTART_CLICK, false));
    }

    // //点击关闭按钮
    private onExitClick(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(OverConst.OVER_VIEW_EXIT_CLICK, false));
    }

    //关闭界面
    public close(): void {
        super.close();
    }
}