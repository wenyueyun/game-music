import EntityEvent from "../const/EntityEvent";

export default class EntityVO {
    
    protected id: string;
   
    public get ID() : string {
        return this.id
    }

    protected bid:number;

    protected hp:number;
    
    public constructor() {
        this.id = this.UUID();
    }
    
    public set Hp(v : number) {
        this.hp = v;
        if(v <=0)
        {
            let event = new cc.Event.EventCustom(EntityEvent.ENTITIY_DIE, false);
            event.detail =this.id;
            cc.systemEvent.dispatchEvent(event);
        }
        else
        {
            let event = new cc.Event.EventCustom(EntityEvent.ENTITY_UPDATE_HP, false);
            event.detail = v;
            cc.systemEvent.dispatchEvent(event);
        }
    }
    
    public get Hp() : number {
        return this.hp;
    }

    public getModel():string
    {
        return "";
    }

    private  UUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now(); 
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}