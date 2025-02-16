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
      <div flex-none><ThemeBtn /></div>
      <div flex-grow>
        {showIntro ? <Intro /> : <BookHighlight />}
      </div>
      <div flex-none>
        <button
          onClick={handleToggle}
          className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-transparent px-6 font-medium text-neutral-600 transition-all [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none"
        >
          {showIntro ? 'Read Notes' : 'Back to Intro'}
        </button>
      </div>
    </div>
  );
}

export default App
