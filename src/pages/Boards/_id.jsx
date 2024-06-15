import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI } from '~/apis'
import { mockData } from '~/apis/mock-data'
import { createNewColumnAPI, createNewCardAPI } from '~/apis'
import { generatorPlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '665b5450baead57295ed2fc6'

    fetchBoardDetailsAPI(boardId).then(board => {
      //Fix issue: Empty column
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatorPlaceholderCard(column)]
          column.cardOrderIds = [generatorPlaceholderCard(column)._id]
        }
      })

      setBoard(board)
    })
  }, [])

  //Call API và làm mới state board
  const createNewColumn = async newColumnData => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    //Fix issue: Empty column
    createdColumn.cards = [generatorPlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatorPlaceholderCard(createdColumn)._id]

    //New state
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  //Call API và làm mới state board
  const createNewCard = async newCardData => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    //New state
    const newBoard = { ...board }
    const findColumnActive = newBoard.columns.find(
      column => column._id === createdCard.columnId
    )
    if (findColumnActive) {
      findColumnActive.cards.push(createdCard)
      findColumnActive.cardOrderIds.push(createdCard._id)
      setBoard(newBoard)
    }
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  )
}

export default Board
