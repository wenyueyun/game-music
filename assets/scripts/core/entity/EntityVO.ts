import EntityEvent from "../const/EntityEvent";

export default class EntityVO {
    
    protected bid: number;

    protected hp:number;
    
    public constructor() {

    }
    
    public set Hp(v : number) {
        this.hp = v;
        if(v <=0)
        {
            let event = new cc.Event.EventCustom(EntityEvent.ENTITIY_DIE, false);
            event.detail = this;
            cc.systemEvent.dispatchEvent(event);
        }
        else
        {
            let event = new cc.Event.EventCustom(EntityEvent.ENTITIY_DIE, false);
            event.detail = v;
            cc.systemEvent.dispatchEvent(event);
        }
    }
    
    
    public get value() : number {
        return this.hp;
    }

    public getModel():string
    {
        return "";
    }
}