export interface ISudoKuItem {
    num: string | number
    row: number
    columns: number
    block: number
    isInitData: boolean
    getBlockKey(row: number, columns: number): number
}

export interface ISudoku{

}
