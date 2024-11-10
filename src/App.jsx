import React from 'react';
import ThemeBtn from './components/ThemeSwitch/ThemeBtn';
import BookHighlight from './components/BookHighlight';
import './App.css';

function App() {

  return (
    <div className='background'>
      <ThemeBtn />
      <div>
        <h1 className="mb-8 text-copy-primary">Highlights</h1>
        <BookHighlight />
      </div>
    </div>
  );
}

export default App
