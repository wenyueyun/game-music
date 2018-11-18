import NoteConfig from "./NoteConfig";

export default class TrackConfig
{
    public name:string;

    public notes:Array<NoteConfig>;

    public constructor()
    {
        this.notes = new Array<NoteConfig>();
    }

    public addNote(note:NoteConfig)
    {
        this.notes.push(note);
    }

    public getNote()
    {
        //获取第一个元素
        this.notes.shift();
    }
}