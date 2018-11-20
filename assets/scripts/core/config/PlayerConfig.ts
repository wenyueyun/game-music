export default class PlayerConfig
{
    public id:number;

    public name:string;

    public hp:number;

    public model:string

    public constructor(element:any)
    {
        this.id = <number> element.id;
        this.name = element.name;
        this.hp = <number>element.hp;
        this.model = element.model;
    }
}