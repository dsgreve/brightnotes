import React from 'react'
import Palette from "@mui/icons-material/Palette";
const ButtonPallete = ({ handleTogglePallete }) => {
  return (  
    <button
     onClick={handleTogglePallete}><Palette /></button>
  )
}

export default ButtonPallete