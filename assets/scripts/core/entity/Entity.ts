import EntityVO from "./EntityVO";
import IEntity from "../interfaces/IEntity";
import IDispose from "../interfaces/IDispose";
import PlayerState from "../const/PlayerState";
import PathConst from "../const/PathConst";

export default class Entity implements IEntity {
    protected node: cc.Node;

    protected vo: EntityVO;

    protected bid: number;

    protected pos: cc.Vec2 = cc.Vec2.ZERO;

    protected scale: cc.Vec2 = cc.Vec2.ONE;

    protected modeSize: cc.Vec2;

    protected model: cc.Node;

    protected parent: cc.Node;

    protected skeleton: sp.Skeleton;

    public constructor() {
        this.node = new cc.Node("monster");
        var node = new cc.Node("png");
        this.node.addChild(node);
        cc.loader.loadRes(PathConst.TEXTURE + "monster", cc.SpriteFrame, (err, spriteFrame) => {
            if (err) {
                cc.error(err.message || err);
            }
            else {
        
                var s: cc.Sprite = node.addComponent(cc.Sprite);
                s.spriteFrame = spriteFrame;
            }
        });
    }


    public update(dt) {

    }


    public setVO(vo: EntityVO) {
        this.vo = vo;
        this.loadModel(this.vo.getModel());
    }

    protected loadModel(path: string) {
        cc.loader.loadRes(path, (err, prefab) => {
            if (err) {
                cc.error(err.message || err);
            }
            else {
               this.showModel(prefab);
            }
        })
    }

    protected showModel(prefab:cc.Prefab):void
    {
    }


    public setParent(value: cc.Node,zindex:number = 50) {
        this.parent = value;
        if (this.parent != null) {
            this.parent.addChild(this.node,zindex);
        }
        else {
            this.model.removeFromParent();
        }
    }

    public setPos(value: cc.Vec2) {
        this.pos = value;
        if (this.node != null) {
            this.node.setPosition(value);
        }
    }

  
    public setScale(value: cc.Vec2) {
        this.scale = value;
        if (this.node != null) {
            this.node.setScale(value);
        }
    }


    //加特效
    public addEffect(effect:cc.Node)
    {
        this.node.addChild(effect,100);
    }

    protected setSkeleton(value: sp.Skeleton): void {
        if (value != null) {
            this.skeleton = value;

            var ske: any = this.skeleton.skeletonData.skeletonJson.skeleton;
            if (ske != null) {
                this.modeSize = cc.v2(ske.width, ske.height);
            }

            this.skeleton.setStartListener(this.skeletonStart.bind(this));

            this.skeleton.setInterruptListener(this.skeletonInterrupt.bind(this));

            this.skeleton.setEndListener(this.skeletonEnd.bind(this));

            this.skeleton.setDisposeListener(this.skeletonDispose.bind(this));

            this.skeleton.setCompleteListener(this.skeletonComplete.bind(this));

            this.skeleton.setEventListener(this.skeletonEvent.bind(this));
        }
    }

    protected skeletonStart(trackEntry: any) {
        var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        // cc.log("[track %s][animation %s] start.", trackEntry.trackIndex, animationName);
    }

    protected skeletonEnd(trackEntry: any) {
        var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        // cc.log("[track %s][animation %s] end.", trackEntry.trackIndex, animationName);
    }

    protected skeletonInterrupt(trackEntry: any) {
        var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        // cc.log("[track %s][animation %s] interrupt.", trackEntry.trackIndex, animationName);
    }

    protected skeletonComplete(trackEntry: any, loopCount: number) {
        var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        // cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
    }

    protected skeletonEvent(trackEntry: any, event: any) {
        var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        // cc.log("[track %s][animation %s] event: %s, %s, %s, %s", trackEntry.trackIndex, animationName, event.data.name, event.intValue, event.floatValue, event.stringValue);
    }

    protected skeletonDispose(trackEntry: any) {
        var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        // cc.log("[track %s][animation %s] will be disposed.", trackEntry.trackIndex, animationName);
    }

    public run(): void {
    }

    public atk(): void {
    }

    public idle(): void {
    }

    public die(): void {
        this.vo.Hp = 0;
    }

    public getBid(): number {
        return this.bid;
    }

    public getVO(): EntityVO {
        return this.vo;
    }

    public getModel(): cc.Node {
        return this.model;
    }

    public getNode():cc.Node
    {
        return this.node;
    }

    public getPos():cc.Vec2
    {
        return this.node.getPosition();
    }

    public getTopPos():cc.Vec2
    {
        return cc.v2(0,this.modeSize.y/2)
    }

    public getBottomPos():cc.Vec2
    {
        return cc.v2(0,-this.modeSize.y/2)
    }

    public getRightPos():cc.Vec2
    {
        return cc.v2(this.modeSize.x/2,this.modeSize.y/2)
    }

    public getLeftPos():cc.Vec2
    {
        return cc.v2(-this.modeSize.x/2,this.modeSize.y/2)
    }

    public destroy(): boolean {
        if (this.skeleton) {
            this.skeleton.destroy();
            this.skeleton = null;
        }

        if (this.model) {
            this.model.destroy();
            this.model = null;
        }
        this.vo = null;
        this.node.removeAllChildren();
        this.node = null;
        return true;
    }
}