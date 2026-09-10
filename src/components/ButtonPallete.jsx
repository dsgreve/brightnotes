import Palette from "@mui/icons-material/Palette";
const ButtonPallete = ({ handleTogglePallete, ariaLabel }) => {
  return (  
    <button
     className="action-button"
     onClick={handleTogglePallete}
     aria-label={ariaLabel}
     title={ariaLabel}><Palette /></button>
  )
}

export default ButtonPallete