import React from "react"

export const Row = ({ row, index }) => {
  return (
    <div key={index} className={'sudoku_row'} >
      {/* { row.map(items =>(<Item item={items} />)) } */}
    </div>
  )
}

export const Item = ({ item }) => {
  // return <span key={item.id} className={`sudoku_item ${item.isInitData ? '' : 'noinit'}`} onClick={() => { writeItem(item) }}> {item.num || ''}</span>
}