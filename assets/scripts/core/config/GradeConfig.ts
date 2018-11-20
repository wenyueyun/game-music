export default class GradeConfig
{
    public id:number;

    public dis:number;

    public score:number;

    public constructor(element:any)
    {
        this.id = <number> element.id;
        this.dis = <number>element.dis;
        this.score = <number>element.score;
    }
}