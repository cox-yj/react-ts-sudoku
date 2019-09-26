import React, { useState } from 'react';
import { SudokuGame } from './sudoku';
const sudoku = new SudokuGame(16)
// new SudokuGame()
const Play = () => {
  const [sudokuArr, setSudokuArr] = useState(sudoku.sudoKuArr)
  const [answersArr, setAnswersArr] = useState([])

  const [nowItem, setNowItem] = useState(null);

  const initSudoku = () => {
    setSudokuArr(sudoku.initSudoku())
  }

  const writeItem = (item) => {
    const tempArr = sudoku.effectiveAnswers(sudokuArr, item)
    setNowItem(item)
    setAnswersArr(tempArr)
  }

  const selectItem = (num) => {
    console.error(num)
    sudoku.setItem(nowItem, num)
    setNowItem(null)
  }

  return (<div className={'sudoku_wrap'}>
    <div className={'sudoku_header'} >
        <button onClick={initSudoku}>重新创建</button>
        <button>上一步</button>
        <button>下一步</button>
        <button>回到第一步</button>
      </div>
      <div className={'sudoku_board'}>
      {sudokuArr.map((row, i) => {
      return <div key={i} className={'sudoku_row'} >
        {row.map(item => {
          return <span key={item.id} className={`sudoku_item ${item.isInitData ? '' : 'noinit'}`} onClick={() => {writeItem(item)}}> {item.num || ''}</span>
        })}
      </div>
    })}
      </div>
      <div className={'sudoku_write'}>
        {
          answersArr.map(item => {
            return <span key={item} onClick={()=> {selectItem(item)}}> {item }</span>
          })
        }
      </div>
  </ div>)
}
export default Play