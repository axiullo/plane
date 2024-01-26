//
class IdCreator {
    baseId: number = 1000;
    timeBase: number = Date.UTC(2000, 1, 1, 0, 0, 59);
    timeStart: number = Date.now() - this.timeBase;
    serverId: number = 10001; //服务器id
    uidPre: string = "";

    chars: string[] = [
        'A', 'B', 'C', 'D', 'E',
        'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z',
    ];

    numbers: number[] = [
        1, 2, 3, 4, 5,
        6, 7, 8, 9, 10,
        11, 12, 13, 14, 15,
        16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26
    ];

    constructor(serverId: number = 10001) {
        this.serverId = serverId;
        this.uidPre = this.getPre(this.serverId);
    }

    getUid(serverId?: number): string {
        var curId = this.baseId;
        this.baseId += 1;

        if (serverId) {
            return this.getPre(serverId) + this.numberToChar(curId);
        }

        return this.uidPre + this.numberToChar(curId);
    }

    private getPre(serverId: number) {
        return this.numberToChar(this.timeStart) + "-" + this.numberToChar(serverId) + "-" + this.numberToChar(100 + serverId) + "-";
    }

    private numberToChar(n: number): string {
        var retStr: string = "";

        while (n > 0) {
            var m = n % 26;
            retStr = this.chars[m] + retStr;
            n = (n - m) / 26;
        }

        return retStr;
    }
}

export var IdCreatorIns = new IdCreator();