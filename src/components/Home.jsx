import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Intro from './Intro';
import BookHighlight from './BookHighlight';
import ColorPallete from './ColorPallete';
import ButtonPallete from './ButtonPallete';
import ButtonRead from './ButtonRead';

function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [showPallete, setShowPallete] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setShowIntro(!showIntro);
  };
  const handleTogglePallete = () => {
    setShowPallete(!showPallete);
  };

  return (
    <div className="flex flex-col flex-grow justify-between">
      <div className="flex-grow">
        {showIntro ? <Intro /> : <BookHighlight />}
      </div>
      <div className="flex-grow">
        {showPallete && <ColorPallete />}
      </div>

      <div className="flex-none">
        <ButtonRead handleToggle={handleToggle} showIntro={showIntro} />
        <ButtonPallete handleTogglePallete={handleTogglePallete} />
        <button onClick={() => navigate('/filter')} aria-label="Filter quotes">
          <FilterAltIcon />
        </button>
      </div>
    </div>
  );
}

export default Home;
