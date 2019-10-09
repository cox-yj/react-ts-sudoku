import { randomItems, randomItemPlus } from '../../utils/utils'


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
    constructor() {
        this.count = 0
        this.sudokuArr = this.initSudoku();
    }

    // 初始数组
    initSudoku() {
        const sudokuArr: SudokuItem[][] = [];
        // 初始化item
        for (let i = 0; 9 > i; i++) {
            sudokuArr[i] = [];
            for (let j = 0; 9 > j; j++) {
                sudokuArr[i][j] = new SudokuItem(0, i, j)
            }
        }
        return sudokuArr
    }

    // 扁平化数组
    flatArr = []
    // 初始化数独  新的思路 分块生成 这样可以考虑的元素就会多一点  之前按行考虑
    createSudoku = (difficulty): Promise<SudokuItem[][]> => {
        return new Promise((resolve) => {
            const date = new Date().getTime();
            this.sudokuArr = [];
            this.flatArr = [];
            this.sudokuArr = this.initSudoku();
            this.sudokuArr.forEach(row => this.flatArr.push(...row))
            this.flatArr = this.flatArr.map((item, i) => ({ ...item, index: i, validArr: null }))
            this.ceateBack(this.flatArr[0])
            this.sudokuArr = this.itemEmpty(difficulty, this.sudokuArr)
            console.error(`初始化成功！ 用时：${(new Date().getTime() - date)} ms, ${this.count}`)
            this.count = 0;
            resolve()
        })
    }

    /**
     *  核心思路：(flatArr 有点双向链表的意思) 回溯，将二维数组打散 逐个找解 如果当前无解就去找上一个换个解， 如果上一个也没有解了 那就再还上一个
     * item1 -> item2 -> item3
     * item1 -> item2 <- item3  --如果从item3发现没有解，在回到item2换个解，然后再找到下一个item3找解
     * item1 -> item2 -> item3 -> item4
    */
    ceateBack(item) {
        this.count++
        try {
            // console.error(this.flatArr.map(item => item.num).filter(item => item).length)
            // 如果不是null 那就是从下一个找上来的
            if (item.validArr !== null) {
                return this.goBack(item)
            }
            return this.goNext(item)
        } catch (error) {
            console.error('出错了(ceateBack)==>', error)
        }
    }

    // 朝上找一个
    goBack(item) {
        const { index } = item;
        if (!item.validArr.length) {
            this.flatArr[index] = {
                ...this.flatArr[index],
                validArr: null,
                num: 0
            }
            this.sudokuArr[this.flatArr[index].row][this.flatArr[index].columns].num = 0
            return this.ceateBack(this.flatArr[index - 1])
        }
        const [validArr1, num] = randomItemPlus(item.validArr)
        // 如果当前元素 也是无解了 那么将它数据初始化 然后接着超上找
        if (!num) {
            this.flatArr[index] = {
                ...this.flatArr[index],
                validArr: null,
                num: 0
            }
            this.sudokuArr[this.flatArr[index].row][this.flatArr[index].columns].num = 0
            return this.ceateBack(this.flatArr[index - 1])
        }

        this.flatArr[index] = {
            ...this.flatArr[index],
            validArr: validArr1,
            num,
        }
        this.sudokuArr[this.flatArr[index].row][this.flatArr[index].columns].num = num
        if (index < 80) {
            return this.ceateBack(this.flatArr[index + 1])
        } else {
            return
        }
    }

    // 朝下找一个
    goNext(item) {
        // 正常下一个逻辑
        const { index } = item;
        const [validArr1, num] = randomItemPlus(this.effectiveAnswers(this.sudokuArr, item))
        if (!num) {
            this.flatArr[index] = {
                ...this.flatArr[index],
                validArr: null,
                num: 0
            }
            this.sudokuArr[this.flatArr[index].row][this.flatArr[index].columns].num = 0
            return this.ceateBack(this.flatArr[index - 1])
        }

        this.flatArr[index] = {
            ...this.flatArr[index],
            validArr: validArr1,
            num,
        }
        this.sudokuArr[this.flatArr[index].row][this.flatArr[index].columns].num = num
        if (index < 80) {
            return this.ceateBack(this.flatArr[index + 1])
        } else {
            // this.count = 0;
            return
        }
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
        // console.error(all)
        return all
    }



}

interface IStep {
    text: number
    row: number
    columns: number
    valid: boolean
}

export class SudokuService extends Sudoku {
    sudokuArrTemp: SudokuItem[][]; // 存储数组初始数据
    stepsArr: IStep[] // 操作收集栈
    instance: SudokuService
    // getInstance: () => SudokuService
    constructor() {
        super();
        this.stepsArr = [];
        // this.instance = null;
    }

    // 从头开始
    async againGame() {
        this.sudokuArr = JSON.parse(JSON.stringify(this.sudokuArrTemp))
        await this.sudokuArr;
    }

    // 开始游戏
    async startGame(difficulty) {
        await this.createSudoku(difficulty)
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
    
    static instance = null;
    static getInstance() {
        if (!this.instance) {
            this.instance = new SudokuService()
        }
        return this.instance;
    }
}




export default SudokuService.getInstance();