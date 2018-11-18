import LoadingConst from "./LoadingConst";
import BaseView from "../../core/component/BaseView";

export default class LoadingView extends BaseView {

    bar: cc.ProgressBar = null;
    proLabel: cc.Label = null;

    public constructor() {
        super();
        this.viewName = "LoadingView";
    }
    //加载成功，初始化界面
    protected loadSucc(asset: cc.Prefab) {
        super.loadSucc(asset);

        this.bar = cc.find("ProgressBar", this.root).getComponent(cc.ProgressBar);
        this.bar.progress = 0;

        this.proLabel = cc.find("ProgressLabel", this.root).getComponent(cc.Label);

        cc.systemEvent.dispatchEvent(new cc.Event(LoadingConst.LOADING_VIEW_OPEN_SUCC, false));
    }

    public updateView(value: number) {
        if (this.bar != null) {
            var pro =  Math.max(this.bar.progress, Math.min(value, 1));
            this.bar.progress =pro;
            this.proLabel.string = (pro*100).toString()+"%";
            cc.log("加载进度-------------->" + pro);
        }
    }

    public close(): void {
        super.close();
    }
}
