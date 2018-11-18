export default class MonsterConfig
{
    public id:number;

    public name:string;

    public atk:number;

    public model:string;

    public constructor(element:any)
    {
        this.id = <number> element.id;
        this.name = element.name;
        this.atk = <number>element.music;
        this.model = element.model;
    }
}