import PathConst from "../const/PathConst";
import ResourceManager from "../manager/ResourceManager";

export default class BaseView extends cc.Component {
    protected root: cc.Node = null;

    protected asset: cc.Prefab;

    protected viewName: string;

    protected isOpen: boolean;

    public constructor() {
        super();
        this.isOpen = false;
    }

    public open(): void {
        if (!this.isOpen) {
            ResourceManager.getInstance().loadRes(PathConst.UI + this.viewName, this.loadSucc.bind(this));
        }
        else
        {
            cc.log(this.viewName + " --------------- 界面已被打开");
        }
    }

    protected loadSucc(prefab: cc.Prefab) {
        this.isOpen = true;
        this.asset = prefab;
        this.root = cc.instantiate(prefab);
        cc.director.getScene().getChildByName('Canvas').addChild(this.root);
    }

    public close(): void {
        if (this.root != null) {
            // this.root.removeAllChildren(true);
            // ResourceManager.getInstance().releaseRes(this.asset);
            cc.director.getScene().getChildByName('Canvas').removeChild(this.root, true);
            this.root = null;
            this.asset = null;
        }
        this.isOpen = false;
    }
}