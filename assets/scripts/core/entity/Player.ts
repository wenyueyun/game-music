import Entity from "./Entity";
import PlayerVO from "./PlayerVO";
import EntityVO from "./EntityVO";
import PlayerState from "../const/PlayerState";

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
            this.model.setPosition(cc.v2(0, -this.modeSize.y / 2 * this.model.scale));

            this.run();
        }
    }

    protected skeletonEvent(trackEntry: any, event: any) {
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

    public destroy(): boolean {
        return super.destroy();
    }
}