import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const lessons = [
  {
    number: "01",
    slug: "introduction-to-data-structures",
    title: "Introduction to Data Structures",
    description:
      "Understand what data structures are, why they matter, and how they help organize data.",
    topic: "FOUNDATIONS",
  },
  {
    number: "02",
    slug: "arrays",
    title: "Arrays",
    description:
      "Learn how arrays store elements and how accessing, inserting, and removing data works.",
    topic: "LINEAR",
  },
  {
    number: "03",
    slug: "linked-lists",
    title: "Linked Lists",
    description:
      "Explore how nodes connect to one another and how linked lists differ from arrays.",
    topic: "LINEAR",
  },
  {
    number: "04",
    slug: "stacks",
    title: "Stacks",
    description:
      "Understand the Last-In, First-Out principle through interactive operations.",
    topic: "LINEAR",
  },
  {
    number: "05",
    slug: "queues",
    title: "Queues",
    description:
      "Explore the First-In, First-Out principle and how queues manage data.",
    topic: "LINEAR",
  },
  {
    number: "06",
    slug: "binary-trees",
    title: "Binary Trees",
    description:
      "Understand nodes, relationships, and traversal through interactive exploration.",
    topic: "NON-LINEAR",
  },
  {
    number: "07",
    slug: "graphs",
    title: "Graphs",
    description:
      "Learn how vertices and edges represent relationships between connected data.",
    topic: "NON-LINEAR",
  },
  {
    number: "08",
    slug: "searching",
    title: "Searching",
    description:
      "Explore different ways algorithms locate data inside a structure.",
    topic: "ALGORITHMS",
  },
  {
    number: "09",
    slug: "sorting",
    title: "Sorting",
    description:
      "Understand how sorting algorithms rearrange data into a desired order.",
    topic: "ALGORITHMS",
  },
];

function Learning() {
  return (
    <>
      <SEO
        title="Learn Data Structures | Interactive DSA Lessons"
        description="Learn data structures through interactive visualizations, guided explanations, and hands-on practice with arrays, linked lists, stacks, queues, trees, graphs, searching, and sorting."
        path="/learn"
      />

      <main className="learning-page">

        {/* =================================
            PAGE NAVIGATION
        ================================= */}

        <div className="learning-navigation">
          <Link
            to="/"
            className="learning-back"
          >
            <span>←</span>
            BACK TO HOME
          </Link>
        </div>


        {/* =================================
            LEARNING HERO
        ================================= */}

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
            Learn data structures by visualizing how
            they work, experimenting with their
            operations, and solving problems along
            the way.
          </p>

        </section>


        {/* =================================
            LESSON LIST
        ================================= */}

        <section
          className="lesson-list"
          aria-labelledby="lessons-heading"
        >

          <div className="lesson-list-header">

            <span id="lessons-heading">
              LESSONS
            </span>

            <span>
              {lessons.length
                .toString()
                .padStart(2, "0")}{" "}
              TOPICS
            </span>

          </div>


          <div className="lessons">

            {lessons.map((lesson) => (

              <Link
                to={`/learn/${lesson.slug}`}
                className="lesson-card"
                key={lesson.slug}
                aria-label={`Learn ${lesson.title}`}
              >

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
                  →
                </div>

              </Link>

            ))}

          </div>

        </section>

      </main>
    </>
  );
}

export default Learning;