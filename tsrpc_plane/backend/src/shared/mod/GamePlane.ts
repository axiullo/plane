/**
 * 飞机头玩法
 * 
 * 玩法：
 * 1.部署状态，玩家在各自的地图上部署飞机，
 * 2.攻击状态，当前玩家攻击对方地图上的飞机头
 * 3.玩家地图上所有飞机头都被击破，这玩家失败，剩余最后一个玩家胜利
 * 
 * todo:
 * 记录所有的步骤
 */
import { server } from "../..";
import { GameHelper } from "../helper/GameHelper";

/**
 * 方向
 */
export type PlaneDirection = 'up' | 'left' | 'down' | 'right';
//type DirPlane = { [key in PlaneDirection]: (number[][]) };

/**
 * 不同方向上的飞机布局
 */
const Plane: { [key in PlaneDirection]: (number[][]) } = {  //改成这样就可以编译过
    //const Plane: DirPlane = { //编译不过，不知道为什么。 因为框架暂时还不支持这种格式
    //上
    "up": [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
        [1, 1, 1]
    ],
    //左
    "left": [
        [0, 1, 0, 1],
        [1, 1, 1, 1],
        [0, 1, 0, 1],
    ],
    //下
    "down": [
        [1, 1, 1],
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
    ],
    //右
    "right": [
        [1, 0, 1, 0],
        [1, 1, 1, 1],
        [1, 0, 1, 0]
    ]
}

/**
 * 不同方向上的飞机头位置
 */
const PlaneHead = {
    "up": [0, 1],
    "left": [1, 0],
    "down": [3, 1],
    "right": [1, 3]
}

export interface Grid {
    isturn: boolean; //是否被翻
    isdestroy: boolean; //是否被摧毁
    uid: string; //攻击的玩家id，空格子值为""
    planeid: number; //飞机的序号
    ishead: boolean; //是否是飞机头
}

//游戏状态
enum GameState {
    Put, //部署
    Atk, //攻击
    End, //结束
}

//玩家游戏状态
enum PlayerGameState {
    Put,
    PutFinish,
    Atk,
    AtkFinish,
    Dead,
}

class GamePlane {
    readonly map_x: number = 9; //地图的宽
    readonly map_y: number = 9; //地图的高
    readonly max_plane: number = 1; //部署的最大飞机数

    state: GameState = GameState.Put;
    uid2map: Map<string, Grid[][]>;
    uid2PlaneId: Map<string, number>; //当前部署的飞机序号
    uid2BeDestroyed: Map<string, number> = new Map<string, number>(); //玩家被摧毁的次数
    uid2PlayerState: Map<string, PlayerGameState> = new Map<string, PlayerGameState>(); //玩家游戏状态
    uidorder: string[] = []; //玩家顺序，如果玩家死亡，将其从队列中删除
    curAtkUidIndex: number = 0; //攻击时，当前执行的玩家的索引

    constructor() {
        this.uid2map = new Map<string, Grid[][]>(); //一维y 二维x
        this.uid2PlaneId = new Map<string, number>();
        //todo 再来个showmap 
    }

    /**
     * 
     * @returns 
     */
    getGameData() {
        let ret = {
            state: this.state,
            uid2map: GameHelper.funcMapToObjectStr(this.uid2map),
            uid2PlayerState: GameHelper.funcMapToObjectStr(this.uid2PlayerState),
            uidorder: this.uidorder,
            curAtkUidIndex: this.curAtkUidIndex,
        };
        return ret;
    }

    /**
     * 初始化
     * @param uids
     */
    init(uids: string[]) {
        this.state = GameState.Put;

        uids.forEach((uid) => {
            this.uid2map.set(uid, Array(this.map_y).fill(null).map(() => Array(this.map_x).fill({ isturn: false, isdestroy: false, uid: "", planeid: -1, ishead: false })));
            this.uid2PlaneId.set(uid, 1);
            this.uid2BeDestroyed.set(uid, 0);
            this.uid2PlayerState.set(uid, PlayerGameState.Put);
        });

        this.uidorder = [...uids];
        GameHelper.shuffleArray(this.uidorder);
    }

    /**
     * 是否是有效的位置
     * @param x
     * @param y
     * @returns
     */
    isValidPos(x: number, y: number): boolean {
        if (x < 0 || x > this.map_x - 1) {
            return false;
        }

        if (y < 0 || y > this.map_y - 1) {
            return false;
        }

        return true;
    }

    /**
     *
     * @param dir
     * @param x
     * @param y
     * @returns
     */
    checkPut(map: Grid[][], dir: keyof typeof Plane, x: number, y: number) {
        let modelplane = Plane[dir];
        let planeW = modelplane[0].length;
        let planeH = modelplane.length;
        let px = -1, py = -1;
        let max_y = y + planeH;
        let max_x = x + planeW;

        for (let my = y; my < max_y; my++) {
            py = py + 1;
            px = -1;

            for (let mx = x; mx < max_x; mx++) {
                px = px + 1;

                if (!this.isValidPos(mx, my)) {
                    return false;
                }

                if (modelplane[py][px] == 1 && map[my][mx].planeid > 0) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 
     * @param uid 
     * @param state 
     * @returns 
     */
    checkPlayerState(uid: string, state: PlayerGameState) {
        if (this.uid2PlayerState.get(uid) == state) {
            return true;
        }
        return false;
    }

    /**
     *  放置飞机, 放置位置以左上角为基准点。
     * @param uid 玩家id
     * @param dir 飞机方向
     * @param x 飞机左上角位置
     * @param y 飞机左上角位置
     * @returns 是否成功
     */
    putPlane(uid: string, dir: keyof typeof Plane, x: number, y: number): boolean {
        if (this.state != GameState.Put) {
            return false;
        }

        if (!this.checkPlayerState(uid, PlayerGameState.Put)) {
            return false;
        }

        let modelplane = Plane[dir];
        let planeW = modelplane[0].length;
        let planeH = modelplane.length;
        let map = this.uid2map.get(uid)!;

        if (!this.checkPut(map, dir, x, y)) {
            return false;
        }

        let curPlaneId = this.uid2PlaneId.get(uid);
        curPlaneId = curPlaneId!;
        let max_y = y + planeH;
        let max_x = x + planeW;
        let px = -1, py = -1;
        const confHead = PlaneHead[dir];

        for (let my = y; my < max_y; my++) {
            py = py + 1;
            px = -1;

            for (let mx = x; mx < max_x; mx++) {
                px = px + 1;

                if (map[my][mx].planeid <= 0) {
                    map[my][mx].planeid = modelplane[py][px] == 1 ? curPlaneId : 0;

                    if (confHead[0] == px && confHead[1] == py) {
                        map[my][mx].ishead = true;
                    }
                }
            }
        }

        this.uid2PlaneId.set(uid, curPlaneId + 1);

        if (curPlaneId == this.max_plane) {
            this.uid2PlayerState.set(uid, PlayerGameState.PutFinish);
        }

        this.GameNext();

        return true;
    }

    /**
     * 游戏是否进行下一步,改变当前的游戏状态
     */
    GameNext() {
        switch (this.state) {
            case GameState.Put:
                let isFinish = true;
                let values = this.uid2PlayerState.values();

                for (let an of values) {
                    if (an != PlayerGameState.PutFinish) {
                        isFinish = false;
                        break;
                    }
                }

                if (isFinish) {
                    this.state = GameState.Atk;
                    this.curAtkUidIndex = 0;
                }

                break;
            case GameState.Atk:
                if (this.uidorder.length <= 1) {
                    this.state = GameState.End;
                }
                break;
            default:
                server.logger.error("Invalid state: " + this.state);
                break;
        }
    }

    /**
     * 翻格子
     * @param uid
     * @param x
     * @param y
     * @returns
     */
    turnGrid(uid: string, enemyUid: string, x: number, y: number) {
        let curUid = this.uidorder[this.curAtkUidIndex];

        if (curUid != uid) {
            return false;
        }

        if (!this.isValidPos(x, y)) {
            return false;
        }

        let map = this.uid2map.get(enemyUid)!;
        let curGrid = map[y][x];

        if (curGrid.isturn) {
            return false;
        }

        curGrid.isturn = true;
        curGrid.uid = uid;

        if (curGrid.planeid > 0) {
            curGrid.isdestroy = true;

            if (curGrid.ishead) {
                let curDestroyNum = this.uid2BeDestroyed.get(enemyUid)!;
                this.uid2BeDestroyed.set(uid, curDestroyNum + 1);
                this.uidorder = this.uidorder.filter(an => an != uid);

                if (this.uidorder.length <= 1) {
                    this.GameNext();
                    return true;
                }

                this.curAtkUidIndex = this.uidorder.indexOf(uid);
            }
        }

        this.curAtkUidIndex = (this.curAtkUidIndex + 1) % this.uidorder.length;

        return true;
    }

    /**
     * 是否全部摧毁
     * @param uid
     * @returns
     */
    allDestroyByUid(uid: string): boolean {
        let curDestroyNum = this.uid2BeDestroyed.get(uid)!;

        if (curDestroyNum >= this.max_plane) {
            return true;
        }

        return false;
    }

    printMap() {
        for (let [uid, map] of this.uid2map) {
            console.log(`${uid} map:\n`);

            for (let y = 0; y < map.length; y++) {
                let line = '';
                for (let x = 0; x < map[y].length; x++) {
                    if (line.length > 0) {
                        line += ',';
                    }

                    line += map[y][x];
                }

                console.log(line);
            }
        }
    }

    doOperation(operation: string, arags: any) {
        let result = true;

        switch (operation) {
            case "put":
                result = this.putPlane(arags.uid, arags.dir, arags.x, arags.y);
            case "turn":
                result = this.turnGrid(arags.uid, arags.dir, arags.x, arags.y);
                break;
                default:
                    server.logger.error("error operation " + operation);
                    break;
        }

        return result;
    }
}

export { GamePlane }