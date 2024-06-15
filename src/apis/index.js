import axios from 'axios'
import { API_ENDPOINT } from '~/utils/constants'

//Board
export const fetchBoardDetailsAPI = async boardId => {
  const response = await axios.get(`${API_ENDPOINT}/v1/boards/${boardId}`)

  return response.data
}

//Column
export const createNewColumnAPI = async newColumnData => {
  const response = await axios.post(`${API_ENDPOINT}/v1/columns`, newColumnData)
  return response.data
}

//Card
export const createNewCardAPI = async newCardData => {
  const response = await axios.post(`${API_ENDPOINT}/v1/cards`, newCardData)
  return response.data
}
