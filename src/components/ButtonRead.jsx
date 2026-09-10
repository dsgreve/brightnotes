import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
const ButtonRead = ({ handleToggle, showIntro, ariaLabel }) => {
  return (  
    <button
     className="action-button"
     onClick={handleToggle}
     aria-label={ariaLabel}
     title={ariaLabel}>
      {showIntro ? <LibraryBooksIcon /> : <RestartAltIcon />}
      </button>
  )
}

export default ButtonRead;