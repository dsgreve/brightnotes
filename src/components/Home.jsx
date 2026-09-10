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
    <main className="home-shell">
      <div className="home-content">
        {showIntro ? <Intro /> : <BookHighlight />}
      </div>
      <div className="home-palette">
        {showPallete && <ColorPallete />}
      </div>

      <nav className="home-actions" aria-label="Library actions">
        <ButtonRead
          handleToggle={handleToggle}
          showIntro={showIntro}
          ariaLabel={showIntro ? 'Open a highlight' : 'Back to overview'}
        />
        <ButtonPallete
          handleTogglePallete={handleTogglePallete}
          ariaLabel={showPallete ? 'Hide palette' : 'Show palette'}
        />
        <button className="action-button" onClick={() => navigate('/filter')} aria-label="Filter quotes" title="Filter quotes">
          <FilterAltIcon />
        </button>
      </nav>
    </main>
  );
}

export default Home;
