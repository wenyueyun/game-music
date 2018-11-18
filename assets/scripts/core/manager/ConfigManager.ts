import MusicConfig from "../config/AudioConfig";
import LevelConfig from "../config/LevelConfig";
import TrackConfig from "../config/TrackConfig";
import NoteConfig from "../config/NoteConfig";
import MonsterConfig from "../config/MonsterConfig";
import AudioConfig from "../config/AudioConfig";
import ResourceManager from "./ResourceManager";

export default class ConfigManager {
    private static instance: ConfigManager = null;
    public static getInstance(): ConfigManager {
        if (ConfigManager.instance == null) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    private musicArr: Array<AudioConfig>;
    private levelArr: Array<LevelConfig>;
    private monsterArr: Array<MonsterConfig>;


    public constructor() {
        this.levelArr = new Array<LevelConfig>();
        this.musicArr = new Array<AudioConfig>();
        this.monsterArr = new Array<MonsterConfig>();
    }

    //加载配置表
    // public loadConfig(loadComplete:Function): void {
        // cc.loader.loadResDir('json', 
        // (completedCount, totalCount, item) => {
        //     // cc.log("load---------->completedCount: %s   totalCount: %s    item: %s", completedCount, totalCount, item.name);
        //     progress(completedCount,totalCount);
        // },
        // (err, objects, urls) => {
        //     for (let index = 0; index < objects.length; index++) {
        //         this.readJson(objects[index]);
        //     }
           
        // });

        // ResourceManager.getInstance().loadResDir('json',(objects: any[])=>
        // {
        //     for (let index = 0; index < objects.length; index++) {
        //         this.readJson(objects[index]);
        //     }

        //     if(loadComplete)
        //     {
        //         loadComplete();
        //     }
        // },true);
    // }

    public loadConfig(resource:any[])
    {
        for (let index = 0; index < resource.length; index++) {
            const element = resource[index];
            if(element instanceof cc.JsonAsset)
            {
                this.readJson(element);
            }
        }
    }

    //解析配置表
    private readJson(object: any) {
        cc.log("解析配置表------------>"+object.name);
        if (object.name.includes("Level")) {
            this.readLevel(object.json);
        }
        else if (object.name.includes("Monster")) {
             this.readMonster(object.json);
        }
        else if (object.name.includes("Audio")) {
            this.readMusic(object.json);
        }
    }

    //解析关卡json配置表
    private readLevel(json: any) {
        var levels = json.Level;
        for (let index = 0; index < levels.length; index++) {
            const element = levels[index];
            this.levelArr.push(new LevelConfig(element));
        }
    }

    //解析怪物json配置表
    private readMonster(json: any) {
        var monsters = json.Monster;
        for (let index = 0; index < monsters.length; index++) {
            const element = monsters[index];
            this.monsterArr.push(new MonsterConfig(element));
        }
    }

    //解析音乐json配置表
    private readMusic(json: any) {
        this.musicArr.push(new AudioConfig(json));
    }

    //根据名字获取音乐配置
    public getMusic(musicName: string): MusicConfig {
        for (let index = 0; index < this.musicArr.length; index++) {
            var music: MusicConfig = this.musicArr[index];
            if (music.name == musicName) {
                return  JSON.parse(JSON.stringify(music));;
            }
        }
        return null;
    }

    //根据id获取关卡配置
    public getLevel(levelID: number): LevelConfig {
        for (let index = 0; index < this.levelArr.length; index++) {
            var level: LevelConfig = this.levelArr[index];
            if (level.id == levelID) {
                return JSON.parse(JSON.stringify(level));
            }
        }
        return null;
    }

     //根据id获取怪物配置
     public getMonster(monID: number): LevelConfig {
        for (let index = 0; index < this.monsterArr.length; index++) {
            var mon: MonsterConfig = this.monsterArr[index];
            if (mon.id == monID) {
                return JSON.parse(JSON.stringify(mon));
            }
        }
        return null;
    }
}