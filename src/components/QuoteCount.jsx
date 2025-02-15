import React, { useEffect, useState } from 'react';
import highlights from "../data/highlights.json";

const QuoteCount = () => {
  const [totalQuotes, setTotalQuotes] = useState(0);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    setTotalQuotes(highlights.length);
  }, []);

  useEffect(() => {
    let start = 0;
    const duration = 2500;
    const increment = totalQuotes / (duration / 100);

    const animateCount = () => {
      if (start < totalQuotes) {
        start += increment;
        setAnimatedCount(Math.ceil(start));
        setTimeout(animateCount, 100);
      } else {
        setAnimatedCount(totalQuotes)
      }
    };

    animateCount();
  }, [totalQuotes]);

  return (
    <div className='flex flex-col items-center'>  
      <div className="text-copy-primary font-sans text-2xl md:text-4xl font-semibold">{animatedCount}</div>
      <h2 className="text-copy-primary  font-sans font-bold uppercase  md:text-xl">Quotes</h2>

      {/* {Object.entries(count).map(([title, count]) => (
        <li key={title}>
          {title}: {count}
        </li>
      ))} */}
    </div>
  );
};

export default QuoteCount;