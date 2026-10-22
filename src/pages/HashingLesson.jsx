import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { handoutPagesBySection, hashingSections } from "../data/hashingLesson";
import {
  handoutConcepts,
  sectionJavaConnections,
} from "../data/hashingCurriculum";
import { LessonActiveContext } from "../hooks/useLessonPlayback";
import {
  StudentSearch,
  HashFunctionPlayground,
  HashTableSimulator,
  CollisionDiscovery,
} from "../components/learning/hashing/HashingLabs";
import {
  MapPlayground,
  SetComparison,
  SetPlayground,
} from "../components/learning/hashing/CollectionLabs";
import JavaWalkthrough from "../components/learning/hashing/JavaWalkthrough";
import CollisionHandlingLab from "../components/learning/hashing/CollisionHandlingLab";
import HashingApplications from "../components/learning/hashing/HashingApplications";
import {
  FinalReview,
  PracticeLab,
} from "../components/learning/hashing/PracticeLab";
import {
  CodePanel,
  PracticeQuestion,
} from "../components/learning/hashing/LessonUI";
import HandoutRecordLookup from "../components/learning/hashing/HandoutRecordLookup";
import TableDesignSection from "../components/learning/hashing/TableDesignSection";

const labs = [
  HashingBasics,
  HashFunctionPlayground,
  HashTableSimulator,
  CollisionDiscovery,
  CollisionHandlingLab,
  TableDesignSection,
  SetPlayground,
  SetComparison,
  MapPlayground,
  ProductMapComparison,
  JavaWalkthrough,
  PracticeLab,
  FinalReview,
];

function ProductMapComparison() {
  return <MapPlayground compare />;
}

function HashingBasics() {
  const active = useContext(LessonActiveContext);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  return (
    <>
      <HandoutRecordLookup />
      <details
        className="hash-definitions lesson-panel"
        onToggle={(event) => setComparisonOpen(event.currentTarget.open)}
      >
        <summary>Compare sequential search and hash-based lookup</summary>
        <LessonActiveContext.Provider value={active && comparisonOpen}>
          <StudentSearch />
        </LessonActiveContext.Provider>
      </details>
    </>
  );
}

export default function HashingLesson() {
  const [viewMode, setViewMode] = useState("default");
  const [active, setActive] = useState(0);
  const [visited, setVisited] = useState([0]);
  const [complete, setComplete] = useState(false);
  const sectionRefs = useRef([]);
  const content = useRef(null);
  const isSlideMode = viewMode === "slides";

  // Full-lesson scrolling records visits and pauses labs outside the reading area.
  // Sections stay mounted when switching views so controls retain their state.
  useEffect(() => {
    if (isSlideMode) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (!visible.length) return;
        const indexes = visible.map((entry) =>
          Number(entry.target.dataset.lessonSection),
        );
        setVisited((current) => [...new Set([...current, ...indexes])]);
        visible.sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top) -
            Math.abs(b.boundingClientRect.top),
        );
        setActive(Number(visible[0].target.dataset.lessonSection));
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    sectionRefs.current.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isSlideMode]);

  function navigate(index) {
    setActive(index);
    setVisited((current) =>
      current.includes(index) ? current : [...current, index],
    );
    requestAnimationFrame(() => {
      const section = sectionRefs.current[index];
      section?.querySelector("h2")?.focus({ preventScroll: true });
      (isSlideMode ? content.current : section)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    });
  }

  return (
    <>
      <SEO
        title="Hashing, Sets, and Maps | Interactive Java Lesson"
        description="Learn hashing through interactive buckets, collision handling, rehashing, Sets, Maps, Java walkthroughs, and guided practice."
        path="/learn/hashing-sets-and-maps"
        type="article"
        keywords={[
          "hashing",
          "hash tables",
          "sets",
          "maps",
          "HashMap",
          "HashSet",
          "TreeMap",
          "TreeSet",
          "LinkedHashMap",
        ]}
      />
      <main className="lesson-page hash-lesson">
        <div className="lesson-navigation">
          <Link to="/learn" className="lesson-back">
            <span aria-hidden="true">{"<-"}</span>BACK TO LESSONS
          </Link>
        </div>
        <header className="lesson-hero">
          <span className="section-label">
            LESSON 11 / HASHING, SETS, AND MAPS
          </span>
          <h1>
            Hashing:
            <br />
            <span>Sets & Maps.</span>
          </h1>
          <p>
            Learn how hashing locates records, how collisions are handled, and
            how Sets and Maps organize data through interactive examples and
            Java walkthroughs.
          </p>
        </header>

        <div className="lesson-view-switcher">
          <div>
            <span>LESSON VIEW</span>
            <strong>
              {isSlideMode
                ? `Slide ${active + 1} of ${hashingSections.length}`
                : "Default full lesson"}
            </strong>
          </div>
          <div className="lesson-view-toggle">
            <button
              type="button"
              className={!isSlideMode ? "active" : ""}
              aria-pressed={!isSlideMode}
              onClick={() => setViewMode("default")}
            >
              DEFAULT
            </button>
            <button
              type="button"
              className={isSlideMode ? "active" : ""}
              aria-pressed={isSlideMode}
              onClick={() => setViewMode("slides")}
            >
              SLIDES
            </button>
          </div>
        </div>

        <div
          className={
            isSlideMode ? "lesson-slide-shell hash-content" : "hash-content"
          }
          ref={content}
        >
          <div className="lesson-slide-topbar hash-section-navigation">
            <button
              type="button"
              onClick={() => navigate(active - 1)}
              disabled={active === 0}
            >
              Previous section
            </button>
            <select
              id="hash-section-picker"
              value={active}
              aria-label="Choose hashing lesson section"
              onChange={(event) => navigate(Number(event.target.value))}
            >
              {hashingSections.map((section, index) => (
                <option key={section.title} value={index}>
                  {index + 1}. {section.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => navigate(active + 1)}
              disabled={active === hashingSections.length - 1}
            >
              Next section
            </button>
          </div>
          <div
            className="lesson-slide-progress"
            role="progressbar"
            aria-label="Lesson sections visited"
            aria-valuemin={0}
            aria-valuemax={hashingSections.length}
            aria-valuenow={visited.length}
          >
            <span
              style={{
                width: `${(visited.length / hashingSections.length) * 100}%`,
              }}
            />
          </div>
          <p className="hash-small hash-progress-summary" role="status">
            {complete
              ? "Lesson complete ✓"
              : `${visited.length} of ${hashingSections.length} sections visited · Complete the final knowledge check to finish.`}
          </p>

          {hashingSections.map((section, index) => {
            const Lab = labs[index];
            return (
              <section
                key={section.title}
                className="lesson-section hash-section"
                data-lesson-section={index}
                hidden={isSlideMode && index !== active}
                ref={(node) => {
                  sectionRefs.current[index] = node;
                }}
                aria-labelledby={`hash-section-${index}`}
              >
                <LessonActiveContext.Provider value={index === active}>
                  <span className="section-label">
                    {String(index + 1).padStart(2, "0")} / {section.tag}
                  </span>
                  <h2 id={`hash-section-${index}`} tabIndex={-1}>
                    {section.title}
                  </h2>
                  <p className="hash-small hash-source-reference">
                    IT2503 · 05 Handout 1 ·{" "}
                    {handoutPagesBySection[index].length === 1 ? "p." : "pp."}{" "}
                    {handoutPagesBySection[index]}
                  </p>
                  <p>{section.problem}</p>
                  <div className="hash-concept hash-section-intro">
                    {handoutConcepts[index] && (
                      <>
                        <span className="section-label">
                          HANDOUT DEFINITION / SOURCE EXCERPT
                        </span>
                        <dl>
                          {handoutConcepts[index].map((concept) => (
                            <div key={concept.term}>
                              <dt>
                                <strong>{concept.term}</strong>
                              </dt>
                              <dd className="hash-source-definition">
                                {concept.definition}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </>
                    )}
                    <div className="hash-explanation">
                      <span className="section-label">IN SIMPLE TERMS</span>
                      <p>{section.explanation}</p>
                    </div>
                    {section.clarification && (
                      <div className="lesson-callout hash-feedback">
                        <strong>Technical clarification</strong>
                        <p>{section.clarification}</p>
                      </div>
                    )}
                  </div>
                  <Lab
                    allVisited={visited.length === hashingSections.length}
                    complete={complete}
                    onComplete={setComplete}
                  />
                  <div className="hash-concept">
                    <details className="hash-definitions lesson-panel">
                      <summary>Important terminology and formulas</summary>
                      <dl>
                        {section.terms.map(([term, definition]) => (
                          <div key={term}>
                            <dt>{term}</dt>
                            <dd>{definition}</dd>
                          </div>
                        ))}
                      </dl>
                    </details>
                    <p>
                      <strong>Where it helps</strong>
                      <br />
                      {section.application}
                    </p>
                  </div>
                  {sectionJavaConnections[index] && (
                    <details className="hash-definitions lesson-panel">
                      <summary>Java connection · this concept in code</summary>
                      <p>{sectionJavaConnections[index].text}</p>
                      <CodePanel lines={sectionJavaConnections[index].lines} />
                      <p className="hash-small">
                        Method-body excerpts; Map and collection types require
                        java.util imports. Complete source programs and their
                        output are preserved in Java Code Walkthroughs.
                      </p>
                      <div className="lesson-controls">
                        <button onClick={() => navigate(10)}>
                          Open Java Code Walkthroughs
                        </button>
                      </div>
                    </details>
                  )}
                  {index === 0 && <HashingApplications />}
                  {section.question && (
                    <PracticeQuestion question={section.question} />
                  )}
                  <p className="hash-transition">{section.next}</p>
                </LessonActiveContext.Provider>
              </section>
            );
          })}
          <div className="lesson-slide-topbar hash-section-footer">
            <button
              type="button"
              disabled={active === 0}
              onClick={() => navigate(active - 1)}
            >
              ← Previous section
            </button>
            <span className="hash-step">
              {active + 1} / {hashingSections.length}
            </span>
            <button
              type="button"
              disabled={active === hashingSections.length - 1}
              onClick={() => navigate(active + 1)}
            >
              Next section →
            </button>
          </div>
        </div>
        <div className="lesson-footer-navigation">
          <Link to="/learn" className="lesson-back">
            <span aria-hidden="true">{"<-"}</span>BACK TO LESSONS
          </Link>
        </div>
      </main>
    </>
  );
}
