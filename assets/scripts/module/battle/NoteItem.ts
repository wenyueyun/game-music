import NoteConfig from "../../core/config/NoteConfig";

export default class NoteItem {
    private vo: NoteConfig;
    private node: cc.Node;
    private parent: cc.Node;
    private time: cc.Label;
    private track: string;
    private callFun: Function;

    private startTime: number;
    private lastAudioTime: number;

    public constructor(track: string, node: cc.Node, parent: cc.Node, position: cc.Vec2, call: Function) {
        this.track = track;
        this.node = node;
        this.parent = parent;
        this.node.active = true;
        this.parent.addChild(node);
        this.node.setPosition(position);
        this.setColor(cc.Color.WHITE);
        this.time = cc.find("TimeLabel", this.node).getComponent(cc.Label);
        this.callFun = call;
    }

    public update(audioTime: number, dt: number, speed: number) {

        var target_x = (this.vo.startTime - audioTime * 1000) * speed - 400
        var pos = this.node.getPosition();
        if (this.lastAudioTime == audioTime) {
            // if (pos.x > target_x) {
                pos.x -= speed * dt * 1000;
            // }
        }
        else {
            if (pos.x > target_x) {
                pos.x = target_x;
            }
        }


        // // if (Math.abs(dis - pos.x) > 200 * speed) {
        // //     pos.x = dis;
        // // }

        // pos.x = dis;

        this.startTime -= dt * 1000;

        this.node.setPosition(pos);

        if (this.node.getPosition().x <= -1200) {

            this.dispose();
        }

        this.lastAudioTime = audioTime;
    }

    public setVO(vo: NoteConfig) {
        this.vo = vo;
        this.startTime = vo.startTime;
        this.time.string = this.vo.startTime.toString();

        // if(this.vo.endTime > this.vo.startTime)
        // {
        //     this.node.anchorX = 0;
        // }
        // else
        // {
        //     this.node.anchorX = 0.5;
        // }
    }

    public setWidth(value: number): void {
        var size: cc.Size = this.node.getContentSize();
        size.width = value;
        this.node.setContentSize(size);
    }

    public setColor(value: cc.Color) {
        this.node.color = value;
    }

    public getVO(): NoteConfig {
        return this.vo;
    }

    public getPosition(): cc.Vec2 {
        return this.node.position;
    }

    public getNode(): cc.Node {
        return this.node;
    }

    public getTrack(): string {
        return this.track;
    }

    public isHit(result: Function): boolean {
        var pos = this.node.getPosition();
        // cc.log("hit------------ "+ this.vo.startTime  +" --------- " + this.startTime);
        // if(this.startTime <= 100  && this.startTime > -100)
        // {
        //     cc.log("pos---------------->击中 " + this.vo.startTime);
        //     if (result) {
        //         result(this);
        //     }
        //     return true;
        // }

        if (pos.x >= -420 && pos.x < -380) {
            cc.log("pos---------------->击中 " + this.vo.startTime);
            if (result) {
                result(this);
            }
            return true;
        }
        false;
    }

    public dispose(): void {
        if (this.callFun) {
            this.callFun(this);
            this.callFun = null;
        }
    }
}