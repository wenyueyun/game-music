import Proxy from "../../mvc/patterns/proxy/Proxy";
import IProxy from "../../mvc/interfaces/IProxy";

export default class OverProxy extends Proxy implements IProxy {
    public static NAME: string = "OverProxy";

    public constructor() {
        super(OverProxy.NAME);
    }
}