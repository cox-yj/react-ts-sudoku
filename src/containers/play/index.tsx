import React, { useState } from 'react';
import sudokuService from './sudokuService';
// new SudokuGame()
const Play = () => {
  const [sudokuArr, setSudokuArr] = useState(sudokuService.sudokuArr)
  const [answersArr, setAnswersArr] = useState([])

  const [nowItem, setNowItem] = useState(null);

  // 开始游戏
  const startGame = () => {
    sudokuService.startGame(4)
    setSudokuArr([...sudokuService.sudokuArr])
  }

  // 从头开始
  const againGame = () => {
    sudokuService.againGame()
    setSudokuArr([...sudokuService.sudokuArr])
  }

  // 点击空白格
  const selectItem = (item) => {
    if (!item.isChange) return
    const tempArr = sudokuService.effectiveAnswers(sudokuArr, item)
    if(!tempArr.length) return alert('无解了!');
    setNowItem(item)
    setAnswersArr(tempArr)
  }

  // 写入空白格
  const writeItem = (num) => {
    console.error(num)
    sudokuService.writeItem(nowItem, num)

    setNowItem(null)
    setSudokuArr([...sudokuService.sudokuArr])
    setAnswersArr([])
  }

  // 下一步
  const prevStep = () => {
    sudokuService.prevStep()
    setSudokuArr([...sudokuService.sudokuArr])
  }

  // 上一步
  const nextStep = () => {
    sudokuService.nextStep()
    setSudokuArr([...sudokuService.sudokuArr])
  }
  // console.error('sudokuArr===>', sudokuArr)
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