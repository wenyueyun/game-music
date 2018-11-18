import EntityVO from "./EntityVO";
import PathConst from "../const/PathConst";
import MonsterConfig from "../config/MonsterConfig";
import ConfigManager from "../manager/ConfigManager";

export default class MonsterVO extends EntityVO
{
    public config:MonsterConfig;

    public constructor(mID:number)
    {
        super();
        this.bid = mID;
        this.config = ConfigManager.getInstance().getMonster(mID);
    }

    public getModel():string
    {
        return PathConst.PLAYER + this.config.model;
    }
}