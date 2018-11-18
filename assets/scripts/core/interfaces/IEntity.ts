import EntityVO from "../Entity/EntityVO";

export default interface IEntity
{
    getBid():number;

    getVO():EntityVO;
}