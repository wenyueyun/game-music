import EntityVO from "./EntityVO";
import IEntity from "../interfaces/IEntity";
import IDispose from "../interfaces/IDispose";
import PlayerState from "../const/PlayerState";
import PathConst from "../const/PathConst";

export default class Entity extends cc.Component implements IEntity, IDispose {
    protected vo: EntityVO;

    protected bid: number;

    protected pos: cc.Vec2;

    protected scale: cc.Vec2;

    private model: cc.Node;

    private parent: cc.Node;

    private skeleton: sp.Skeleton;

    public constructor() {
        super();
    }

    
    public setVO(vo: EntityVO) {
        this.vo = vo;
        this.loadModel();
    }

    protected loadModel() {
        cc.loader.loadRes(PathConst.PLAYER+"Girl", (err, prefab) => {
            if (err) {
                cc.error(err.message || err);
            }
            else {
                this.model = cc.instantiate(prefab);
                if (this.model != null) {

                    if (this.parent != null) {
                        this.parent.addChild(this.model, 99);
                    }
                    this.model.setScale(this.scale);
                    this.model.setPosition(this.pos);

                    this.setSkeleton(this.model.getComponent(sp.Skeleton));

                    this.run();
                }
            }
        })
    }

    public setParent(value: cc.Node) {
        cc.log("setParent ---->" + value.name);
        this.parent = value;
        if (this.model != null) {
            if (this.parent != null) {
                this.parent.addChild(this.model);
            }
            else {
                this.model.removeFromParent();
            }
        }
    }

    public setPos(value: cc.Vec2) {
        cc.log("setPos ---->" + value);
        this.pos = value;
        if (this.model != null) {
            this.model.setPosition(value);
        }
    }

    public setScale(value: cc.Vec2) {
        cc.log("setScale ---->" + value);
        this.scale = value;
        if (this.model != null) {
            this.model.setScale(value);
        }
    }

    private setSkeleton(value: sp.Skeleton): void {
        if (value != null) {
            this.skeleton = value;

            this.skeleton.setStartListener(trackEntry=>
            {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                // cc.log("[track %s][animation %s] start.", trackEntry.trackIndex, animationName);
            });

            this.skeleton.setInterruptListener(trackEntry => {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                // cc.log("[track %s][animation %s] interrupt.", trackEntry.trackIndex, animationName);
            });

            this.skeleton.setEndListener(trackEntry => {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                // cc.log("[track %s][animation %s] end.", trackEntry.trackIndex, animationName);
            });
            this.skeleton.setDisposeListener(trackEntry => {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                // cc.log("[track %s][animation %s] will be disposed.", trackEntry.trackIndex, animationName);
            });
            this.skeleton.setCompleteListener((trackEntry, loopCount) => {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";

                // cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            });
            this.skeleton.setEventListener((trackEntry, event) => {
                var animationName = trackEntry.animation ? trackEntry.animation.name : "";
                if(animationName == PlayerState.ATK)
                {
                    this.run();
                }
                // cc.log("[track %s][animation %s] event: %s, %s, %s, %s", trackEntry.trackIndex, animationName, event.data.name, event.intValue, event.floatValue, event.stringValue);
            });
        }
    }

    public run(): void {
        this.skeleton.setAnimation(0, PlayerState.RUN, true);
    }

    public atk():void
    {
        this.skeleton.setAnimation(0, PlayerState.ATK, false);
    }

    public idle():void
    {
        this.skeleton.setAnimation(0, PlayerState.IDLE, true);
    }

    public getBid(): number {
        return this.bid;
    }

    public getVO(): EntityVO {
        return this.vo;
    }

    public getModel():cc.Node
    {
        return this.model;
    }

    public dispose() {

    }
}