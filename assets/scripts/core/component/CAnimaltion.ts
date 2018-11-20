import EffectManager from "../manager/EffectManager";

export default class CAnimaltion extends cc.Component {
    private animation: cc.Animation;
    onLoad() {
        cc.log("给动画加上控制脚本");
      
    }

    start()
    {
        this.animation = this.getComponent(cc.Animation);
        this.animation.on('finished', this.onFinished, this);
    }


    private onFinished(): void {
        this.animation.off('finished', this.onFinished, this);
        cc.log('onFinished');
        EffectManager.getInstance().hideEffect(this.node);
    }

    public playOver() {
        cc.log("侦听到动画事件");
    }

    public destroy(): boolean {
        if (this.animation != null) {
            this.animation.destroy();
            this.animation = null;
        }
        return super.destroy();
    }
}