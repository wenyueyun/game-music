import MusicConfig from "../config/AudioConfig";
import LevelConfig from "../config/LevelConfig";
import MonsterConfig from "../config/MonsterConfig";
import AudioConfig from "../config/AudioConfig";
import SkillConfig from "../config/SkillConfig";
import PlayerConfig from "../config/PlayerConfig";
import GradeConfig from "../config/GradeConfig";

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
    private skillArr: Array<SkillConfig>;
    private playerArr: Array<PlayerConfig>;
    private gradeArr: Array<GradeConfig>;


    public constructor() {
        this.levelArr = new Array<LevelConfig>();
        this.musicArr = new Array<AudioConfig>();
        this.monsterArr = new Array<MonsterConfig>();
        this.skillArr = new Array<SkillConfig>();
        this.playerArr = new Array<PlayerConfig>();
        this.gradeArr = new Array<GradeConfig>();
    }

    public loadConfig(resource: any[]) {
        for (let index = 0; index < resource.length; index++) {
            const element = resource[index];
            if (element instanceof cc.JsonAsset) {
                this.readJson(element);
            }
        }
    }

    //解析配置表
    private readJson(object: any) {
        cc.log("解析配置表------------>" + object.name);
        if (object.name.includes("Level")) {
            this.readLevel(object.json);
        }
        else if (object.name.includes("Player")) {
            this.readPlayer(object.json);
        }
        else if (object.name.includes("Monster")) {
            this.readMonster(object.json);
        }
        else if (object.name.includes("Skill")) {
            this.readSkill(object.json);
        }
        else if (object.name.includes("Grade")) {
            this.readGrade(object.json);
        }
        else if (object.name.includes("Audio")) {
            this.readMusic(object.json);
        }
    }

    //读取攻击区间配置
    private readGrade(json: any) {
        var grades = json.Grade;
        for (let index = 0; index < grades.length; index++) {
            const element = grades[index];
            this.gradeArr.push(new GradeConfig(element));
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

    //解析角色json配置表
    private readPlayer(json: any) {
        var players = json.Player;
        for (let index = 0; index < players.length; index++) {
            const element = players[index];
            this.playerArr.push(new PlayerConfig(element));
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

    //解析怪技能son配置表
    private readSkill(json: any) {
        var skills = json.Skill;
        for (let index = 0; index < skills.length; index++) {
            const element = skills[index];
            this.skillArr.push(new SkillConfig(element));
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
                return JSON.parse(JSON.stringify(music));;
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
    public getMonster(monID: number): MonsterConfig {
        for (let index = 0; index < this.monsterArr.length; index++) {
            var mon: MonsterConfig = this.monsterArr[index];
            if (mon.id == monID) {
                return JSON.parse(JSON.stringify(mon));
            }
        }
        return null;
    }

    //根据id获取角色配置
    public getPlayer(pID: number): PlayerConfig {
        for (let index = 0; index < this.playerArr.length; index++) {
            var player: PlayerConfig = this.playerArr[index];
            if (player.id == pID) {
                return JSON.parse(JSON.stringify(player));
            }
        }
        return null;
    }

    //根据id获取技能配置
    public getSkill(sID: number): SkillConfig {
        for (let index = 0; index < this.skillArr.length; index++) {
            var skill: SkillConfig = this.skillArr[index];
            if (skill.id == sID) {
                return JSON.parse(JSON.stringify(skill));
            }
        }
        return null;
    }

    public getGrade(dis: number): number {
        var grade: GradeConfig = null;
        for (let index = 0; index < this.gradeArr.length; index++) {
            const element = this.gradeArr[index];
            if (element.dis >= dis) {
                if (grade == null) {
                    grade = element;
                }
                else if (grade.dis > element.dis) {
                    grade = element;
                }
            }
        }

        if(grade != null)
        {
            return grade.score;
        }
        return 0;
    }
}