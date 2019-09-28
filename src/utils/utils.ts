import {RandomItem, RandomItems} from './utils.type'
export const randomItem: RandomItem  = (arr) => {
    const index = Math.floor((Math.random()*arr.length));
    return arr[index];
}

// 随机从数组中拿一个， 并且返回剩余部分的数组
export const randomItemPlus: RandomItem  = (arr) => {
    const temp = [...arr];
    const index = Math.floor((Math.random()*arr.length));
    let item = temp.splice(index, 1)
    if(item) item = item[0];
    return [temp, item];
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

export const shuffle = (array) =>  {
    var m = array.length,
        t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}
