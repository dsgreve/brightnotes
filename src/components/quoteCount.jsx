import React, { useEffect, useState } from 'react';
import highlights from "../data/highlights.json";

const QuoteCount = () => {
  const [totalQuotes, setTotalQuotes] = useState(0);

  useEffect(() => {
    setTotalQuotes(highlights.length);
  }, []);

  return (
    <div className='flex flex-col items-center'>
      <div className='text-copy-primary p-6 bg-background border-2 rounded-full border-border-color'>{totalQuotes}</div>
      <h2 className='font-extrabold p-4 text-copy-primary'>Quotes</h2>
      {/* {Object.entries(count).map(([title, count]) => (
        <li key={title}>
          {title}: {count}
        </li>
      ))} */}
    </div>
  );
};

export default QuoteCount;