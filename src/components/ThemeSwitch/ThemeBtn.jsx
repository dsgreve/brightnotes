import { useEffect } from 'react';
import { Switch } from '@mui/material';
import useLocalStorage from './UseLocalStorage';

function ThemeBtn() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const isDark = theme === 'dark';

  // The body class is the single source of truth for the active theme;
  // index.css lets it override the prefers-color-scheme default.
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('light-mode', !isDark);
  }, [isDark]);

  const handleChange = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className="theme-toggle-container">
      <label className="sr-only">{isDark ? 'Light Mode' : 'Dark Mode'}</label>
      <Switch
        checked={isDark}
        onChange={handleChange}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'rgb(234, 189, 192)',
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-thumb':  {
            backgroundColor: 'rgb(234, 189, 192)',
            },
          },
          '& .MuiSwitch-switchBase + .MuiSwitch-track': {
            backgroundColor: 'rgb(200, 200, 200)',
          },
        }}
      />
    </div>
  );
}

export default ThemeBtn;