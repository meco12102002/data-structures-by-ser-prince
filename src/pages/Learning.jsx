import { Link } from "react-router-dom";

import SEO from "../components/SEO";
import LessonList from "../components/learning/LessonList";
import { lessons } from "../data/lessons";

function Learning() {
  return (
    <>
      <SEO
        title="Learn Data Structures | Interactive DSA Lessons"
        description="Learn data structures through interactive visualizations, guided explanations, and hands-on practice with arrays, linked lists, stacks, queues, trees, graphs, searching, and sorting."
        path="/learn"
        keywords={[
          "data structures lessons",
          "DSA learning path",
          "interactive algorithms",
          "tree lessons",
          "heap lessons",
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Interactive Data Structures Lessons",
          url: "https://data-structures-by-ser-prince.vercel.app/learn",
          description:
            "A learning path of interactive data structures lessons and practice activities.",
        }}
      />

      <main className="learning-page">
        <div className="learning-navigation">
          <Link
            to="/"
            className="learning-back"
          >
            <span>{"<-"}</span>
            BACK TO HOME
          </Link>
        </div>

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

        <LessonList lessons={lessons} />
      </main>
    </>
  );
}

export default Learning;
