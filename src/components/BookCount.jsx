import React, { useEffect, useState } from 'react';
import highlights from "../data/highlights.json";

const BookCount = () => {
  const [count, setCount] = useState({});
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    const countBooks = () => {
      const count = {};
      highlights.forEach(highlight => {
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

  useEffect(() => {
    const totalBooks = Object.keys(count).length;
    let start = 0;
    const duration = 2000; // Duration of the animation in milliseconds
    const increment = totalBooks / (duration / 100); // Increment value based on duration

    const animateCount = () => {
      if (start < totalBooks) {
        start += increment;
        setAnimatedCount(Math.ceil(start));
        setTimeout(animateCount, 100);
      } else {
        setAnimatedCount(totalBooks);
      }
    };

    animateCount();
  }, [count]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-copy-primary font-sans text-2xl md:text-4xl font-semibold">{animatedCount}</div>
      <h2 className="text-copy-primary font-sans font-bold uppercase md:text-xl">Books</h2>
    </div>
  );
};

export default BookCount;