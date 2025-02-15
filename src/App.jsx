import React, { useState } from 'react';
import ThemeBtn from './components/ThemeSwitch/ThemeBtn';
import Intro from './components/Intro';
import BookHighlight from './components/BookHighlight';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const handleToggle = () => {
    setShowIntro(!showIntro);
  }
  return (
    <div className="bg-gradient-primary h-full flex flex-col justify-between">
      <ThemeBtn />
      {showIntro ? <Intro /> : <BookHighlight />}
      <button
          onClick={handleToggle}
          className="p-2 bg-cta text-white rounded"
        >
          {showIntro ? 'Show Highlights' : 'Show Intro'}
        </button>
    </div>
  );
}

export default App
