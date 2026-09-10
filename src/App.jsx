import { Routes, Route } from 'react-router-dom';
import ThemeBtn from './components/ThemeSwitch/ThemeBtn';
import Home from './components/Home';
import FilterQuotes from './components/FilterQuotes';

function App() {
  return (
    <div className="app-frame">
      <div className="theme-control"><ThemeBtn /></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filter" element={<FilterQuotes />} />
      </Routes>
    </div>
  );
}

export default App
