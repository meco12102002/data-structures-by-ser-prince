import { useState } from "react";
import {
  allocationStats,
  allocateKeys,
  javaResizeTrace,
  parseDesignKeys,
  repeatedSubtraction,
} from "../../../utils/hashDesign";
import { emptyTable, hashIndex } from "../../../utils/hashing";
import { useLessonPlayback } from "../../../hooks/useLessonPlayback";
import {
  BucketTable,
  CodePanel,
  Feedback,
  Field,
  Playback,
  PracticeQuestion,
} from "./LessonUI";

function AllocationNumbers({ table }) {
  const stats = allocationStats(table);
  return (
    <div className="hash-stats hash-allocation-stats">
      {[
        ["Stored entries", stats.entries],
        ["Buckets (m)", stats.buckets],
        ["Load factor", stats.load.toFixed(3)],
        ["Colliding entries", stats.collisions],
        ["Unused buckets", stats.unused],
      ].map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function CapacityAllocation({ table }) {
  if (table.length <= 23) return <BucketTable table={table} />;
  return (
    <div className="hash-capacity-view">
      <p className="hash-small">
        Capacity overview · each numbered cell is one bucket. Filled cells
        contain entries; outlined cells are empty.
      </p>
      <div
        className="hash-capacity-map"
        role="group"
        aria-label="Bucket capacity overview"
      >
        {table.map((bucket, index) => (
          <span
            role="img"
            key={index}
            className={bucket.length ? "is-occupied" : ""}
            aria-label={`Bucket ${index}: ${bucket.length ? `${bucket.length} stored ${bucket.length === 1 ? "entry" : "entries"}` : "empty"}`}
          >
            {index}
            <small>
              {bucket.length
                ? `${bucket.length} ${bucket.length === 1 ? "entry" : "entries"}`
                : "empty"}
            </small>
          </span>
        ))}
      </div>
      <details className="hash-definitions" key={table.length}>
        <summary>Inspect all {table.length} buckets and their entries</summary>
        <BucketTable table={table} />
      </details>
    </div>
  );
}

export function TableSizeSimulator() {
  const [size, setSize] = useState(5);
  const [keys, setKeys] = useState([12, 27, 32]);
  const [input, setInput] = useState("12, 27, 32");
  const [error, setError] = useState("");
  const table = allocateKeys(keys, size);
  const stats = allocationStats(table);
  function apply() {
    try {
      setKeys(parseDesignKeys(input));
      setError("");
    } catch (cause) {
      setError(cause.message);
    }
  }
  return (
    <div
      className="hash-lab lesson-panel"
      role="group"
      aria-label="Table size simulator"
    >
      <h3>Table size selection · allocate the same keys</h3>
      <p>
        <strong>Initial Size — handout:</strong> “Choose the number of buckets
        (m) carefully.” A small table can crowd keys together; a very large
        table can waste space. Change m and every key’s destination is
        recalculated immediately.
      </p>
      <div className="hash-controls lesson-controls hash-setup-controls">
        <Field label="Allocation bucket count">
          <select
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
          >
            {[5, 8, 10, 11, 16, 23, 47, 97].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </Field>
        <Field label="Allocation keys">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={180}
          />
        </Field>
        <button className="hash-primary active" onClick={apply}>
          Allocate keys
        </button>
        <button
          className="hash-secondary"
          onClick={() => {
            setSize(5);
            setKeys([12, 27, 32]);
            setInput("12, 27, 32");
            setError("");
          }}
        >
          Reset allocation
        </button>
      </div>
      <div
        className="hash-controls lesson-controls hash-scenarios"
        role="group"
        aria-label="Allocation scenarios"
      >
        <button aria-pressed={size === 5} onClick={() => setSize(5)}>
          Small table · 5
        </button>
        <button aria-pressed={size === 11} onClick={() => setSize(11)}>
          Larger table · 11
        </button>
        <button aria-pressed={size === 47} onClick={() => setSize(47)}>
          Lots of spare capacity · 47
        </button>
      </div>
      <AllocationNumbers table={table} />
      <div
        className="hash-summary-flow"
        role="group"
        aria-label="Current index calculations"
      >
        {keys.map((key) => (
          <span key={key}>
            {key} mod {size} = {hashIndex(key, size)}
          </span>
        ))}
      </div>
      <CapacityAllocation table={table} />
      <Feedback error={!!error}>
        {error ||
          `${keys.length} entries use ${stats.occupied} of ${size} buckets; ${stats.unused} buckets remain unused. ${stats.collisions ? "Different keys share indexes, producing collisions." : "These keys have different destinations."} More buckets consume more bucket-array space even when empty; this diagram counts positions, not exact bytes.`}
      </Feedback>
      <details className="hash-definitions lesson-panel">
        <summary>Prime vs non-prime sizes · same keys</summary>
        <p>
          Compare m = 10 (non-prime) with m = 11 (prime). Try keys 10, 20, 30,
          40 to see a regular key pattern interact with the divisor.
        </p>
        <button
          onClick={() => {
            setKeys([10, 20, 30, 40]);
            setInput("10, 20, 30, 40");
            setError("");
          }}
        >
          Try multiples of 10
        </button>
        <div className="hash-grid-two">
          {[10, 11].map((m) => (
            <div className="hash-panel lesson-panel" key={m}>
              <h3>
                {m === 11 ? "Prime" : "Non-prime"} · m = {m}
              </h3>
              <AllocationNumbers table={allocateKeys(keys, m)} />
              <BucketTable table={allocateKeys(keys, m)} />
            </div>
          ))}
        </div>
        <p>
          <strong>Handout statement:</strong> when using division-based hash
          functions, selecting m as a prime number “reduces clustering.”
        </p>
        <p>
          <strong>Clarification:</strong> prime sizes can help some
          division-based functions distribute patterned keys. They do not
          prevent every collision: 12 and 23 both give remainder 1 with m = 11.
          Java HashMap typically uses power-of-two capacities, not this
          prime-size policy.
        </p>
      </details>
      <PracticeQuestion
        question={{
          prompt:
            "A table has 3 entries and 47 buckets. What does that tell us?",
          options: [
            "All 47 buckets contain entries",
            "Many bucket positions are unused",
            "The table must grow immediately",
          ],
          answer: 1,
          explanation:
            "Capacity counts available bucket positions; size counts stored mappings. Extra capacity uses space and a low load factor alone does not require growth.",
        }}
      />
    </div>
  );
}

export function HashFunctionSelection() {
  const [property, setProperty] = useState("deterministic");
  const [stable, setStable] = useState(true);
  const [history, setHistory] = useState([]);
  const [pattern, setPattern] = useState("consecutive");
  const [key, setKey] = useState("43");
  const [computed, setComputed] = useState(43);
  const [error, setError] = useState("");
  const values =
    pattern === "consecutive" ? [10, 11, 12, 13, 14] : [0, 5, 10, 15, 20];
  const subtractions = repeatedSubtraction(computed, 5);
  return (
    <div
      className="hash-lab lesson-panel"
      role="group"
      aria-label="Hash function selection"
    >
      <h3>Hash function selection · why these three properties matter</h3>
      <p>
        <strong>Handout requirements:</strong> “Be deterministic”; “Distribute
        keys uniformly”; “Be fast to compute.” In simple terms: choose the same
        location again, spread entries out, and avoid unnecessary work.
      </p>
      <div className="hash-controls lesson-controls">
        <Field label="Hash function property">
          <select
            value={property}
            onChange={(event) => setProperty(event.target.value)}
          >
            <option value="deterministic">
              Deterministic · same key, same answer
            </option>
            <option value="uniform">Uniform distribution · spread keys</option>
            <option value="fast">Fast computation · avoid extra work</option>
          </select>
        </Field>
      </div>
      <div hidden={property !== "deterministic"}>
        <p>
          Key 27 was stored in bucket 2. Can we calculate that same location on
          the next lookup?
        </p>
        <div className="hash-controls lesson-controls">
          <Field label="Repeat calculation rule">
            <select
              value={stable ? "stable" : "changing"}
              onChange={(event) => {
                setStable(event.target.value === "stable");
                setHistory([]);
              }}
            >
              <option value="stable">27 mod 5 · stable rule</option>
              <option value="changing">
                Bad rule · change the answer each call
              </option>
            </select>
          </Field>
          <button
            onClick={() =>
              setHistory((current) => [
                ...current.slice(-4),
                stable ? 2 : ((current.at(-1) ?? 2) + 1) % 5,
              ])
            }
          >
            Hash the same key again
          </button>
          <button className="hash-secondary" onClick={() => setHistory([])}>
            Reset repeated calls
          </button>
        </div>
        <div className="hash-summary-flow">
          {history.map((index, i) => (
            <span key={i}>27 → bucket {index}</span>
          ))}
        </div>
        <BucketTable
          table={emptyTable(5).map((bucket, i) =>
            i === 2 ? [{ key: 27, value: "Stored record" }] : bucket,
          )}
          active={history.at(-1)}
        />
        <Feedback>
          {!history.length
            ? "Repeat the calculation to test whether lookup returns to bucket 2."
            : stable
              ? "The calculation points back to the stored record. A deterministic rule repeats the answer while the table size stays unchanged."
              : history.at(-1) === 2
                ? "This call happens to return to bucket 2, but earlier calls gave different answers. Coincidence does not make a changing rule deterministic."
                : `The changing rule points to bucket ${history.at(-1)}, but the record is in bucket 2. An inconsistent location breaks reliable lookup.`}
        </Feedback>
      </div>
      <div hidden={property !== "uniform"}>
        <div className="hash-controls lesson-controls">
          <Field label="Distribution dataset">
            <select
              value={pattern}
              onChange={(event) => setPattern(event.target.value)}
            >
              <option value="consecutive">10, 11, 12, 13, 14</option>
              <option value="multiples">0, 5, 10, 15, 20</option>
            </select>
          </Field>
        </div>
        <div className="hash-grid-two">
          {[
            ["constant", "Poor rule: always bucket 2"],
            ["modulo", "Division rule: k mod 5"],
          ].map(([mode, title]) => (
            <div className="hash-panel lesson-panel" key={mode}>
              <h3>{title}</h3>
              <p>
                {allocationStats(allocateKeys(values, 5, mode)).collisions}{" "}
                colliding entries
              </p>
              <BucketTable table={allocateKeys(values, 5, mode)} />
            </div>
          ))}
        </div>
        <Feedback>
          Both rules are deterministic. Distribution is a separate property: a
          constant rule crowds one bucket, and even modulo performs poorly for
          some key patterns. Choose a function suited to the expected keys.
        </Feedback>
      </div>
      <div hidden={property !== "fast"}>
        <div className="hash-controls lesson-controls">
          <Field label="Computation example key (0–100)">
            <input
              type="number"
              min={0}
              max={100}
              value={key}
              onChange={(event) => setKey(event.target.value)}
            />
          </Field>
          <button
            onClick={() => {
              try {
                repeatedSubtraction(key, 5);
                setComputed(Number(key));
                setError("");
              } catch (cause) {
                setError(cause.message);
              }
            }}
          >
            Compare computation
          </button>
        </div>
        <div className="hash-grid-two">
          <div className="hash-panel lesson-panel">
            <h3>Direct remainder</h3>
            <CodePanel lines={["return key % 5;"]} />
            <p>
              {computed} % 5 = {hashIndex(computed, 5)} · one remainder
              expression.
            </p>
          </div>
          <div className="hash-panel lesson-panel">
            <h3>Repeated subtraction</h3>
            <CodePanel
              lines={["while (key >= 5) { key -= 5; }", "return key;"]}
            />
            <p>
              {subtractions.join(" → ")} · {subtractions.length - 1}{" "}
              subtractions.
            </p>
          </div>
        </div>
        <Feedback error={!!error}>
          {error ||
            `Both give index ${hashIndex(computed, 5)}. These counts illustrate extra arithmetic work, not CPU timings. A good hash function should not make every access do unnecessary computation.`}
        </Feedback>
        <p className="hash-small">
          Java method-body excerpts for nonnegative integers. This comparison
          counts arithmetic actions only; loop tests and other runtime costs are
          excluded.
        </p>
      </div>
    </div>
  );
}

export function JavaResizeIllustration() {
  const player = useLessonPlayback(javaResizeTrace());
  const frame = player.frame;
  return (
    <div
      className="hash-lab lesson-panel"
      role="group"
      aria-label="Java HashMap resizing illustration"
    >
      <h3>Java connection · why the 13th entry triggers growth</h3>
      <p>
        Initial capacity 16, load factor 0.75: the usual threshold is 12
        mappings. A HashMap bucket can hold several entries. This predefined
        illustration chooses distinct, well-distributed Integer keys to isolate
        threshold-based growth; other collision patterns can cause earlier
        growth.
      </p>
      <div className="hash-controls lesson-controls">
        <button onClick={() => player.seek(12)}>Show 12 stored entries</button>
        <button className="hash-primary active" onClick={() => player.seek(13)}>
          Insert the 13th distinct entry
        </button>
        <button className="hash-secondary" onClick={player.restart}>
          Reset Java illustration
        </button>
      </div>
      <div className="hash-stats">
        {[
          ["Stored entries", frame.count],
          ["Bucket capacity", frame.capacity],
          ["Load factor", (frame.count / frame.capacity).toFixed(3)],
          ["Threshold", frame.threshold],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <Feedback>{frame.message}</Feedback>
      {frame.oldTable ? (
        <div className="hash-grid-two">
          <div className="hash-panel lesson-panel">
            <h3>Old buckets · entries still to transfer</h3>
            <BucketTable table={frame.oldTable} />
          </div>
          <div className="hash-panel lesson-panel">
            <h3>New buckets · entries transferred</h3>
            <BucketTable
              table={frame.table}
              active={frame.index}
              activeKey={frame.key}
            />
          </div>
        </div>
      ) : (
        <BucketTable
          table={frame.table}
          active={frame.index}
          activeKey={frame.key}
        />
      )}
      <Playback player={player} />
      <CodePanel
        lines={[
          "HashMap<Integer, String> map = new HashMap<>(16, 0.75f);",
          "// 12 distinct mappings: threshold reached, not exceeded.",
          'map.put(205, "Record 13");',
          "// Resizing occurs during put(); the target becomes 32 buckets.",
        ]}
        activeLine={
          frame.kind === "ready"
            ? 0
            : frame.count < 13
              ? 1
              : frame.kind === "trigger"
                ? 2
                : 3
        }
      />
      <p className="hash-small">
        Conceptual pause points, not a Java runtime. Modern HashMap
        redistributes stored hashes using power-of-two capacities; the handout’s
        general rehashing model recalculates indexes. For these small Integer
        keys, the diagram uses Java’s spread hash and index = spreadHash &amp;
        (capacity − 1). During transfer, the entry count includes both tables.
      </p>
      <div className="hash-reference-links">
        <a
          href="https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html"
          target="_blank"
          rel="noreferrer"
        >
          Oracle · HashMap capacity and load factor ↗
        </a>
        <a
          href="https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/HashMap.java"
          target="_blank"
          rel="noreferrer"
        >
          OpenJDK · resizing implementation ↗
        </a>
      </div>
      <PracticeQuestion
        question={{
          prompt:
            "After growing to 32 buckets, how many mappings does this example contain?",
          options: ["13 entries", "32 entries", "One entry for every bucket"],
          answer: 0,
          explanation:
            "Resizing changes capacity, not the number of mappings. All 13 entries are preserved, with spare bucket positions available.",
        }}
      />
    </div>
  );
}
