import React from 'react';
import BookCount from './BookCount';
import QuoteCount from './QuoteCount';
const Intro = () => {
  return (
    <div className="w-full">
       <div className="relative">
        <img className="absolute w-40 h-40 animate-subtle-circle z-10 -left-10 top-30" src="/blob-1.svg" alt="blob" />
       <img className="absolute animate-subtle-circle z-10 -right-8 -top-2 w-60 h-60" src="/blob-2.svg" alt="blob" />
       <img className="absolute animate-subtle-circle z-10 right-8 -top-8 w-14 h-14" src="/blob-1.svg" alt="blob" />
       <div className="flex flex-col shadow-lg ring-1 ring-accent/10 bg-primary-two/40 rounded-xl relative z-40 backdrop-blur-sm justify-between px-4 py-6 w-full max-w-[600px] mx-auto">
        <h1 className="text-copy-primary font-sans font-bold md:font-medium text-3xl/10 tracking-tight md:text-6xl md:h-[5rem] p-6y relative mb-16 text-left text-transparent bg-clip-text bg-gradient-to-r from-copy-primary to-accent line">BrightNotes</h1>
        <div className="flex flex-grow justify-end gap-10">
          <BookCount />
          <QuoteCount />
        </div>
        </div>
      </div>
    
      {/* <div className="flex absolute bottom-0">
        <div className='bg-primary-one h-10'>
          primary one
        </div>
        <div className='bg-primary-two h-10'>
          primary two
        </div>
        <div className='bg-neutral-one h-10'>
          neutral one
        </div>
        <div className='bg-neutral-two h-10'>
          neutral two
        </div>
        <div className='bg-accent h-10'>
          accent
        </div>
        <div className='bg-copy-primary h-10'>
          copy
        </div>
      </div> */}
    </div>
  )
}

export default Intro