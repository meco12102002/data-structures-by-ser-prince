import { useMemo, useState } from "react";
import { collisionMethods } from "../../../data/collisionLesson";
import { useLessonPlayback } from "../../../hooks/useLessonPlayback";
import { collisionGuide } from "../../../utils/collisionGuide";
import {
  chainOperation,
  collisionTrace,
  hashIndex,
  integer,
  openOperation,
  probeIndices,
} from "../../../utils/hashing";
import { BucketTable, Feedback, Field, Playback } from "./LessonUI";

const defaultKeys = [12, 27, 32];
const phaseNames = {
  ready: "Ready to begin",
  calculate: "Find the original bucket",
  collision: "Occupied — keep the existing key",
  empty: "An empty place",
  stored: "Key stored",
  blocked: "Insertion stopped safely",
};

export default function CollisionHandlingLab() {
  const [method, setMethod] = useState("chaining");
  const [size, setSize] = useState(5);
  const [input, setInput] = useState(defaultKeys.join(", "));
  const [keys, setKeys] = useState(defaultKeys);
  const [error, setError] = useState("");
  const [operation, setOperation] = useState("get");
  const [query, setQuery] = useState("32");
  const [traceMode, setTraceMode] = useState("insert");
  const player = useLessonPlayback(collisionGuide(keys, size, method).steps);
  const frame = player.frame;
  const guide = collisionMethods[method];
  const comparisons = useMemo(
    () =>
      Object.keys(collisionMethods).map((name) => ({
        name,
        ...collisionTrace(keys, size, name),
      })),
    [keys, size],
  );

  function configure(nextMethod, nextSize, nextKeys = keys, autoplay = false) {
    setMethod(nextMethod);
    setSize(nextSize);
    setKeys(nextKeys);
    setTraceMode("insert");
    player.replace(
      collisionGuide(nextKeys, nextSize, nextMethod).steps,
      autoplay,
    );
    setError("");
  }
  function applyKeys() {
    try {
      const values = input.split(",").map((value) => integer(value));
      if (!values.length || values.length > 12)
        throw new Error("Use 1 to 12 comma-separated integer keys.");
      if (new Set(values).size !== values.length)
        throw new Error("Use distinct keys so we can follow each new record.");
      configure(method, size, values);
    } catch (cause) {
      setError(cause.message);
    }
  }
  function queryTable() {
    try {
      const key = integer(query);
      const result =
        method === "chaining"
          ? chainOperation(frame.table, operation, key)
          : openOperation(frame.table, method, operation, key);
      setTraceMode(operation);
      player.replace(
        result.steps.map((step) => ({
          ...step,
          incomingKey: key,
          home: hashIndex(key, size),
        })),
        true,
      );
      setError("");
    } catch (cause) {
      setError(cause.message);
    }
  }
  const incoming = frame.incomingKey ?? keys[0];
  const home = frame.home;
  const path = frame.path || [];
  const isInsertion = traceMode === "insert";

  return (
    <div className="hash-lab lesson-panel">
      <div className="hash-grid-two">
        <div className="hash-panel lesson-panel">
          <h3>Choice 1 · Share the bucket</h3>
          <p>
            <strong>Chaining:</strong> keep the keys together in a list at the
            same bucket.
          </p>
        </div>
        <div className="hash-panel lesson-panel">
          <h3>Choice 2 · Find another bucket</h3>
          <p>
            <strong>Open addressing:</strong> keep one key per bucket and follow
            a rule to find another place.
          </p>
        </div>
      </div>
      <p>
        Start with Chaining, then switch to Linear probing. Follow the same keys
        [{keys.join(", ")}] and watch what changes.
      </p>
      <div className="hash-controls lesson-controls">
        <Field label="Collision method">
          <select
            value={method}
            onChange={(event) => configure(event.target.value, size)}
          >
            <optgroup label="Start with these two">
              {["chaining", "linear"].map((name) => (
                <option value={name} key={name}>
                  {collisionMethods[name].label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Then explore other search rules">
              {["quadratic", "double"].map((name) => (
                <option value={name} key={name}>
                  {collisionMethods[name].label}
                </option>
              ))}
            </optgroup>
          </select>
        </Field>
        <button
          onClick={() => {
            setInput(defaultKeys.join(", "));
            setQuery("32");
            setOperation("get");
            configure("chaining", 5, defaultKeys);
          }}
        >
          Reset
        </button>
      </div>
      <p>
        <strong>{guide.name}:</strong> {guide.rule}
        <br />
        {guide.analogy}
      </p>

      <div
        className="hash-grid-three"
        aria-label="Current operation"
        role="group"
      >
        <div className="hash-panel lesson-panel">
          <span className="section-label">
            {isInsertion
              ? "INCOMING KEY"
              : traceMode === "get"
                ? "SEARCH FOR KEY"
                : "DELETE KEY"}
          </span>
          <strong className="hash-stat">{incoming}</strong>
        </div>
        <div className="hash-panel lesson-panel">
          <span className="section-label">ORIGINAL BUCKET</span>
          <strong className="hash-stat">{home ?? "Calculate next"}</strong>
        </div>
        <div className="hash-panel lesson-panel">
          <span className="section-label">CURRENT STEP</span>
          <strong>
            {isInsertion
              ? phaseNames[frame.phase]
              : frame.index === null
                ? "Start with the key"
                : `Check bucket ${frame.index}`}
          </strong>
        </div>
      </div>
      {isInsertion && (
        <p className="hash-small">
          Keys in order:{" "}
          {keys
            .map(
              (key, index) =>
                `${key}${index === (frame.keyPosition ?? 0) ? " (current)" : ""}`,
            )
            .join(" → ")}{" "}
          · Stored so far: {frame.stored} / {keys.length}
        </p>
      )}
      <Feedback error={!!error}>{error || frame.message}</Feedback>
      {path.length > 0 && (
        <div
          className="hash-summary-flow"
          role="group"
          aria-label="Buckets checked for current key"
        >
          <span>BUCKETS CHECKED</span>
          {path.map((index, attempt) => (
            <span key={attempt}>
              {attempt + 1}. BUCKET {index}
            </span>
          ))}
        </div>
      )}
      <BucketTable
        table={frame.table}
        active={frame.index}
        activeKey={frame.key}
        open={method !== "chaining"}
        collision={frame.collision}
      />
      <Playback player={player} />
      <p className="hash-small">
        Use Next step to explain one move at a time. Previous step goes back;
        Play runs the example.
      </p>
      {isInsertion && player.step === player.last && (
        <Feedback>{guide.takeaway}</Feedback>
      )}

      <details className="hash-definitions lesson-panel">
        <summary>Show the formula and worked calculation</summary>
        <div className="hash-formula">
          {guide.formula}
          <span>
            k = key, m = bucket count; i starts at 0. Negative remainders are
            normalized.
          </span>
        </div>
        <p className="hash-small">
          For key {incoming}, the original bucket is {hashIndex(incoming, size)}
          .
          {method === "double" &&
            ` The jump size is 1 + ${hashIndex(incoming, size - 1)} = ${1 + hashIndex(incoming, size - 1)}.`}
        </p>
        {method !== "chaining" && (
          <p className="hash-small">
            Candidate buckets, in order:{" "}
            {probeIndices(incoming, size, method).join(" → ")}. Stop when an
            empty bucket is found; at most {size} checks are allowed.
          </p>
        )}
        {method === "quadratic" && (
          <p className="hash-small">
            Square offsets are measured from the original bucket. The sequence
            can revisit buckets and fail even if some other buckets are empty.
          </p>
        )}
      </details>

      <details className="hash-definitions lesson-panel">
        <summary>Try your own keys and table size</summary>
        <p>
          Use the same keys when changing methods to make the comparison easier.
        </p>
        <div className="hash-controls lesson-controls">
          <Field label="Prime table size">
            <select
              value={size}
              onChange={(event) =>
                configure(method, Number(event.target.value))
              }
            >
              {[5, 7, 11].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </Field>
          <Field label="Same input keys">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={140}
            />
          </Field>
          <button onClick={applyKeys}>Insert sequence</button>
        </div>
      </details>

      <details className="hash-definitions lesson-panel">
        <summary>Explore searching and deleting</summary>
        <p>
          Finish the insertion example first. Search follows the same bucket
          rule. In open addressing, a deleted key leaves a marker so later keys
          can still be found.
        </p>
        <div className="hash-controls lesson-controls">
          <Field label="Search or delete key">
            <input
              type="number"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </Field>
          <Field label="Operation">
            <select
              value={operation}
              onChange={(event) => setOperation(event.target.value)}
            >
              <option value="get">Search / traverse</option>
              <option value="remove">Delete / show marker</option>
            </select>
          </Field>
          <button onClick={queryTable} disabled={player.step !== player.last}>
            Trace on current table
          </button>
          <button onClick={() => configure(method, size)}>
            Replay insertions
          </button>
        </div>
      </details>

      <details className="hash-definitions lesson-panel">
        <summary>Compare the completed results of all four methods</summary>
        <div
          className="hash-table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Collision method comparison"
        >
          <table>
            <caption>
              Same keys [{keys.join(", ")}] · {size} buckets · completed runs
            </caption>
            <thead>
              <tr>
                <th>Method</th>
                <th>Stored keys</th>
                <th>Work*</th>
                <th>Final arrangement</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((result) => (
                <tr key={result.name}>
                  <th scope="row">{collisionMethods[result.name].name}</th>
                  <td>
                    {result.inserted}/{keys.length}
                  </td>
                  <td>{result.probes}</td>
                  <td>
                    {result.table
                      .map(
                        (bucket, index) =>
                          `${index}: ${result.name === "chaining" ? bucket.map((entry) => entry.key).join(" → ") || "∅" : (bucket?.key ?? "∅")}`,
                      )
                      .join(" | ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hash-small">
          *Chaining counts a bucket visit plus key comparisons; open addressing
          counts checked buckets. These work units help explain the steps, not
          which method is always fastest. Prime table sizes make our double-hash
          jump visit every bucket.
        </p>
      </details>
    </div>
  );
}
