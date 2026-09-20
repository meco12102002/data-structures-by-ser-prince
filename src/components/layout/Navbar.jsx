import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-mark">
            DS.
          </span>

          <span className="navbar-brand-text">
            DATA STRUCTURES
            <small>WITH SER PRINCE</small>
          </span>
        </Link>

        <nav className="navbar-nav">
          <Link to="/" className="navbar-link">
            HOME
          </Link>

          <Link to="/learn" className="navbar-link active">
            LEARN
          </Link>

          <a href="/#about" className="navbar-link">
            ABOUT
          </a>
        </nav>

        <div className="navbar-action">
          <Link to="/learn" className="navbar-start">
            START LEARNING
            <span>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;