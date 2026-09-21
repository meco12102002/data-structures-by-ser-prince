import { Link } from "react-router-dom";

import TreeTraversalPreview from "./TreeTraversalPreview";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <span className="hero-label">
          DATA STRUCTURES / INTERACTIVE LEARNING
        </span>

        <h1>
          Learn how
          <br />
          <span>data moves.</span>
        </h1>

        <p>
          Understand data structures by seeing them,
          interacting with them, and experimenting with
          how they work.
        </p>

        <Link
          to="/learn"
          className="primary-button"
        >
          START LEARNING
          <span>→</span>
        </Link>

      </div>

      <TreeTraversalPreview />

    </section>
  );
}

export default Hero;