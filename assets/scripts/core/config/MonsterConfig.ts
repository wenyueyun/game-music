export default class MonsterConfig
{
    public id:number;

    public type:number;

    public name:string;

    public skill:string;

    public model:string;

    public constructor(element:any)
    {
        this.id = <number> element.id;
        this.type = <number>element.type;
        this.name = element.name;
        this.skill = element.skill;
        this.model = element.model;
    }
}