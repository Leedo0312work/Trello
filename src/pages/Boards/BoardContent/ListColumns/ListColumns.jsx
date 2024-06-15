import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import { Button } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import theme from '~/theme'

function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title!')
      return
    }
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  return (
    // https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
    // SortableContext yêu cầu items là một mảng dạng dữ liệu nguyên thủy, không phải là dạng Json-gây ảnh hưởng đến giá trị items
    <SortableContext
      items={columns?.map(column => column._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}
      >
        {columns?.map(column => (
          <Column key={column?._id} column={column} />
        ))}

        {/* Box add new column CTA */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={e => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Button
                onClick={addNewColumn}
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  boxShadow: 'none',
                  // border: '0.5px solid',
                  borderColor: { bgcolor: theme => theme.palette.primary.main },
                  '&:hover': { bgcolor: theme => theme.palette.primary.light }
                }}
              >
                Add list
              </Button>
              <CloseIcon
                fontSize="small"
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': {
                    //color: theme => theme.palette.warning.light,
                    bgcolor: theme => theme.palette.error.light
                  },
                  borderRadius: '5px'
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
