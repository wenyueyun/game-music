import Proxy from "../../mvc/patterns/proxy/Proxy";
import IProxy from "../../mvc/interfaces/IProxy";

export default class LoadingProxy extends Proxy implements IProxy {
    public static NAME: string = "LoadingProxy";
    public constructor() {
        super(LoadingProxy.NAME);
    }
}
