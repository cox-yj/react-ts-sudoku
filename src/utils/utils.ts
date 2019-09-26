import {RandomItem, RandomItems} from './utils.type'
export const randomItem: RandomItem  = (arr) => {
    const index = Math.floor((Math.random()*arr.length));
    return arr[index];
}

export const randomItems: RandomItems  = (arr, count) => {
    if(Object.prototype.toString.call(arr) !== '[object Array]')  return [];
    if(arr.length <= count) return arr;
    arr = [...arr];
    const tempArr = [];
    for(let i = 0; count > i; i++) {
        const index = Math.floor((Math.random()*arr.length));
        tempArr.push(...arr.splice(index, 1));
    }
    // const index = Math.floor((Math.random()*arr.length));
    return tempArr;
}