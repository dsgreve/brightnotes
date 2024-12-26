import React, { useEffect, useState } from 'react';
import highlights from "../data/highlights.json";

const BookCount = () => {
  const [count, setCount] = useState({});

  useEffect(() => {
    const countBooks = () => {
      const count = {};
      highlights.forEach(highlight => {
        console.log(highlight.Title);
        if (count[highlight.Title]) {
          count[highlight.Title] += 1;
        } else {
          count[highlight.Title] = 1;
        }
      });
      setCount(count);
    };

    countBooks();
  }, []);

  const totalBooks = Object.keys(count).length;
  return (
    <div className='flex flex-col items-center'>
      <div className='text-copy-primary p-6 bg-background border-2 rounded-full border-border-color'>{totalBooks}</div>
      <h2 className='font-extrabold p-4 text-copy-primary'>Books Read</h2>
      {/* {Object.entries(count).map(([title, count]) => (
        <li key={title}>
          {title}: {count}
        </li>
      ))} */}
    </div>
  );
};

export default BookCount;