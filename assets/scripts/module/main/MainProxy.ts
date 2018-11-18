import Proxy from "../../mvc/patterns/proxy/Proxy";
import IProxy from "../../mvc/interfaces/IProxy";

export default class MainProxy extends Proxy implements IProxy {
    public static NAME: string = "MainProxy";

    public constructor() {
        super(MainProxy.NAME);
    }
}