import Proxy from "../../mvc/patterns/proxy/Proxy";
import IProxy from "../../mvc/interfaces/IProxy";
import RankVO from "./RankVO";
import RankConst from "./RankConst";

export default class RankProxy extends Proxy implements IProxy {
    public static NAME: string = "RankProxy";
    public rankData: Array<RankVO>;

    public constructor() {
        super(RankProxy.NAME);
    }

    public sendUpdate():void
    {
        this.sendNotification(RankConst.RANK_MODEL_UPDATE_DATA);
    }

    public sendBattle():void
    {

    }
}
