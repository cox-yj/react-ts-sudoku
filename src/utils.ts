import {RandomItem} from './utils.type'
export const randomItem: RandomItem  = (arr) => {
    const index = Math.floor((Math.random()*arr.length));
    return arr[index];
}