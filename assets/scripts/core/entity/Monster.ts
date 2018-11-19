import Entity from "./Entity";
import EntityVO from "./EntityVO";
import MonsterVO from "./MonsterVO";
import NoteConfig from "../config/NoteConfig";
import ConfigManager from "../manager/ConfigManager";
import MonsterState from "../const/MonsterState";

export default class Monster extends Entity {

    private note: NoteConfig;
    private lastAudioTime: number;
    private timeLabel: cc.Label;
    public constructor() {
        super();

        this.timeLabel = this.node.addComponent(cc.Label);
        this.timeLabel.node.setPosition(cc.v2(0,100));
    }

    public onUpdate(audioTime: number, dt: number, speed: number) {
        var target_x = (this.note.startTime - audioTime * 1000) * speed - 400
        var pos = this.node.getPosition();
        if (this.lastAudioTime == audioTime) {
            pos.x -= speed * dt * 1000;
        }
        else {
            if (pos.x > target_x) {
                pos.x = target_x;
            }
        }

        this.node.setPosition(pos);

        if (this.node.getPosition().x <= -1200) {
            this.die();
        }
        this.lastAudioTime = audioTime;
    }

    public getVO(): EntityVO {
        return this.vo as MonsterVO;
    }

    public setNote(n: NoteConfig) {
        this.note = n;
        this.timeLabel.string = n.startTime.toString();
    }

    public getNote(): NoteConfig {
        return this.note;
    }

    public run(): void {
        this.skeleton.setAnimation(0, MonsterState.RUN, true);
    }

    public atk(): void {
        this.skeleton.setAnimation(0, MonsterState.ATK, false);
    }

    public idle(): void {
        this.skeleton.setAnimation(0, MonsterState.IDLE, true);
    }


    protected skeletonEvent(trackEntry: any, event: any) {
        super.skeletonEvent(trackEntry, event)
        var animationName = trackEntry.animation ? trackEntry.animation.name : "";
        if (animationName == MonsterState.RUN) {
            this.run();
        }
    }

    public destroy(): boolean {
        this.note = null;
        return super.destroy();
    }
}