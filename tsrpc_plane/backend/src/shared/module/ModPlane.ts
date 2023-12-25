/**
 * 飞机头玩法
 * 
 * 玩法：
 * 1.部署状态，玩家在各自的地图上部署飞机，
 * 2.攻击状态，玩家攻击对方的飞机头
 * 3.所有飞机头都被击破，这玩家失败，剩余最后一个玩家胜利
 * 
 * todo:
 * 记录所有的步骤
 */

/**
 * 方向
 */
type PlaneDirection = 'up' | 'left' | 'down' | 'right';
//type DirPlane = { [key in PlaneDirection]: number[][] };

/**
 * 不同方向上的飞机布局
 */
// const Plane: DirPlane = {
//     //上
//     "up": [
//         [0, 1, 0],
//         [1, 1, 1],
//         [0, 1, 0],
//         [1, 1, 1]
//     ],
//     //左
//     "left": [
//         [0, 1, 0, 1],
//         [1, 1, 1, 1],
//         [0, 1, 0, 1],
//     ],
//     //下
//     "down": [
//         [1, 1, 1],
//         [0, 1, 0],
//         [1, 1, 1],
//         [0, 1, 0],
//     ],
//     //右
//     "right": [
//         [1, 0, 1, 0],
//         [1, 1, 1, 1],
//         [1, 0, 1, 0]
//     ]
// }

const Plane:any = {}

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
    uid: string; //属于哪个玩家，空格子值为""
}

class GamePlane {
    map_x: number = 9;
    map_y: number = 9;
    uid2map: Map<string, Grid[][]>;
    uid2Heads: Map<string, Grid[]>;

    constructor() {
        this.uid2Heads = new Map<string, Grid[]>();
        this.uid2map = new Map<string, Grid[][]>();
    }

    /**
     * 初始化地图
     * @param uids 
     */
    initMap(uids: string[]) {
        uids.forEach((uid) => {
            this.uid2map.set(uid, Array(this.map_y).fill(null).map(() => Array(this.map_x).fill({ isturn: false, isdestroy: false, uid: "" })));
        })
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
    checkPut(map: Grid[][], dir: PlaneDirection, x: number, y: number) {
        if (!Plane.hasOwnProperty(dir)) {
            return false;
        }

        let modelplane = Plane[dir];
        let planeW = modelplane[0].length;
        let planeH = modelplane.length;
        let px = -1, py = -1;
        let max_y = y + planeH - 1;
        let max_x = x + planeW - 1;

        for (let my = y; my < max_y; my++) {
            py = py + 1;
            px = -1;

            for (let mx = x; mx < max_x; mx++) {
                px = px + 1;

                if (!this.isValidPos(mx, my)) {
                    return false;
                }

                if (map[my][mx].uid != "" && modelplane[py][px] == 1) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 
     */
    putPlane(uid: string, dir: PlaneDirection, x: number, y: number): boolean {
        let modelplane = Plane[dir];
        let planeW = modelplane[0].length;
        let planeH = modelplane.length;
        let map = this.uid2map.get(uid)!;

        if (!this.checkPut(map, dir, x, y)) {
            return false;
        }

        let max_y = y + planeH - 1;
        let max_x = x + planeW - 1;
        let px = 0, py = 0;
        let headGrid: Grid | undefined = undefined;
        let confHead = PlaneHead[dir];

        for (let my = y; my < max_y; my++) {
            py = py + 1;
            px = 0;
            for (let mx = x; mx < max_x; mx++) {
                px = px + 1;

                if (map[my][mx].uid == "") {
                    map[my][mx].uid = modelplane[py][px] == 1 ? uid : "";

                    if (confHead[0] == px && confHead[1] == py) {
                        headGrid = map[my][mx];
                    }
                }
            }
        }

        if (!headGrid) {
            return false;
        }

        return true;
    }

    /**
     * 
     * @param uid 
     * @param x 
     * @param y 
     * @returns 
     */
    turnGrid(uid: string, enemyUid: string, x: number, y: number) {
        if (!this.isValidPos(x, y)) {
            return false;
        }

        let map = this.uid2map.get(enemyUid)!;
        let curGrid = map[y][x];

        if (curGrid.uid == uid) {
            return false;
        }

        if (curGrid.isturn) {
            return false;
        }

        curGrid.isturn = true;

        if (curGrid.uid != "") {
            curGrid.isdestroy = true;
        }

        return true;
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
}


export { GamePlane }