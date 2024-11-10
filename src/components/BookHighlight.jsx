import React, { useState, useEffect } from "react";
import data from "../data/highlights.json";
import '../App.css';

function BookHighlight() {
  const [bookHighlight, setBookHighlight] = useState(null);
  const [fade, setFade] = useState(false);

  const loadRandomHighlight = () => {
    setFade(true);
    setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setBookHighlight(data[randomIndex]);
    setFade(false);
    }, 500)
  };

  useEffect(() => {
    loadRandomHighlight();
  }, []);

  if (!bookHighlight) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="quote-container md:flex align-center gap-10">
        <div className="basis-1/3">
          <a href={bookHighlight["Book URL"]}>
            <img src={bookHighlight["Book Cover"]} alt={bookHighlight.Title} />
          </a>
          <a href={bookHighlight["Book URL"]}>Buy On Amazon</a>
        </div>
        <div className="basis-2/3 h-100 mt-auto mb-auto text-left">
          <h2 className="font-extrabold text-2xl mb-4 text-copy-primary">{bookHighlight.Title}</h2>
          <p className="text-xl mb-4 text-copy-primary">{bookHighlight.Author}</p>
          <p className="text-2xl mb-4 text-copy-primary">{bookHighlight["Highlight Text"]}</p>
          <button onClick={loadRandomHighlight} className="mt-4 p-2 bg-cta text-white rounded">
            Load Another Highlight
          </button>
        </div>
      </div>
    </>
  );
}

export default BookHighlight;