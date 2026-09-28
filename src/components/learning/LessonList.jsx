import LessonCard from "./LessonCard";

function LessonList({ lessons }) {
  return (
    <section
      className="lesson-list"
      aria-labelledby="lessons-heading"
    >
      <div className="lesson-list-header">
        <span id="lessons-heading">
          LESSONS
        </span>

        <span>
          {lessons.length.toString().padStart(2, "0")} TOPICS
        </span>
      </div>

      <div className="lessons">
        {lessons.map((lesson) => (
          <LessonCard
            lesson={lesson}
            key={lesson.slug}
          />
        ))}
      </div>
    </section>
  );
}

export default LessonList;
