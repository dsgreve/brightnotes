import { Routes, Route } from 'react-router-dom';
import ThemeBtn from './components/ThemeSwitch/ThemeBtn';
import Home from './components/Home';
import FilterQuotes from './components/FilterQuotes';

function App() {
  return (
    <div className="h-screen flex flex-col justify-between overflow-auto px-4">
      <div className="flex-none"><ThemeBtn /></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filter" element={<FilterQuotes />} />
      </Routes>
    </div>
  );
}

export default App
