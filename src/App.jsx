import React from 'react';
import ThemeBtn from './components/ThemeSwitch/ThemeBtn';
import BookCount from './components/BookCount';
import BookHighlight from './components/BookHighlight';
import './App.css';
import QuoteCount from './components/quoteCount';

function App() {

  return (
    <div className='background'>
      <ThemeBtn />
      <div className='flex justify-center items-center my-14'>
        <BookCount />
        <QuoteCount />
      </div>
      <div>
        <h1 className="mb-8 text-copy-primary">Highlights</h1>
        <BookHighlight />
      </div>
    </div>
  );
}

export default App
