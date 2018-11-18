export default class PoolManager {
    private static instance: PoolManager = null;
    public static getInstance(): PoolManager {
        if (PoolManager.instance == null) {
            PoolManager.instance = new PoolManager();
        }
        return PoolManager.instance;
    }

    public static NOTE_POOL:string = "note_pool";
    
    private poolMap: { [key: string]: cc.NodePool };
    private poolNode: { [key: string]: cc.Node };

    public constructor() {
        this.poolMap = {};
        this.poolNode = {};
    }


    public createPool(poolName: string, node: cc.Node): cc.NodePool {
        var pool = new cc.NodePool();
        this.poolMap[poolName] = pool;
        this.poolNode[poolName] = node;
        return pool;
    }

    public putNode(poolName: string, node: cc.Node) {
        var pool = this.poolMap[poolName];
        if (pool != null) {
            pool.put(node);
        }
    }

    public getNode(poolName: string): cc.Node {
        var pool = this.poolMap[poolName];
        if (pool != null) {
            if (pool.size() > 0) {
                return pool.get();
            }
            else {
                var node = this.poolNode[poolName];
                if (node != null) {
                    return cc.instantiate(node);
                }
            }
        }
        return null;
    }


    public deletePool(poolName: string) {
        delete this.poolMap[poolName];
    }
}