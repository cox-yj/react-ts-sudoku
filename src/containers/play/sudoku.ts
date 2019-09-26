import { randomItem } from '../../utils/utils'


class SudokuItem {
    num: number;
    row: number;
    columns: number;
    block: number;
    id: string;
    isChange: boolean;
    constructor(num: number, row: number, columns: number, isChange = false) {
        this.id = `${row}_${columns}`
        this.num = num;
        this.row = row;
        this.columns = columns;
        this.block = this.getBlockKey(row, columns);
        this.isChange = isChange;
    }

    getBlockKey(row: number, columns: number): number {
        return Math.floor(columns / 3) + Math.floor(row / 3) * 3
    }
}

class Sudoku {
    sudoKuArr: SudokuItem[][] // 数独生成
    difficulty: number; // 设置难度
    count: number // 数独生成成功所需次数
    constructor(difficulty) {
        this.count = 0
        this.difficulty = difficulty;
        let sudoKuArr = this.initSudoku()
        this.sudoKuArr = this.itemEmpty(difficulty, sudoKuArr)
    }

    // 初始化数独
    initSudoku = (): SudokuItem[][] => {

        this.count = this.count + 1;
        const sudoKuArr: SudokuItem[][] = [];

        // 清空数据
        for (let i = 0; 9 > i; i++) {
            sudoKuArr[i] = [];
            for (let j = 0; 9 > j; j++) {
                sudoKuArr[i][j] = new SudokuItem(0, i, j)
            }
        }

        for (let i = 0; 9 > i; i++) {
            for (let j = 0; 9 > j; j++) {
                const item = sudoKuArr[i][j];
                const tempArr = this.effectiveAnswers(sudoKuArr, item)
                const itemNum = randomItem(tempArr)
                if (!itemNum) return this.initSudoku();
                item.num = itemNum
            }
        }
        return sudoKuArr;
    }

    // 设置空格
    itemEmpty(difficulty, sudoKuArr) {
        const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        for (let i = 0; difficulty > i; i++) {
            const row = randomItem(arr);
            const columns = randomItem(arr);
            sudoKuArr[row][columns].num = 0
            sudoKuArr[row][columns].isChange = true
        }
        return sudoKuArr;
    }

    // 写入空格
    setItem(item, num) {
        // item.num = num; // 之所以不这样写是因为太脏
        const {row, columns} = item;
        this.sudoKuArr[row][columns].num = num;
        this.sudoKuArr[row][columns].isChange = false;
    }

    // 获取块中每一个元素
    getBlockArr(sudoKuArr: SudokuItem[][], block: number): SudokuItem[] {
        const row = Math.floor(block / 3) * 3
        const columns = (block % 3) * 3;
        const tempArr: SudokuItem[] = []
        for (let i = 0; 3 > i; i++) {
            for (let j = 0; 3 > j; j++) {
                tempArr.push(sudoKuArr[row + i][columns + j])
            }
        }
        return tempArr;
    }

    // 获取当前元素的所有有效解
    effectiveAnswers(sudoKuArr: SudokuItem[][], { row, columns, block }: { row: number, columns: number, block: number }) {
        let allStr = '123456789';
        const rowStr: number[] = sudoKuArr[row].map((item: any) => item.num)

        const columnsStr: number[] = sudoKuArr.filter((item: { [x: string]: any; }) => item[columns]).map((item: any) => item.num)

        const blockStr: number[] = this.getBlockArr(sudoKuArr, block).map((item: any) => item.num)

        const arr = [...rowStr, ...columnsStr, ...blockStr]

        arr.forEach(item => {
            allStr = allStr.replace(item + '', '')
        });

        const temp = allStr.split('').map(item => +item);
        return temp
    }



}

interface IStep{
    text: number
    row: number
    columns: number
    valid: boolean
}

export class SudokuGame extends Sudoku {
    sudoKuArrTemp: SudokuItem[][]; // 存储数组初始数据
    stepsArr: IStep[] // 操作收集栈
    constructor(difficulty) {
        super(difficulty);
        this.sudoKuArrTemp = JSON.parse(JSON.stringify(this.sudoKuArr))
        this.stepsArr = [];
    }

    // 从头开始
    againGame() {
        this.sudoKuArr = this.sudoKuArrTemp;
    }

    // 开始游戏
    startGame() {
        let sudoKuArr = this.initSudoku();
        sudoKuArr = this.itemEmpty(this.difficulty, sudoKuArr);
        this.sudoKuArr = sudoKuArr;
        this.sudoKuArrTemp = JSON.parse(JSON.stringify(this.sudoKuArr));
    }

    // 写入
    writeItem(item: SudokuItem, num: number){
        this.setItem(item, num);
        const step = {
            text: num,
            row: item.row,
            columns: item.columns,
            valid: true
        }
        this.stepsArr = this.stepsArr.filter(step => step.valid)
        this.stepsArr.push(step)
    }

    // 下一步
    nextStep() {
        for(let len = this.stepsArr.length, i = 0; len > i; i++) {
            const step = this.stepsArr[i];
            if(!step.valid) {
                const {row, columns, text} = step;
                this.sudoKuArr[row][columns].num = text;
                this.sudoKuArr[row][columns].isChange = false;
                step.valid = true
                return
            }
        }
    }

    // 上一步
    prevStep(){
        // 从有效的步里取最后一个
        const step = this.stepsArr.filter(step => step.valid).pop()
        if(!step) return
        const {row, columns} = step;
        this.sudoKuArr[row][columns].num = 0;
        this.sudoKuArr[row][columns].isChange = true;
        step.valid = false
    }

}




export default SudokuGame;