import Proxy from "../../mvc/patterns/proxy/Proxy";
import IProxy from "../../mvc/interfaces/IProxy";
import BattleVO from "./BattleVO";

export default class BattleProxy extends Proxy implements IProxy {
    public static NAME: string = "BattleProxy";
    
    public vo:BattleVO;

    public constructor() {
        super(BattleProxy.NAME);
    }

    public getData(): BattleVO {
        return this.vo;
    }

    public initVo()
    {
        this.vo = new BattleVO();
    }
}