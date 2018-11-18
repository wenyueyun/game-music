import Proxy from "../../mvc/patterns/proxy/Proxy";
import IProxy from "../../mvc/interfaces/IProxy";

export default class BattleProxy extends Proxy implements IProxy {
    public static NAME: string = "BattleProxy";

    public constructor() {
        super(BattleProxy.NAME);
    }

    public getData(): any {
        return null;
    }
}