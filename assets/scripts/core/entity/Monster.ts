import Entity from "./Entity";
import EntityVO from "./EntityVO";
import MonsterVO from "./MonsterVO";

export default class Monster extends Entity {
    public constructor() {
        super();
    }

    public getVO():EntityVO
    {
        return this.vo as MonsterVO;
    }
}