import React, { useEffect } from 'react';
import { Switch } from '@mui/material';
import useLocalStorage from './UseLocalStorage';

function ThemeBtn() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  console.log(theme);
  const handleChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  };

  // Apply the initial theme based on the stored value
  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);
  

  return (
    <div className="theme-toggle-container">
      <label className="text-copy-primary text-sm relative inline-flex items-center cursor-pointer">{theme === 'light' ? 'Dark Mode' : 'Light Mode' }</label>
      <Switch checked={theme === 'light'} onChange={handleChange} />
    </div>
  );
}

export default ThemeBtn;