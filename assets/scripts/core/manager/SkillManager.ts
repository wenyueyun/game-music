import Entity from "../entity/Entity";

export default class SkillManager {
    private static instance: SkillManager = null;
    public static getInstance(): SkillManager {
        if (SkillManager.instance == null) {
            SkillManager.instance = new SkillManager();
        }
        return SkillManager.instance;
    }

    public analyze(source:Entity,target:Entity):boolean
    {   
        return false;
    }
}