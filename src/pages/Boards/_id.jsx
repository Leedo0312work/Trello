import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDiffColsAPI
} from '~/apis'
import { mockData } from '~/apis/mock-data'
import { generatorPlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '665b5450baead57295ed2fc6'

    fetchBoardDetailsAPI(boardId).then(board => {
      //Sắp xếp thứ tự các column
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      //Fix issue: Empty column
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatorPlaceholderCard(column)]
          column.cardOrderIds = [generatorPlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
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

    //New state board
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
      if (findColumnActive.cards.some(card => card.FE_PlaceholderCard)) {
        //Nếu column rỗng
        findColumnActive.cards = [createdCard]
        findColumnActive.cardOrderIds = [createdCard._id]
      } else {
        findColumnActive.cards.push(createdCard)
        findColumnActive.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  const moveColumns = dndOrderedColumns => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    //New state board
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    //Call API
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds
    })
  }

  const moveCardInColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    //New state board
    const newBoard = { ...board }
    const findColumnActive = newBoard.columns.find(
      column => column._id === columnId
    )
    if (findColumnActive) {
      findColumnActive.cards = dndOrderedCards
      findColumnActive.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    //Call API
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  const moveCardToDiffCols = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

    //New state board
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    let prevCardOrderIds = dndOrderedColumns.find(
      col => col._id === prevColumnId
    )?.cardOrderIds
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    //Call API
    moveCardToDiffColsAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(col => col._id === nextColumnId)
        ?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography>Loading Board ...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInColumn={moveCardInColumn}
        moveCardToDiffCols={moveCardToDiffCols}
      />
    </Container>
  )
}

export default Board
