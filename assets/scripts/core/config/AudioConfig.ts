import TrackConfig from "./TrackConfig";
import NoteConfig from "./NoteConfig";

export default class AudioConfig
{
    public name:string;

    public audioName:string;

    public sampleRate:number;

    public bpm:number;

    public tracks:Array<TrackConfig> = new Array<TrackConfig>();

    public constructor(element:any)
    {
        this.name = element.Name;
        this.audioName = element.SourceClipName;
        this.sampleRate = element.SampleRate;
        this.bpm = element.BPM;

        let ts = element.Tracks;
        for (let index = 0; index < ts.length; index++) {

            let t = ts[index];
            let track: TrackConfig = new TrackConfig();
            track.name = t.Name;

            let notes = t.Notes;
            for (let j = 0; j < notes.length; j++) {
                let noteJson = notes[j];
                let note: NoteConfig = new NoteConfig();
                note.type = noteJson.Type;
                note.val = noteJson.Val;
                note.startTime = noteJson.StartTime;
                note.endTime = noteJson.EndTime;
                track.addNote(note);
            }
            this.tracks.push(track);
        }
    }

    public getTrack(index:number):TrackConfig
    {
        if(this.tracks != null && this.tracks.length > index)
        {
            return this.tracks[index];
        }
    }
}
