export default class SkillConfig
{
    public id:number;

    public type:number;

    public value:number;

    public time:number;

    public desc:string

    public constructor(element:any)
    {
        this.id = <number> element.id;
        this.type = <number>element.type;
        this.value = <number>element.value;
        this.time = <number>element.time;
        this.desc = element.desc;
    }
}