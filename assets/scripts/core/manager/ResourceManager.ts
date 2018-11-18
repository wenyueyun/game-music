export default class ResourceManager {
    private static instance: ResourceManager = null;
    public static getInstance(): ResourceManager {
        if (ResourceManager.instance == null) {
            ResourceManager.instance = new ResourceManager();
        }
        return ResourceManager.instance;
    }

    public loadRes(path: string, complete: Function): void {
        var res = this.getRes(path);
        if(res)
        {
            cc.log("资源已加载---------》"+path);
            complete(res);
            return;
        }
        cc.loader.loadRes(path,(err, prefab) => {
                if (err) {
                    cc.error(err.message || err);
                }
                else {
                    cc.log("加载到的资源: ------------>" + prefab.name);
                    complete(prefab);
                }
            })
    }


    public loadResArray(paths: string[], complete: Function,progress:Function=null) {
        cc.loader.loadResArray(paths,
            (completedCount, totalCount, item) => {
                if (progress) {
                    cc.log("加载进度------>completedCount:"+completedCount+"    totalCount:"+totalCount);
                    progress((completedCount / totalCount).toFixed(2));
                }
            },
            (err, assets) => {
                if (err) {
                    cc.error(err.message || err);
                }
                else {
                    for (let index = 0; index < assets.length; index++) {
                        const element = assets[index];
                        cc.log("加载到的资源: ------------>" + element.name);
                    }
                    complete(assets);
                }
            })
    }

    public loadResDir(dir: string, complete: Function,progress:Function=null) {
        cc.loader.loadResDir(dir,
            (completedCount, totalCount, item) => {
                if (progress) {
                    cc.log("加载进度------>completedCount:"+completedCount+"    totalCount:"+totalCount);
                    progress((completedCount / totalCount).toFixed(2));
                }
            },
            (err, objects, urls) => {
                if (err) {
                    cc.error(err.message || err);
                }
                else {
                    for (let index = 0; index < urls.length; index++) {
                        const element = urls[index];
                        cc.log("加载到的资源: ------------>" + element);
                    }
                    for (let index = 0; index < objects.length; index++) {
                        const element = objects[index];
                    }
                    complete(objects);
                }
            })
    }

    public getRes(path: string): any {
        return cc.loader.getRes(path);
    }


    public releaseRes(asset: any) {
        var all = cc.loader.getDependsRecursively(asset);
        cc.loader.release(all);
    }

    public releaseAllRes(asset: any[]) {
        for (let index = 0; index < asset.length; index++) {
            this.releaseRes(asset[index]);
        }
    }
}