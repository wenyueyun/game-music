import RankConst from "./RankConst";
import PathConst from "../../core/const/PathConst";
import ResourceManager from "../../core/manager/ResourceManager";
import BaseView from "../../core/component/BaseView";

export default class RankView extends BaseView {

    display: cc.Node = null;

    closeBtn: cc.Button = null;

    wxView: cc.WXSubContextView = null;

    shareBtn: cc.Button = null;


    public constructor() {
        super();
        this.viewName = "RankView";
    }


    //加载成功，初始化界面
    protected loadSucc(asset: cc.Prefab) {
        super.loadSucc(asset);

        this.shareBtn = cc.find("ShareBtn", this.root).getComponent(cc.Button);
        this.shareBtn.node.on(cc.Node.EventType.TOUCH_END, this.onShare);

        this.closeBtn = cc.find("CloseBtn", this.root).getComponent(cc.Button);
        this.closeBtn.node.on(cc.Node.EventType.TOUCH_END, this.onClose);

        this.display = cc.find("Scroll", this.root);

        this.wxView = this.display.getComponent(cc.WXSubContextView);
        // this.refreshBtn = cc.find("RefreshBtn",this.root).getComponent(cc.Button);
        // this.refreshBtn.node.on(cc.Node.EventType.TOUCH_END,this.onRefresh);

        // this.battleBtn = cc.find("BattleBtn",this.root).getComponent(cc.Button);
        // this.battleBtn.node.on(cc.Node.EventType.TOUCH_END,this.OnBattle);

        cc.systemEvent.dispatchEvent(new cc.Event(RankConst.RANK_VIEW_OPEN_SUCC, false));
    }

    public update(): void {
        if (this.wxView != null) {
            // this.wxView.updateSubContextViewport();
        }
    }

    private onClose(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(RankConst.RANK_VIEW_CLOSE_CLICK, false));
    }

     //点击分享按钮
     private onShare(): void {
        cc.systemEvent.dispatchEvent(new cc.Event(RankConst.RANK_VIEW_SHARE_CLICK, false));
    }


    public close(): void {
        this.closeBtn.node.off(cc.Node.EventType.MOUSE_UP, this.onClose);
        this.shareBtn.node.off(cc.Node.EventType.TOUCH_END, this.onShare);
        // this.refreshBtn.node.off(cc.Node.EventType.MOUSE_UP,this.onRefresh);
        // this.battleBtn.node.off(cc.Node.EventType.MOUSE_UP,this.OnBattle);
        super.close();
    }
}
