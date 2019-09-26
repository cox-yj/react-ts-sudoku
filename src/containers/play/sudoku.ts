import { randomItem } from '../../utils/utils'


export class SudokuItem  {
    num: number;
    row: number;
    columns: number;
    block: number;
    id: string;
    isInitData: boolean;
    constructor(num: number, row: number, columns: number, isInitData = true) {
        this.id = `${row}_${columns}`
        this.num = num;
        this.row = row;
        this.columns = columns;
        this.block = this.getBlockKey(row, columns);
        this.isInitData = isInitData;
    }

    getBlockKey(row: number, columns: number): number {
        return Math.floor(columns / 3 )  +  Math.floor(row / 3) * 3
    }
}

class Sudoku {
    sudoKuArr: SudokuItem[][]
    count: number 
    constructor() {
        this.count = 0
        this.sudoKuArr = this.initSudoku()
    }

    // 初始化数独
    initSudoku = (): SudokuItem[][] => {
        
        this.count = this.count + 1;
        const sudoKuArr: SudokuItem[][] = [];

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
                if(!itemNum)  return this.initSudoku();
                item.num = itemNum
            }
        }
        return sudoKuArr;
        // this.sudoKuArr = sudoKuArr;
    }

    getBlockArr(sudoKuArr: SudokuItem[][], block: number): SudokuItem[] {
        const row = Math.floor(block / 3)*3
        const columns = (block % 3)*3;
        const tempArr: SudokuItem[] = []
        for (let i = 0; 3 > i; i++) {
            for (let j = 0; 3 > j; j++) {
                tempArr.push(sudoKuArr[row + i][columns + j])
            }
        }
        return tempArr;
    }

    // 获取所有可用解
    effectiveAnswers(sudoKuArr: SudokuItem[][], { row, columns, block }: {row: number, columns: number, block: number}) {
        let allStr = '123456789';
        const rowStr: number[] = sudoKuArr[row]
            .map((item: any) =>  item.num)

        const columnsStr: number[] = sudoKuArr
            .filter((item: { [x: string]: any; }) => item[columns])
            .map((item: any) => item.num)

        const blockStr: number[] = this.getBlockArr(sudoKuArr, block)
            .map((item: any) => item.num)
        const arr = [...rowStr, ...columnsStr,  ...blockStr]
        arr.forEach(item => {
            allStr = allStr.replace(item + '', '')
        });
        const temp = allStr.split('').map(item => +item);
        // console.error(temp)
        return temp
    }
}

export class SudokuGame extends Sudoku{
    constructor(count){
        super()
        console.error('this', this);
        this.itemOut(count)
    }
    itemOut(count){
        const arr = [0,1,2,3,4,5,6,7,8]
        // const rowArr = randomItems(arr, count);
        // const columnsArr = randomItems(arr, count);
        for(let i = 0; count > i; i++) {
            const row = randomItem(arr);
            const columns = randomItem(arr);
            this.sudoKuArr[row][columns].num = 0
            this.sudoKuArr[row][columns].isInitData = false
        }
    }

    setItem(item, num) {
        item.num = num;
    }
}




export default Sudoku;