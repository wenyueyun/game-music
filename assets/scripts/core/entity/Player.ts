import Entity from "./Entity";
import PlayerVO from "./PlayerVO";
import PlayerState from "../const/PlayerState";
import ZindexConst from "../const/ZindexConst";

export default class Player extends Entity {
    public constructor() {
        super();
    }

    public getVO(): PlayerVO {
        return this.vo as PlayerVO;
    }

    protected showModel(prefab:cc.Prefab):void
    {
        this.model = cc.instantiate(prefab);
        if (this.model != null) {
            this.setSkeleton(this.model.getComponent(sp.Skeleton));
            this.node.addChild(this.model);
            this.model.setPosition(cc.Vec2.ZERO);
            this.run();
        }
    }

    protected skeletonComplete(trackEntry: any, loopCount: number) {
        super.skeletonComplete(trackEntry,loopCount)
        var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        if (animationName == PlayerState.ATK) {
            this.run();
        }
    }

    public run(): void {
        this.skeleton.setAnimation(0, PlayerState.RUN, true);
    }

    public atk(): void {
        this.skeleton.setAnimation(0, PlayerState.ATK, false);
    }

    public idle(): void {
        this.skeleton.setAnimation(0, PlayerState.IDLE, true);
    }

    public setParent(value: cc.Node)
    {
        super.setParent(value,ZindexConst.ZINDEX_PLAYER);
    }

    public destroy(): boolean {
        return super.destroy();
    }
}