import React from 'react'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
const ButtonRead = ({ handleToggle, showIntro }) => {
  return (  
    <button
     onClick={handleToggle}>
      {showIntro ? <LibraryBooksIcon /> : <RestartAltIcon />}
      </button>
  )
}

export default ButtonRead;