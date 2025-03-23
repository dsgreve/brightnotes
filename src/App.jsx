import React, { useState } from 'react';
import ThemeBtn from './components/ThemeSwitch/ThemeBtn';
import Intro from './components/Intro';
import BookHighlight from './components/BookHighlight';
import ColorPallete from './components/ColorPallete';
import ButtonPallete from './components/ButtonPallete';
import ButtonRead from './components/ButtonRead';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showPallete, setShowPallete] = useState(false)
  const handleToggle = () => {
    setShowIntro(!showIntro);
  }
  const handleTogglePallete = () => {
    setShowPallete(!showPallete);
  }
  return (
    <div className="h-screen flex flex-col justify-between overflow-auto px-4">
      <div flex-none><ThemeBtn /></div>
      <div flex-grow>
        {showIntro ? <Intro /> : <BookHighlight />}
      </div>
      <div flex-grow>
        {showPallete && <ColorPallete />}
      </div>
      
      <div flex-none>
          <ButtonRead handleToggle={handleToggle} showIntro={showIntro} />
          <ButtonPallete handleTogglePallete={handleTogglePallete} />
      </div>
    </div>
  );
}

export default App
