import EntityVO from "./EntityVO";
import PlayerConfig from "../config/PlayerConfig";
import PathConst from "../const/PathConst";
import ConfigManager from "../manager/ConfigManager";

export default class PlayerVO extends EntityVO
{
    private config:PlayerConfig;

    public constructor(pID:number)
    {
        super();
        this.bid = pID;
        this.config = ConfigManager.getInstance().getPlayer(pID);
    }

    public getModel():string
    {
        return PathConst.PLAYER + this.config.model;
    }
}