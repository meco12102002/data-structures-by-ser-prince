import { Link } from "react-router-dom";

const lessons = [
  {
    number: "01",
    title: "Introduction to Data Structures",
    description:
      "Understand what data structures are, why they matter, and how they help organize data.",
    topic: "FOUNDATIONS",
  },
  {
    number: "02",
    title: "Arrays",
    description:
      "Learn how arrays store elements and how accessing, inserting, and removing data works.",
    topic: "LINEAR",
  },
  {
    number: "03",
    title: "Linked Lists",
    description:
      "Explore how nodes connect to one another and how linked lists differ from arrays.",
    topic: "LINEAR",
  },
  {
    number: "04",
    title: "Stacks",
    description:
      "Understand the Last-In, First-Out principle through interactive operations.",
    topic: "LINEAR",
  },
  {
    number: "05",
    title: "Queues",
    description:
      "Explore the First-In, First-Out principle and how queues manage data.",
    topic: "LINEAR",
  },
  {
    number: "06",
    id: "binary-trees",
    title: "Binary Trees",
    description:
      "Understand nodes, relationships, and traversal through interactive exploration.",
    topic: "NON-LINEAR",
  },
  {
    number: "07",
    title: "Graphs",
    description:
      "Learn how vertices and edges represent relationships between connected data.",
    topic: "NON-LINEAR",
  },
  {
    number: "08",
    title: "Searching",
    description:
      "Explore different ways algorithms locate data inside a structure.",
    topic: "ALGORITHMS",
  },
  {
    number: "09",
    title: "Sorting",
    description:
      "Understand how sorting algorithms rearrange data into a desired order.",
    topic: "ALGORITHMS",
  },
];

function Learning() {
  return (
    <main className="learning-page">
      <section className="learning-hero">
        <span className="section-label">
          LEARNING PATH
        </span>

        <h1>
          Explore the
          <br />
          <span>structures.</span>
        </h1>

        <p>
          Learn data structures by visualizing how they work,
          experimenting with their operations, and solving
          problems along the way.
        </p>
      </section>

      <section className="lesson-list">
        <div className="lesson-list-header">
          <span>LESSONS</span>

          <span>
            {lessons.length.toString().padStart(2, "0")} TOPICS
          </span>
        </div>

        <div className="lessons">
          {lessons.map((lesson) => (
            <Link
              to={
                lesson.id
                  ? `/learn/${lesson.id}`
                  : `/learn/${lesson.number}`
              }
              className="lesson-card"
              key={lesson.number}
            >
              <div className="lesson-number">
                {lesson.number}
              </div>

              <div className="lesson-content">
                <span className="lesson-topic">
                  {lesson.topic}
                </span>

                <h2>{lesson.title}</h2>

                <p>{lesson.description}</p>
              </div>

              <div className="lesson-arrow">
                →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Learning;