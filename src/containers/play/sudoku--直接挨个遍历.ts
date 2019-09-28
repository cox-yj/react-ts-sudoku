import { randomItem, randomItems, shuffle } from '../../utils/utils'


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
    sudokuArr: SudokuItem[][] // 数独生成
    difficulty: number; // 设置难度 1-8  每一行遮盖多少个
    count: number // 数独生成成功所需次数
    constructor(difficulty) {
        this.count = 0
        this.difficulty = difficulty;
        
        // const sudoKuArr: SudokuItem[][] = 
        let sudokuArr = this.createSudoku(this.initSudoku());
        this.sudokuArr = this.itemEmpty(difficulty, sudokuArr)
    }

    // 初始数组
    initSudoku() {
        const sudokuArr: SudokuItem[][] = [];
        // const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        // 清空数据
        for (let i = 0; 9 > i; i++) {
            sudokuArr[i] = [];
            for (let j = 0; 9 > j; j++) {
                sudokuArr[i][j] = new SudokuItem(0, i, j)
            }
        }
        [0, 4, 8].forEach(block => {
            const numArr = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
            const blockArr = this.getBlockArr(sudokuArr, block)
            for (let i = 0; 9 > i; i++) {
                blockArr[i].num = numArr[i];

            }
        })

        return sudokuArr
    }

    // 初始化数独  新的思路 分块生成 这样可以考虑的元素就会多一点  之前按行考虑
    createSudoku = (sudokuArr): SudokuItem[][] => {
        this.count = this.count + 1;
        const sudokuArr1 = JSON.parse(JSON.stringify(sudokuArr));

        for (let i = 0; 9 > i; i++) {
            for (let j = 0; 9 > j; j++) {
                const item = sudokuArr1[i][j];
                if(item.num) continue
                const tempArr = this.effectiveAnswers(sudokuArr1, item)
                const itemNum = randomItem(tempArr)
                if (!itemNum) return this.createSudoku(sudokuArr);
                item.num = itemNum
            }
        }
        return sudokuArr1;
        // return sudokuArr;
    }

    // 初始化块
    createSudokuBlock(block, sudokuArr) {
        console.error('block===>', block);
        const sudokuArr1 = JSON.parse(JSON.stringify(sudokuArr));
        let blockArr = this.getBlockArr(sudokuArr, block);

        for (let i = 0; 9 > i; i++) {
            const item = blockArr[i]
            const tempArr = this.effectiveAnswers(sudokuArr1, item)
            if (!tempArr.length) {
                debugger
                return this.createSudokuBlock(block, sudokuArr)
            };
            const itemNum = randomItem(tempArr)
            sudokuArr1[item.row][item.columns].num = itemNum
            // item.num = itemNum
        }
        return sudokuArr1
    }

    // 设置空格 
    itemEmpty(difficulty, sudokuArr) {
        const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        sudokuArr = JSON.parse(JSON.stringify(sudokuArr))
        sudokuArr.forEach(row => {
            randomItems(arr, difficulty).forEach(item => {
                row[item] = {
                    ...row[item],
                    num: 0,
                    isChange: true
                }
            })
        })
        return sudokuArr;
    }

    // 写入空格
    setItem(item, num) {
        // item.num = num; // 之所以不这样写是因为太脏
        const { row, columns } = item;
        this.sudokuArr[row][columns].num = num;
        this.sudokuArr[row][columns].isChange = false;
    }

    // 获取块中每一个元素
    getBlockArr(sudokuArr: SudokuItem[][], block: number): SudokuItem[] {
        const row = Math.floor(block / 3) * 3
        const columns = (block % 3) * 3;
        const tempArr: SudokuItem[] = []
        for (let i = 0; 3 > i; i++) {
            for (let j = 0; 3 > j; j++) {
                tempArr.push(sudokuArr[row + i][columns + j])
            }
        }
        return tempArr;
    }

    getColumnsArr(sudokuArr: SudokuItem[][], columns: number) {
        return sudokuArr.map(item => item[columns])
    }

    // 获取当前元素的所有有效解
    effectiveAnswers(sudokuArr: SudokuItem[][], { row, columns, block }: { row: number, columns: number, block: number }): number[] {
        // sudokuArr = JSON.parse(JSON.stringify(sudokuArr))
        let all = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const rowStr: number[] = sudokuArr[row].map((item: any) => item.num)

        const columnsStr: number[] = this.getColumnsArr(sudokuArr, columns).map((item: any) => item.num)

        const blockStr: number[] = this.getBlockArr(sudokuArr, block).map((item: any) => item.num)

        const arr = [...rowStr, ...columnsStr, ...blockStr].filter(item => item)

        all = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(item => arr.indexOf(item) === -1)
        console.error(all)
        return all
    }



}

interface IStep {
    text: number
    row: number
    columns: number
    valid: boolean
}

export class SudokuGame extends Sudoku {
    sudokuArrTemp: SudokuItem[][]; // 存储数组初始数据
    stepsArr: IStep[] // 操作收集栈
    constructor(difficulty) {
        super(difficulty);
        this.sudokuArrTemp = JSON.parse(JSON.stringify(this.sudokuArr))
        this.stepsArr = [];
        this.itemEmpty(this.difficulty, this.sudokuArr);
    }

    // 从头开始
    againGame() {
        this.sudokuArr = this.sudokuArrTemp;
    }

    // 开始游戏
    startGame() {
        let sudokuArr = this.createSudoku(this.initSudoku());
        sudokuArr = this.itemEmpty(this.difficulty, sudokuArr);
        this.sudokuArr = sudokuArr;
        this.sudokuArrTemp = JSON.parse(JSON.stringify(this.sudokuArr));
    }

    // 写入
    writeItem(item: SudokuItem, num: number) {
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
        for (let len = this.stepsArr.length, i = 0; len > i; i++) {
            const step = this.stepsArr[i];
            if (!step.valid) {
                const { row, columns, text } = step;
                this.sudokuArr[row][columns].num = text;
                this.sudokuArr[row][columns].isChange = false;
                step.valid = true
                return
            }
        }
    }

    // 上一步
    prevStep() {
        // 从有效的步里取最后一个
        const step = this.stepsArr.filter(step => step.valid).pop()
        if (!step) return
        const { row, columns } = step;
        this.sudokuArr[row][columns].num = 0;
        this.sudokuArr[row][columns].isChange = true;
        step.valid = false
    }

}




export default SudokuGame;