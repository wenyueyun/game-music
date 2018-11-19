import Entity from "./Entity";
import EntityVO from "./EntityVO";
import MonsterVO from "./MonsterVO";
import NoteConfig from "../config/NoteConfig";
import ConfigManager from "../manager/ConfigManager";
import MonsterState from "../const/MonsterState";
import PathConst from "../const/PathConst";

export default class Monster extends Entity {

    private note: NoteConfig;
    private lastAudioTime: number;
    private timeLabel: cc.Label;
    private modelExt: cc.Node;
    private modeLink:cc.Node;
    private tempoTime:number;

    public constructor() {
        super();

        var timeNode: cc.Node = new cc.Node("time");
        this.node.addChild(timeNode);
        this.timeLabel = timeNode.addComponent(cc.Label);
        this.timeLabel.node.setPosition(cc.v2(0, 100));
    }

    protected showModel(prefab: cc.Prefab): void {

        this.model = cc.instantiate(prefab);
        this.setSkeleton(this.model.getComponent(sp.Skeleton));
        this.node.addChild(this.model,2);
        this.model.setPosition(cc.v2(0, -this.modeSize.y / 2 * this.model.scale));
        this.run();

        if (this.getVO().config.type == 2) {
            cc.log("==========================面条怪来了");
            this.modelExt = cc.instantiate(prefab);
            this.node.addChild(this.modelExt,2);
            this.modelExt.setPosition(cc.v2((this.note.endTime - this.note.startTime)/this.tempoTime * 150, this.model.getPosition().y));

            let width = (this.note.endTime - this.note.startTime)/this.tempoTime * 150;

            this.loadLink(cc.size(width,60),cc.v2(width/2+this.model.getPosition().x,0));
        }
        else if (this.getVO().config.type == 3) {
            this.modelExt = cc.instantiate(prefab);
            this.node.addChild(this.modelExt,2);
            this.modelExt.setPosition(cc.v2(0, -this.modeSize.y / 2 * this.model.scale - 120));

            this.loadLink(cc.size(60,120),cc.v2(0,-60));
        }

    }

    private loadLink(size:cc.Size,pos:cc.Vec2)
    {
        cc.loader.loadRes(PathConst.MONSTER + "LinkNode",  (err, prefab) => {
            if (err) {
                cc.error(err.message || err);
            }
            else {
               this.modeLink = cc.instantiate(prefab);
               this.node.addChild(this.modeLink,1);
               this.modeLink.setPosition(pos);
               this.modeLink.setContentSize(size)
            }
        });
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

    public getVO(): MonsterVO {
        return this.vo as MonsterVO;
    }

    public setNote(n: NoteConfig) {
        this.note = n;
        this.timeLabel.string = n.startTime.toString();
    }

    public setTempoTime(value:number)
    {
        this.tempoTime = value;
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