import Entity from "./Entity";
import PlayerVO from "./PlayerVO";
import EntityVO from "./EntityVO";

export default class Player extends Entity {
    public constructor() {
        super();
    }

    public getVO():EntityVO
    {
        return this.vo as PlayerVO;
    }
}