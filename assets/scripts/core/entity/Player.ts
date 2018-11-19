import Entity from "./Entity";
import PlayerVO from "./PlayerVO";
import EntityVO from "./EntityVO";
import PlayerState from "../const/PlayerState";

export default class Player extends Entity {
    public constructor() {
        super();
    }

    public getVO(): EntityVO {
        return this.vo as PlayerVO;
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