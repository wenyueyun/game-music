import Proxy from "../../mvc/patterns/proxy/Proxy";
import IProxy from "../../mvc/interfaces/IProxy";
import LevelConst from "./LevelConst";
import LevelVO from "./LevelVO";

export default class LevelProxy extends Proxy implements IProxy {

    public static NAME: string = "LevelProxy";

    public levelData: Array<LevelVO>;

    public constructor() {
        super(LevelProxy.NAME);
    }

    //当前选择的关卡
    private curLev: number = 1;

    public get CurLev() {
        return this.curLev;
    }


    public set CurLev(lev: number) {
        if (this.curLev != lev) {
            this.curLev = lev;
            this.sendNotification(LevelConst.LEVEL_MODEL_UPDATE_LEVEL, this.curLev);
        }
    }


    public sendBattle(): void {

    }

    public sendUpdate(): void {
        this.sendNotification(LevelConst.LEVEL_MODEL_UPDATE_DATA);
    }
}
