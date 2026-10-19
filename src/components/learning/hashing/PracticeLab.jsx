import { useState } from "react";
import {
  finalQuestions,
  practiceLevels,
  summaryRows,
} from "../../../data/hashingLesson";
import { Feedback, PracticeQuestion } from "./LessonUI";

export function PracticeLab() {
  const [level, setLevel] = useState(0);
  const [solved, setSolved] = useState([]);
  const [version, setVersion] = useState(0);
  const total = practiceLevels.reduce(
    (count, item) => count + item.questions.length,
    0,
  );
  function correct(id) {
    setSolved((current) => (current.includes(id) ? current : [...current, id]));
  }
  return (
    <div className="hash-lab lesson-panel">
      <div
        className="hash-controls lesson-controls"
        role="group"
        aria-label="Practice levels"
      >
        {practiceLevels.map((item, index) => (
          <button
            key={item.title}
            className={index === level ? "hash-primary active" : ""}
            onClick={() => setLevel(index)}
            aria-pressed={index === level}
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="hash-stat">
        {solved.length} / {total} activities solved
      </p>
      <progress
        aria-label="Practice questions solved"
        max={total}
        value={solved.length}
      />
      {practiceLevels[level].questions.map((question, index) => (
        <PracticeQuestion
          key={`${version}-${level}-${index}`}
          question={question}
          onCorrect={() => correct(`${level}-${index}`)}
        />
      ))}
      <div className="hash-controls lesson-controls">
        <button
          disabled={level === 0}
          onClick={() => setLevel((current) => current - 1)}
        >
          Previous level
        </button>
        <button
          disabled={level === practiceLevels.length - 1}
          onClick={() => setLevel((current) => current + 1)}
        >
          Next level
        </button>
        <button
          onClick={() => {
            setLevel(0);
            setSolved([]);
            setVersion((current) => current + 1);
          }}
        >
          Reset practice
        </button>
      </div>
      {solved.length === total && (
        <Feedback>
          All five levels completed. You have practiced recognition,
          calculation, prediction, code reading, and collection choice.
        </Feedback>
      )}
    </div>
  );
}

export function FinalReview({ allVisited, complete, onComplete }) {
  const [solved, setSolved] = useState([]);
  const [version, setVersion] = useState(0);
  return (
    <div className="hash-lab lesson-panel">
      <div
        className="hash-table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Hashing and collections reference"
      >
        <table>
          <caption>Your collection and hashing reference</caption>
          <thead>
            <tr>
              <th>Concept</th>
              <th>Core behavior</th>
              <th>Remember</th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th scope="row" key={cell}>
                      {cell}
                    </th>
                  ) : (
                    <td key={cell}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="hash-summary-flow">
        <span>KEY</span>
        <b>→</b>
        <span>HASH</span>
        <b>→</b>
        <span>BUCKET</span>
        <b>→</b>
        <span>COMPARE KEYS</span>
        <b>→</b>
        <span>VALUE</span>
      </div>
      <h3>
        Final knowledge check · {solved.length}/{finalQuestions.length}{" "}
        understood
      </h3>
      {finalQuestions.map((question, index) => (
        <PracticeQuestion
          key={`${version}-${index}`}
          question={question}
          onCorrect={() =>
            setSolved((current) =>
              current.includes(index) ? current : [...current, index],
            )
          }
        />
      ))}
      <div className="hash-controls lesson-controls">
        <button
          className="hash-primary active"
          disabled={
            solved.length !== finalQuestions.length || !allVisited || complete
          }
          onClick={() => onComplete(true)}
        >
          {complete ? "Lesson completed ✓" : "Complete lesson"}
        </button>
        <button
          onClick={() => {
            setSolved([]);
            setVersion((current) => current + 1);
            onComplete(false);
          }}
        >
          Retry final check
        </button>
      </div>
      <Feedback>
        {complete
          ? "Lesson complete. You can now explain hashing, handle collisions, and choose between Sets and Maps. Revisit any lab whenever you need a refresher."
          : !allVisited
            ? "Visit each of the 13 sections and answer all final questions correctly to mark this lesson complete."
            : "Answer every final question correctly, then mark the lesson complete. You can retry each question."}
      </Feedback>
      <details className="hash-definitions lesson-panel">
        <summary>Course handout and Java references</summary>
        <p>
          Primary course source: IT2503 — 05 Handout 1, Hashing, Sets, and Maps
          (9 pages). Each lesson section includes page references. The labs
          extend the examples; handout clarifications explain corrections to the
          original text.
        </p>
        <p>Check the public APIs and their ordering guarantees:</p>
        <div className="hash-reference-links">
          {["HashMap", "HashSet", "TreeSet", "TreeMap", "LinkedHashMap"].map(
            (name) => (
              <a
                key={name}
                href={`https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/${name}.html`}
                target="_blank"
                rel="noreferrer"
              >
                Oracle · {name} ↗
              </a>
            ),
          )}
        </div>
      </details>
    </div>
  );
}
