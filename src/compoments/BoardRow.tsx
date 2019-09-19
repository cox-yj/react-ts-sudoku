import React from 'react';

interface PropTypes{
    columns: number // 列
    num: number | undefined // 值
    isInitData: boolean // 是否是初始化数据（初始化数据不可更改）
    writeFn ( columns: number, num: number|undefined): void // 点击事件
}



const BoardItem: React.FC<PropTypes> = ({ num, writeFn, isInitData, columns}) => {
    const clickFn = () => {
        if(isInitData) return;
        writeFn(columns, num)
    }

    return (
      <div className={`board_item ${isInitData ? 'isinit' : ''} ${num ? 'exist' : 'empty'}`} onClick={clickFn}>
          {num || null}
      </div>
    );
  }
  
  export default BoardItem;

  