export default class LevelConfig
{
    public id:number;

    public name:string;

    public music:string;

    public map:string;

    public constructor(element:any)
    {
        this.id = <number> element.id;
        this.name = element.name;
        this.music = element.music;
        this.map = element.map;
    }
}
