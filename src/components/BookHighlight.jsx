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
        <div className="basis-1/3 flex justify-center flex-col">
          <a className="text-center" href={bookHighlight["Book URL"]}>
            <img className="max-h-48 md:max-h-full mx-auto" src={bookHighlight["Book Cover"]} alt={bookHighlight.Title} />
          </a>
          <a href={bookHighlight["Book URL"]} target="_blank">Buy On Amazon</a>
        </div>
        <div className="basis-2/3 h-100 mb-auto text-left">
          <h2
            className="font-extrabold text-2xl mb-4 text-copy-primary"
            dangerouslySetInnerHTML={{ __html: bookHighlight.Title }}
          ></h2>
          <p className="text-xl mb-4 text-copy-primary">{bookHighlight.Author}</p>
          <p className="text-2xl mb-4 text-copy-primary" >{bookHighlight["Highlight Text"]}</p>
          <div className="flex justify-center md:justify-start my-6 ">
            <button onClick={loadRandomHighlight} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg border border-accent bg-accent/30 px-6 font-sans font-semibold text-copy-primary transition-all [box-shadow:0px_4px_1px_#a3a3a3] active:translate-y-[2px] active:shadow-none">
            New Note
          </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookHighlight;