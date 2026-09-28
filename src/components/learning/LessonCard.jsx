import { Link } from "react-router-dom";

import { getLessonPath } from "../../data/lessons";

function LessonCard({ lesson }) {
  const content = (
    <>
      <div className="lesson-number">
        {lesson.number}
      </div>

      <div className="lesson-content">
        <span className="lesson-topic">
          {lesson.topic}
        </span>

        <h2>
          {lesson.title}
        </h2>

        <p>
          {lesson.description}
        </p>
      </div>

      <div
        className="lesson-arrow"
        aria-hidden="true"
      >
        {lesson.isAvailable ? "->" : "SOON"}
      </div>
    </>
  );

  if (!lesson.isAvailable) {
    return (
      <article
        className="lesson-card lesson-card-disabled"
        aria-label={`${lesson.title} is coming soon`}
      >
        {content}
      </article>
    );
  }

  return (
    <Link
      to={getLessonPath(lesson)}
      className="lesson-card"
      aria-label={`Learn ${lesson.title}`}
    >
      {content}
    </Link>
  );
}

export default LessonCard;
