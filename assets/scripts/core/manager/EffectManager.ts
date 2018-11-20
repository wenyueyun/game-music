import Entity from "../entity/Entity";
import CAnimaltion from "../component/CAnimaltion";
import PathConst from "../const/PathConst";

export default class EffectManager {
    private static instance: EffectManager = null;
    public static getInstance(): EffectManager {
        if (EffectManager.instance == null) {
            EffectManager.instance = new EffectManager();
        }
        return EffectManager.instance;
    }

    public showEffect(path:string,target:Entity,pos:cc.Vec2 = cc.Vec2.ZERO,value:string=""):void
    {   
        cc.log("添加特效");
        cc.loader.loadRes(PathConst.EFFECT + path,(err,prefab)=>
        {
            if (err) {
		        cc.error(err.message || err);
            }
            else
            {
                var effect:cc.Node = cc.instantiate(prefab);
                if(value != "")
                {
                    var label:cc.Label = cc.find("Label",effect).getComponent(cc.Label);
                    label.string = value.toString();
                }
                effect.setPosition(pos);
                effect.addComponent(CAnimaltion);
                target.addEffect(effect);
            }
        })
    }

    public hideEffect(effetc:cc.Node)
    {
        cc.log("移除特效");
        effetc.destroy();
    }
}