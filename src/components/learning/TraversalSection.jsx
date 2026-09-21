import TraversalDemo from "../activities/TraversalDemo";
import TraversalPractice from "../activities/TraversalPractice";

function TraversalSection({
  number,
  type,
  rule,
  title,
  description,
}) {
  return (
    <section className="traversal-section">

      {/* =================================
          SECTION HEADER
      ================================= */}

      <div className="traversal-section-header">

        <div>

          <span className="section-label">
            {number} / {type}
          </span>

          <h2>
            {title}
          </h2>

          <p>
            {description}
          </p>

        </div>

        <div className="traversal-rule">
          {rule}
        </div>

      </div>


      {/* =================================
          INTERACTIVE DEMO
      ================================= */}

      <TraversalDemo type={type} />


      {/* =================================
          PRACTICE
      ================================= */}

      <TraversalPractice type={type} />

    </section>
  );
}

export default TraversalSection;