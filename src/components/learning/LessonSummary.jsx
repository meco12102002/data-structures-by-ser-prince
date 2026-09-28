function LessonSummary({ items }) {
  return (
    <section
      className="lesson-section binary-tree-summary"
      aria-labelledby="binary-tree-summary"
    >
      <span className="section-label">
        LESSON SUMMARY
      </span>

      <h2 id="binary-tree-summary">
        What You Should Understand
      </h2>

      <div className="lesson-summary-grid">
        {items.map((item) => (
          <article
            className="lesson-summary-item"
            key={item.number}
          >
            <span>
              {item.number}
            </span>

            <h3>
              {item.title}
            </h3>

            <p>
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LessonSummary;
