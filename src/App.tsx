import React from 'react';
import './App.css';
import Suduku from './sudoku'

const suduku = new Suduku()

console.error(suduku.sudoKuArr.map(row => row.map(item => item.num) ))
console.error('count==>', suduku.count)

const App = () => {
  return  <div>123
  </div>
}


export default App;
