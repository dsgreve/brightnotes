import BookCount from './BookCount';
import QuoteCount from './QuoteCount';
const Intro = () => {
  return (
    <section className="intro-panel" aria-labelledby="intro-title">
      <div className="intro-shapes" aria-hidden="true">
        <img className="intro-shape intro-shape-one animate-subtle-circle" src="/blob-1.svg" alt="" />
        <img className="intro-shape intro-shape-two animate-subtle-circle" src="/blob-2.svg" alt="" />
        <img className="intro-shape intro-shape-three animate-subtle-circle" src="/blob-1.svg" alt="" />
      </div>
      <div className="intro-card">
        <div className="intro-copy">
          <p className="intro-kicker">A personal reading archive</p>
          <h1 id="intro-title">BrightNotes</h1>
          <p className="intro-description">
            The lines worth returning to, gathered from the books that stay with you.
          </p>
        </div>
        <div className="intro-stats" aria-label="Library totals">
          <BookCount />
          <QuoteCount />
        </div>
      </div>
    </section>
  )
}

export default Intro