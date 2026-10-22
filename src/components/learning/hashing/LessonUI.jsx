import { cloneElement, useId, useState } from "react";
import { TOMBSTONE } from "../../../utils/hashing";

export function Field({ label, children }) {
  const id = useId();
  return (
    <div className="hash-field lesson-field">
      <label htmlFor={id}>{label}</label>
      <span>{cloneElement(children, { id })}</span>
    </div>
  );
}

export function Feedback({ children, error = false }) {
  return (
    <div
      className={`hash-feedback lesson-callout ${error ? "hash-error" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="hash-feedback-label">
        {error ? "Check this" : "What happened"}
      </span>
      <div>{children}</div>
    </div>
  );
}

export function Playback({ player }) {
  return (
    <div
      className="hash-playback lesson-controls"
      role="group"
      aria-label="Animation playback"
    >
      <div className="hash-playback-main">
        <button onClick={player.previous} disabled={player.step === 0}>
          Previous step
        </button>
        <button
          className="hash-primary active"
          onClick={player.playing ? player.pause : player.play}
          disabled={player.last === 0}
        >
          {player.playing
            ? "Pause"
            : player.step === player.last
              ? "Replay"
              : "Play"}
        </button>
        <button onClick={player.next} disabled={player.step === player.last}>
          Next step
        </button>
        <button className="hash-secondary" onClick={player.restart}>
          Restart
        </button>
      </div>
      <label>
        Speed{" "}
        <select
          aria-label="Playback speed"
          value={player.speed}
          onChange={(event) => player.setSpeed(event.target.value)}
        >
          <option value={1800}>Slow</option>
          <option value={1000}>Normal</option>
          <option value={500}>Fast</option>
        </select>
      </label>
      <span className="hash-step">
        Step {player.step + 1} / {player.last + 1}
      </span>
    </div>
  );
}

export function BucketTable({
  table,
  active,
  activeKey,
  open = false,
  collision = false,
  onBucketClick,
}) {
  return (
    <div
      className={`hash-buckets ${open || table.length > 12 ? "hash-buckets-grid" : "hash-buckets-rows"} ${open ? "hash-buckets-open" : "hash-buckets-chained"}`}
      role="group"
      aria-label={open ? "Open addressing table" : "Chained hash table"}
    >
      {table.map((bucket, index) => {
        const bucketClass = `hash-bucket ${active === index ? (collision ? "hash-collision" : "is-active") : ""}`;
        const entries = open
          ? bucket && bucket !== TOMBSTONE
            ? [bucket]
            : []
          : bucket;
        const contents = (
          <>
            <span className="hash-bucket-index">
              BUCKET {index}
              {active === index
                ? collision
                  ? " · COLLISION"
                  : " · ACTIVE"
                : ""}
            </span>
            <div className="hash-chain">
              {entries.map((entry, position) => (
                <span
                  key={entry.key}
                  className={`hash-entry ${activeKey === entry.key && active === index ? "hash-entry-current" : ""}`}
                >
                  <b>{entry.key}</b>
                  {String(entry.value) !== String(entry.key) && (
                    <>
                      <span>→</span>
                      <em>{entry.value}</em>
                    </>
                  )}
                  {position < entries.length - 1 && (
                    <span aria-label="chain link"> ↪</span>
                  )}
                </span>
              ))}
              {!entries.length && (
                <span className="hash-empty">
                  {open && bucket === TOMBSTONE
                    ? "Deleted · keep probing"
                    : "Empty"}
                </span>
              )}
            </div>
          </>
        );
        return onBucketClick ? (
          <button
            key={index}
            className={bucketClass}
            onClick={() => onBucketClick(index)}
            aria-label={`Predict bucket ${index}`}
          >
            {contents}
          </button>
        ) : (
          <div key={index} className={bucketClass}>
            {contents}
          </div>
        );
      })}
    </div>
  );
}

export function Chips({ items, unordered = false }) {
  return (
    <div
      className={`hash-chips ${unordered ? "hash-unordered" : ""}`}
      role="group"
      aria-label={
        unordered
          ? "Contents only; positions do not represent Java iteration order"
          : "Collection contents"
      }
    >
      {items.length ? (
        items.map((item) => (
          <span
            className="hash-entry"
            key={typeof item === "object" ? item.key : item}
          >
            {typeof item === "object" ? (
              <>
                <b>{item.key}</b>
                <span>→</span>
                <em>{item.value}</em>
              </>
            ) : (
              <b>{item}</b>
            )}
          </span>
        ))
      ) : (
        <span className="hash-empty">Empty collection</span>
      )}
    </div>
  );
}

export function JavaLine({ code }) {
  const tokens = code.split(
    /("(?:[^"\\]|\\.)*"|\b(?:import|public|class|static|void|new|int|true|false|null|if|else|while|for|return|float|boolean)\b|\b\d+\b|\/\/.*)/g,
  );
  return (
    <>
      {tokens.map((token, index) => (
        <span
          key={index}
          className={
            token.startsWith('"')
              ? "java-string"
              : /^(import|public|class|static|void|new|int|true|false|null|if|else|while|for|return|float|boolean)$/.test(
                    token,
                  )
                ? "java-keyword"
                : /^\d+$/.test(token)
                  ? "java-number"
                  : token.startsWith("//")
                    ? "java-comment"
                    : ""
          }
        >
          {token}
        </span>
      ))}
    </>
  );
}

export function CodePanel({ lines, activeLine = -1 }) {
  return (
    <pre className="hash-code" tabIndex={0} aria-label="Java example">
      <code>
        {lines.map((line, index) => (
          <span
            className={`hash-code-line ${index === activeLine ? "is-active" : ""}`}
            key={index}
            aria-current={index === activeLine ? "step" : undefined}
          >
            <span className="hash-line-number" aria-hidden="true">
              {index + 1}
            </span>
            <JavaLine code={line} />
            {"\n"}
          </span>
        ))}
      </code>
    </pre>
  );
}

export function PracticeQuestion({ question, onCorrect }) {
  const [answer, setAnswer] = useState(null);
  return (
    <fieldset className="hash-question lesson-panel">
      <legend>{question.prompt}</legend>
      <div className="hash-answer-options lesson-controls">
        {question.options.map((option, index) => (
          <button
            type="button"
            className={
              answer === index
                ? index === question.answer
                  ? "answer-correct"
                  : "answer-wrong"
                : ""
            }
            key={option}
            onClick={() => {
              setAnswer(index);
              if (index === question.answer) onCorrect?.();
            }}
            aria-pressed={answer === index}
          >
            {option}
            {answer === index ? (index === question.answer ? " ✓" : " ↻") : ""}
          </button>
        ))}
      </div>
      {answer !== null && (
        <Feedback error={answer !== question.answer}>
          {answer === question.answer ? "Yes. " : "Try again. "}
          {question.explanation}
        </Feedback>
      )}
    </fieldset>
  );
}
