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
                cc.log("怪物模型加载成功");
                this.model = cc.instantiate(prefab);
                if (this.model != null) {

                    this.setSkeleton(this.model.getComponent(sp.Skeleton));

                    this.node.addChild(this.model);
                    this.model.setPosition(cc.v2(0, -this.modeSize.y / 2 * this.model.scale));

                    this.run();
                }
            }
        })
    }

    public setParent(value: cc.Node) {
        cc.log("setParent ---->" + value.name);
        this.parent = value;
        if (this.parent != null) {
            this.parent.addChild(this.node, 99);
        }
        else {
            this.model.removeFromParent();
        }
        // }
    }

    public setPos(value: cc.Vec2) {
        cc.log("setPos ---->" + value);
        this.pos = value;
        if (this.node != null) {
            this.node.setPosition(value);
        }
    }

    public setScale(value: cc.Vec2) {
        cc.log("setScale ---->" + value);
        this.scale = value;
        if (this.node != null) {
            this.node.setScale(value);
        }
    }

    private setSkeleton(value: sp.Skeleton): void {
        if (value != null) {
            this.skeleton = value;

            var ske: any = this.skeleton.skeletonData.skeletonJson.skeleton;
            if (ske != null) {
                cc.log("ske.width------------" + ske.width);
                cc.log("ske.heith------------" + ske.height);
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
        return true;
    }
}