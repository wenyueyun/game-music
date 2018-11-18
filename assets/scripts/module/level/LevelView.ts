import LevelConst from "./LevelConst";
import BaseView from "../../core/component/BaseView";
import GameConst from "../../core/const/GameConst";
import WXManager from "../../core/manager/WXManager";

export default class LevelView extends BaseView {

    lev_1_1: cc.Node = null;
    lev_1_2: cc.Node = null;
    lev_2_1: cc.Node = null;
    lev_2_2: cc.Node = null;
    lev_3_1: cc.Node = null;
    lev_3_2: cc.Node = null;
    lev1Btn: cc.Button = null;
    lev2Btn: cc.Button = null;
    lev3Btn: cc.Button = null;
    figthBtn: cc.Button = null;
    helpBtn:cc.Button = null;
    photoBtn:cc.Button = null;
    rankBtn:cc.Button = null;
    userIcon:cc.Sprite = null;
    userName:cc.Label = null;

    shareBtn: cc.Button = null;

    private curLev: number = 1;


    public constructor() {
        super();
        this.viewName = "LevelView";
    }


    //加载成功，初始化界面
    protected loadSucc(asset: cc.Prefab) {
        super.loadSucc(asset);

        this.lev1Btn = cc.find("Lev1Btn", this.root).getComponent(cc.Button);
        this.lev1Btn.node.on(cc.Node.EventType.TOUCH_END, this.onLevClick1, this);

        this.lev2Btn = cc.find("Lev2Btn", this.root).getComponent(cc.Button);
        this.lev2Btn.node.on(cc.Node.EventType.TOUCH_END, this.onLevClick2, this);

        this.lev3Btn = cc.find("Lev3Btn", this.root).getComponent(cc.Button);
        this.lev3Btn.node.on(cc.Node.EventType.TOUCH_END, this.onLevClick3, this);

        this.figthBtn = cc.find("FightBtn", this.root).getComponent(cc.Button);
        this.figthBtn.node.on(cc.Node.EventType.TOUCH_END, this.onFightClick, this);

        this.helpBtn = cc.find("HelpBtn", this.root).getComponent(cc.Button);
        this.helpBtn.node.on(cc.Node.EventType.TOUCH_END, this.onHelpClick, this);

        this.photoBtn = cc.find("PhotoBtn", this.root).getComponent(cc.Button);
        this.photoBtn.node.on(cc.Node.EventType.TOUCH_END, this.onPhotoClick, this);

        this.rankBtn = cc.find("RankBtn", this.root).getComponent(cc.Button);
        this.rankBtn.node.on(cc.Node.EventType.TOUCH_END, this.onRankClick, this);

        this.shareBtn = cc.find("ShareBtn", this.root).getComponent(cc.Button);
        this.shareBtn.node.on(cc.Node.EventType.TOUCH_END, this.onShareClick, this);

        this.userIcon = cc.find("UserInfo/UserIcon",this.root).getComponent(cc.Sprite);
        this.userName = cc.find("UserInfo/UserName",this.root).getComponent(cc.Label);

        this.lev_1_1 = cc.find("Lev_1_1", this.root);
        this.lev_1_2 = cc.find("Lev_1_2", this.root);
        this.lev_2_1 = cc.find("Lev_2_1", this.root);
        this.lev_2_2 = cc.find("Lev_2_2", this.root);
        this.lev_3_1 = cc.find("Lev_3_1", this.root);
        this.lev_3_2 = cc.find("Lev_3_2", this.root);

        this.lev_1_2.active = false;
        this.lev_2_2.active = false;
        this.lev_3_2.active = false;

        cc.systemEvent.dispatchEvent(new cc.Event(LevelConst.LEVEL_VIEW_OPEN_SUCC, false));
    }

    public updateLevView(lev: number): void {
        this.curLev = lev;
        this.lev_1_1.active = true;
        this.lev_2_1.active = true;
        this.lev_3_1.active = true;
        this.lev_1_2.active = false;
        this.lev_2_2.active = false;
        this.lev_3_2.active = false;
        if (lev == 1) {
            this.lev_1_1.active = false;
            this.lev_1_2.active = true;
        }
        else if (lev == 2) {
            this.lev_2_1.active = false;
            this.lev_2_2.active = true;
        }
        else if (lev == 3) {
            this.lev_3_1.active = false;
            this.lev_3_2.active = true;
        }
    }

    public setUserInfo(name:string,url:string):void
    {
        this.userName.string = name;
        cc.loader.load({
            url: url,
            type: 'png'
        }, (err, texture) => {
            if (err) console.error(err);
            this.userIcon.spriteFrame = new cc.SpriteFrame(texture);
        });
    } 

    private onLevClick1(): void {
        this.onLevClick(1);
    }

    private onLevClick2(): void {
        this.onLevClick(2);
    }

    private onLevClick3(): void {
        this.onLevClick(3);
    }

    private onLevClick(lev: number) {
        let event = new cc.Event.EventCustom(LevelConst.LEVEL_VIEW_LEVEL_CLICK, false);
        event.detail = lev;
        cc.systemEvent.dispatchEvent(event);
    }

    

    private onFightClick(): void {
        let event = new cc.Event.EventCustom(LevelConst.LEVEL_VIEW_FIGHT_CLICK, false);
        event.detail = this.curLev;
        cc.systemEvent.dispatchEvent(event);
    }

    private onHelpClick():void
    {
        cc.systemEvent.dispatchEvent(new cc.Event(LevelConst.LEVEL_VIEW_PHOTO_CLICK,false));
    }

    private onPhotoClick():void
    {
        cc.systemEvent.dispatchEvent(new cc.Event(LevelConst.LEVEL_VIEW_PHOTO_CLICK,false));
    }

    private onRankClick():void
    {
        cc.systemEvent.dispatchEvent(new cc.Event(LevelConst.LEVEL_VIEW_RANK_CLICK,false));
    }

    private onShareClick():void
    {
        if(GameConst.isWX)
        {
            WXManager.getInstance().share(false);
        }
    }

    public close(): void {
        this.lev1Btn.node.off(cc.Node.EventType.TOUCH_END, this.onLevClick1, this);
        this.lev2Btn.node.off(cc.Node.EventType.TOUCH_END, this.onLevClick2, this);
        this.lev3Btn.node.off(cc.Node.EventType.TOUCH_END, this.onLevClick3, this);
        this.figthBtn.node.off(cc.Node.EventType.TOUCH_END, this.onFightClick, this);
        this.helpBtn.node.off(cc.Node.EventType.TOUCH_END, this.onHelpClick, this);
        this.photoBtn.node.off(cc.Node.EventType.TOUCH_END, this.onPhotoClick, this);
        this.rankBtn.node.off(cc.Node.EventType.TOUCH_END, this.onRankClick, this);
        this.shareBtn.node.off(cc.Node.EventType.TOUCH_END, this.onShareClick, this);
        this.lev_1_1 = null;
        this.lev_1_2 = null;
        this.lev_2_1 = null;
        this.lev_2_2 = null;
        this.lev_3_1 = null;
        this.lev_3_2 = null;
        this.lev1Btn = null;
        this.lev2Btn = null;
        this.lev3Btn = null;
        this.figthBtn = null;
        super.close();
    }
}
