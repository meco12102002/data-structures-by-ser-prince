import TraversalDemo from "../activities/TraversalDemo";
import TraversalPractice from "../activities/TraversalPractice";

function TraversalSection({
  number,
  type,
  rule,
  title,
  description,
}) {
  const isPreorder = type === "PREORDER";

  return (
    <section className="traversal-section">

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


      {isPreorder ? (
        <TraversalDemo />
      ) : (
        <div className="traversal-demo">

          <div className="traversal-demo-tree">

            <span>
              INTERACTIVE DEMO
            </span>

            <strong>
              COMING NEXT
            </strong>

          </div>

        </div>
      )}


      {isPreorder && <TraversalPractice />}

    </section>
  );
}

export default TraversalSection;