import React, { useState } from 'react';
import SudokuGame from './sudoku';
const sudoku = new SudokuGame(50)
// new SudokuGame()
const Play = () => {
  const [sudokuArr, setSudokuArr] = useState(sudoku.sudoKuArr)
  const [answersArr, setAnswersArr] = useState([])

  const [nowItem, setNowItem] = useState(null);

  // 开始游戏
  const startGame = () => {
    sudoku.startGame()
    setSudokuArr([...sudoku.sudoKuArr])
  }

  // 从头开始
  const againGame = () => {
    sudoku.againGame()
    setSudokuArr([...sudoku.sudoKuArr])
  }

  // 点击空白格
  const selectItem = (item) => {
    if (!item.isChange) return
    const tempArr = sudoku.effectiveAnswers(sudokuArr, item)
    setNowItem(item)
    setAnswersArr(tempArr)
  }

  // 写入空白格
  const writeItem = (num) => {
    console.error(num)
    sudoku.writeItem(nowItem, num)

    setNowItem(null)
    setSudokuArr([...sudoku.sudoKuArr])
    setAnswersArr([])
  }

  // 下一步
  const prevStep = () => {
    sudoku.prevStep()
    setSudokuArr([...sudoku.sudoKuArr])
  }

  // 上一步
  const nextStep = () => {
    sudoku.nextStep()
    setSudokuArr([...sudoku.sudoKuArr])
  }

  return (<div className={'sudoku_wrap'}>
    <div className={'sudoku_header'} >
      <button className={'button'} onClick={startGame}>开始游戏</button>
      <button className={'button'} onClick={prevStep}>上一步</button>
      <button className={'button'} onClick={nextStep}>下一步</button>
      <button className={'button'} onClick={againGame}>回到第一步</button>
    </div>
    <div className={'sudoku_content'}>
      <div className={'sudoku_board'}>
        {sudokuArr.map((row, i) => {
          return <div key={i} className={'sudoku_row'} >
            {row.map(item => {
              return <span key={item.id} id={item.id} className={`sudoku_item ${item.isChange ? 'noinit' : ''}`} onClick={() => { selectItem(item) }}> {item.num || ''}</span>
            })}
          </div>
        })}
      </div>
      <div className={'sudoku_write'}>
        {
          answersArr.map(item => {
            return <span className={'select_item'} key={item} onClick={() => { writeItem(item) }}> {item}</span>
          })
        }
      </div>
    </div>
  </ div>)
}
export default Play