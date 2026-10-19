import { useState } from "react";
import { useLessonPlayback } from "../../../hooks/useLessonPlayback";
import {
  chainOperation,
  collisionCount,
  emptyTable,
  hashIndex,
  integer,
  loadFactor,
  rehash,
  tableEntries,
} from "../../../utils/hashing";
import { BucketTable, CodePanel, Feedback, Field, Playback } from "./LessonUI";

const students = [
  { key: 12, value: "Ana" },
  { key: 27, value: "John" },
  { key: 32, value: "Kim" },
  { key: 41, value: "Mark" },
  { key: 53, value: "Rina" },
  ...Array.from({ length: 15 }, (_, i) => ({
    key: 60 + i * 7,
    value: `Student ${i + 6}`,
  })),
];

function searchFrames(records, key) {
  const table = emptyTable(5);
  records.forEach((record) => table[hashIndex(record.key, 5)].push(record));
  const index = records.findIndex((record) => record.key === key);
  const sequential = [
    { comparisons: 0, current: null, message: "Start at the first record." },
    ...records.slice(0, index + 1).map((record, i) => ({
      comparisons: i + 1,
      current: record.key,
      message:
        record.key === key
          ? `Found ${record.value} after ${i + 1} comparisons.`
          : `Check ${record.key}: not a match.`,
    })),
  ];
  const hashed = chainOperation(table, "get", key).steps;
  return Array.from(
    { length: Math.max(sequential.length, hashed.length) },
    (_, i) => ({
      sequential: sequential[Math.min(i, sequential.length - 1)],
      hashed: hashed[Math.min(i, hashed.length - 1)],
    }),
  );
}

export function StudentSearch() {
  const [count, setCount] = useState(5);
  const [target, setTarget] = useState(32);
  const records = students.slice(0, count);
  const player = useLessonPlayback(searchFrames(records, target));
  const { sequential, hashed } = player.frame;
  function configure(nextCount, nextTarget) {
    setCount(nextCount);
    setTarget(nextTarget);
    player.replace(searchFrames(students.slice(0, nextCount), nextTarget));
  }
  return (
    <div className="hash-lab lesson-panel">
      <div className="hash-controls lesson-controls">
        <Field label="Find student">
          <select
            value={target}
            onChange={(event) => configure(count, Number(event.target.value))}
          >
            {records.map((record) => (
              <option value={record.key} key={record.key}>
                #{record.key} — {record.value}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Dataset size">
          <select
            value={count}
            onChange={(event) => configure(Number(event.target.value), 32)}
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size} records
              </option>
            ))}
          </select>
        </Field>
        <button
          onClick={() => player.replace(searchFrames(records, target), true)}
        >
          Start comparison
        </button>
        <button onClick={() => configure(5, 32)}>Reset</button>
      </div>
      <div className="hash-grid-two">
        <div className="hash-panel lesson-panel">
          <h3>A · Sequential search</h3>
          <strong className="hash-stat">
            {sequential.comparisons} key comparisons
          </strong>
          <div className="hash-records">
            {records.map((record) => (
              <div
                className={`hash-entry ${sequential.current === record.key ? "hash-entry-current" : ""}`}
                key={record.key}
              >
                <b>#{record.key}</b>
                <em>{record.value}</em>
              </div>
            ))}
          </div>
          <p>{sequential.message}</p>
        </div>
        <div className="hash-panel lesson-panel">
          <h3>B · Hash-based lookup</h3>
          <strong className="hash-stat">
            {hashed.comparisons} key comparisons
          </strong>
          <p>
            First calculate the index; then compare keys within the selected
            bucket.
          </p>
          <BucketTable
            table={hashed.table}
            active={hashed.index}
            activeKey={hashed.key}
          />
          <p>{hashed.message}</p>
        </div>
      </div>
      <Playback player={player} />
      <Feedback>
        Target: #{target}. {sequential.message} {hashed.message} Counters count
        key comparisons, not the separate hash calculation.
      </Feedback>
    </div>
  );
}

function functionFrames(key, size) {
  const index = hashIndex(key, size);
  return [
    { stage: 0, message: `Input key k = ${key}.` },
    { stage: 1, message: `Apply h(k) = normalizedMod(k, ${size}).` },
    {
      stage: 2,
      message: `${key} mod ${size} → ${index}${key < 0 ? " after normalizing the remainder" : ""}.`,
    },
    {
      stage: 3,
      index,
      message: `Select bucket ${index}. Valid indexes are 0 through ${size - 1}.`,
    },
  ].map((frame) => ({ ...frame, key, size, result: index }));
}

export function HashFunctionPlayground() {
  const [key, setKey] = useState("27");
  const [size, setSize] = useState(10);
  const [error, setError] = useState("");
  const [prediction, setPrediction] = useState(null);
  const player = useLessonPlayback(functionFrames(27, 10));
  function calculate(random = false) {
    try {
      const nextKey = random ? Math.floor(Math.random() * 100) : integer(key);
      if (random) setKey(String(nextKey));
      player.replace(functionFrames(nextKey, size), true);
      setError("");
    } catch (cause) {
      setError(cause.message);
    }
  }
  return (
    <div className="hash-lab lesson-panel">
      <div className="hash-controls lesson-controls">
        <Field label="Integer key">
          <input
            type="number"
            step="1"
            value={key}
            onChange={(event) => {
              setKey(event.target.value);
              setError("");
              player.replace([
                {
                  stage: -1,
                  message: "Key changed. Calculate to begin a new trace.",
                },
              ]);
            }}
          />
        </Field>
        <Field label="Bucket count">
          <select
            value={size}
            onChange={(event) => {
              const nextSize = Number(event.target.value);
              setSize(nextSize);
              player.replace([
                {
                  stage: -1,
                  message:
                    "Table size changed. Calculate to begin a new trace.",
                },
              ]);
            }}
          >
            {[5, 7, 10, 11].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </Field>
        <button className="hash-primary active" onClick={() => calculate()}>
          Calculate
        </button>
        <button onClick={() => calculate(true)}>Random example</button>
        <button
          onClick={() => {
            setKey("27");
            setSize(10);
            setError("");
            setPrediction(null);
            player.replace(functionFrames(27, 10));
          }}
        >
          Reset
        </button>
      </div>
      <div className="hash-pipeline">
        {["KEY", "HASH FUNCTION", "INDEX", "BUCKET"].map((stage, index) => (
          <div
            className={player.frame.stage === index ? "is-active" : ""}
            key={stage}
          >
            <span>
              {index + 1} · {stage}
            </span>
            <strong>
              {index === 0
                ? key || "?"
                : index === 1
                  ? `k mod ${size}`
                  : player.frame.stage >= 2
                    ? player.frame.result
                    : "?"}
            </strong>
          </div>
        ))}
      </div>
      <BucketTable table={emptyTable(size)} active={player.frame.index} />
      <Playback player={player} />
      <Feedback error={!!error}>{error || player.frame.message}</Feedback>
      <div className="hash-predict">
        <h3>Predict before revealing</h3>
        <p>Key 32, table size 5. Click its destination bucket.</p>
        <BucketTable
          table={emptyTable(5)}
          active={prediction}
          onBucketClick={setPrediction}
        />
        {prediction !== null && (
          <Feedback error={prediction !== 2}>
            {prediction === 2 ? "Yes: " : "Try again: "}32 = 6 × 5 + 2, so
            bucket 2 receives this key.
          </Feedback>
        )}
      </div>
    </div>
  );
}

export function HashTableSimulator() {
  const [table, setTable] = useState(emptyTable(5));
  const [key, setKey] = useState("12");
  const [value, setValue] = useState("Ana");
  const [operation, setOperation] = useState("put");
  const [error, setError] = useState("");
  const player = useLessonPlayback([
    {
      table: emptyTable(5),
      message: "Insert your first key-value pair.",
      index: null,
    },
  ]);
  const busy = player.step < player.last;
  const code = [
    'map.put("apple", 10);',
    'map.get("apple");',
    'map.containsKey("apple");',
    'map.remove("apple");',
  ];
  const operations = ["put", "get", "containsKey", "remove"];
  function run() {
    try {
      if (operation === "put" && !value.trim())
        throw new Error("Enter a value first.");
      const result = chainOperation(table, operation, key, value.trim());
      setTable(result.table);
      player.replace(result.steps, true);
      setError("");
    } catch (cause) {
      setError(cause.message);
    }
  }
  return (
    <div className="hash-lab lesson-panel">
      <p className="hash-model-label">
        SIMPLIFIED INTEGER-KEY TABLE · CHAINING · 5 BUCKETS
      </p>
      <div className="hash-operation-layout">
        <div className="hash-panel lesson-panel">
          <h3>1 · Input</h3>
          <Field label="Integer key">
            <input
              type="number"
              value={key}
              disabled={busy}
              onChange={(event) => setKey(event.target.value)}
            />
          </Field>
          <Field label="Value">
            <input
              value={value}
              maxLength={40}
              disabled={busy}
              onChange={(event) => setValue(event.target.value)}
            />
          </Field>
          <Field label="Operation">
            <select
              value={operation}
              disabled={busy}
              onChange={(event) => setOperation(event.target.value)}
            >
              <option value="put">Insert / update</option>
              <option value="get">Retrieve</option>
              <option value="containsKey">Check key</option>
              <option value="remove">Delete</option>
            </select>
          </Field>
          <button className="hash-primary active" disabled={busy} onClick={run}>
            Run operation
          </button>
          <button
            onClick={() => {
              const next = emptyTable(5);
              setTable(next);
              player.replace([
                {
                  table: next,
                  index: null,
                  message: "Table reset. Insert a pair to begin.",
                },
              ]);
              setError("");
            }}
          >
            Reset table
          </button>
        </div>
        <div className="hash-panel lesson-panel">
          <h3>2 · Storage</h3>
          <BucketTable
            table={player.frame.table}
            active={player.frame.index}
            activeKey={player.frame.key}
            collision={player.frame.collision}
          />
        </div>
        <div className="hash-panel lesson-panel">
          <h3>3 · Explanation</h3>
          <Feedback error={!!error}>{error || player.frame.message}</Feedback>
          <p>
            {player.frame.index !== null
              ? `Calculated index: ${player.frame.index}`
              : "Calculate the bucket first."}
          </p>
          <p>Entries visible: {tableEntries(player.frame.table).length}</p>
          <p className="hash-small">
            Java connection: these string-key statements show the corresponding
            public API, not this simulator’s integer hash calculation.
          </p>
          <CodePanel lines={code} activeLine={operations.indexOf(operation)} />
        </div>
      </div>
      <Playback player={player} />
    </div>
  );
}

export function CollisionDiscovery() {
  const [stage, setStage] = useState(0);
  const [prediction, setPrediction] = useState(null);
  const keys = [12, 27, 32];
  let table = emptyTable(5);
  keys.slice(0, stage).forEach((key, index) => {
    table = chainOperation(table, "put", key, ["A", "B", "C"][index]).table;
  });
  return (
    <div className="hash-lab lesson-panel">
      <div className="hash-pipeline">
        {keys.map((key) => (
          <div
            className={stage && keys[stage - 1] === key ? "is-active" : ""}
            key={key}
          >
            <span>KEY {key}</span>
            <strong>{key} mod 5 = 2</strong>
          </div>
        ))}
      </div>
      <BucketTable
        table={table}
        active={stage ? 2 : null}
        activeKey={keys[stage - 1]}
        collision={stage > 1}
      />
      {stage === 1 && (
        <div className="hash-predict">
          <h3>Bucket 2 is occupied. Predict what should happen to 27.</h3>
          <div className="hash-controls lesson-controls">
            {[
              "Discard 12",
              "Keep both keys retrievable",
              "Treat 27 as key 12",
            ].map((answer, index) => (
              <button
                key={answer}
                onClick={() => setPrediction(index)}
                aria-pressed={prediction === index}
              >
                {answer}
              </button>
            ))}
          </div>
          {prediction !== null && (
            <Feedback error={prediction !== 1}>
              {prediction === 1 ? "Yes. " : "Try again. "}Different keys must
              remain retrievable. We will keep them in a chain in bucket 2.
            </Feedback>
          )}
        </div>
      )}
      <div className="hash-controls lesson-controls">
        <button
          className="hash-primary active"
          disabled={stage === 3 || (stage === 1 && prediction !== 1)}
          onClick={() => setStage((current) => current + 1)}
        >
          {stage === 3 ? "All keys stored" : `Insert ${keys[stage]}`}
        </button>
        <button
          onClick={() => {
            setStage(0);
            setPrediction(null);
          }}
        >
          Reset & replay
        </button>
      </div>
      <Feedback>
        {stage === 0
          ? "Start with an empty table. Insert 12 first."
          : stage === 1
            ? "12 occupies bucket 2. Predict before adding the next key."
            : `COLLISION: ${keys[stage - 1]} shares bucket 2 with another key. Chaining keeps ${stage} distinct keys retrievable.`}
      </Feedback>
    </div>
  );
}

export function LoadFactorSimulator() {
  const [table, setTable] = useState(emptyTable(5));
  const [key, setKey] = useState("12");
  const [threshold, setThreshold] = useState(0.75);
  const [error, setError] = useState("");
  const player = useLessonPlayback([
    {
      table: emptyTable(5),
      index: null,
      message: "Insert keys and watch occupancy change.",
    },
  ]);
  const current = player.frame.table;
  const needsResize = loadFactor(table) > threshold;
  const busy = player.step !== player.last;
  function insert() {
    try {
      const result = chainOperation(table, "put", key, String(integer(key)));
      setTable(result.table);
      player.replace(result.steps, true);
      setError("");
      if (Number(key) < Number.MAX_SAFE_INTEGER - 5)
        setKey(String(Number(key) + 5));
    } catch (cause) {
      setError(cause.message);
    }
  }
  function resize() {
    const size = [11, 23, 47, 97].find((n) => n > table.length);
    if (!size) {
      setError(
        "This classroom demo is limited to 97 buckets. Reset to try a different dataset.",
      );
      return;
    }
    const result = rehash(table, size);
    setTable(result.table);
    player.replace(result.steps, true);
    setError("");
  }
  return (
    <div className="hash-lab lesson-panel">
      <div className="hash-controls lesson-controls">
        <Field label="Integer key">
          <input
            type="number"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            disabled={busy || needsResize}
          />
        </Field>
        <Field label="Growth threshold">
          <select
            value={threshold}
            disabled={busy}
            onChange={(event) => setThreshold(Number(event.target.value))}
          >
            <option value={0.5}>0.50</option>
            <option value={0.75}>0.75</option>
            <option value={1}>1.00</option>
          </select>
        </Field>
        <button onClick={insert} disabled={busy || needsResize}>
          Insert key
        </button>
        <button
          onClick={() => {
            const next = emptyTable(5);
            setTable(next);
            setKey("12");
            setThreshold(0.75);
            setError("");
            player.replace([
              {
                table: next,
                message: "Table reset to 5 buckets.",
                index: null,
              },
            ]);
          }}
        >
          Reset
        </button>
      </div>
      <div className="hash-stats">
        {[
          ["Entries", tableEntries(current).length],
          ["Buckets", current.length],
          ["Load factor α", loadFactor(current).toFixed(2)],
          ["Colliding entries*", collisionCount(current)],
        ].map(([name, value]) => (
          <div key={name}>
            <span>{name}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <label className="hash-meter-label">
        Occupancy relative to buckets{" "}
        <meter
          min="0"
          max={Math.max(1, loadFactor(current))}
          value={loadFactor(current)}
        >
          {loadFactor(current)}
        </meter>
      </label>
      {needsResize && !busy && (
        <div className="hash-warning">
          <h3>Pause and observe: α exceeds {threshold}.</h3>
          <p>
            More buckets may reduce crowding at the cost of extra memory.
            Recalculate every key’s index in a larger table.
          </p>
          <button className="hash-primary active" onClick={resize}>
            Begin step-by-step rehash
          </button>
        </div>
      )}
      {player.frame.oldTable ? (
        <div className="hash-grid-two">
          <div className="hash-panel lesson-panel">
            <h3>Old table · entries still to move</h3>
            <BucketTable table={player.frame.oldTable} />
          </div>
          <div className="hash-panel lesson-panel">
            <h3>New table · recalculated indexes</h3>
            <BucketTable
              table={current}
              active={player.frame.index}
              activeKey={player.frame.key}
            />
          </div>
        </div>
      ) : (
        <BucketTable
          table={current}
          active={player.frame.index}
          activeKey={player.frame.key}
        />
      )}
      <Playback player={player} />
      <Feedback error={!!error}>{error || player.frame.message}</Feedback>
      <p className="hash-small">
        *Colliding entries counts entries beyond the first in each chain. During
        rehashing, counters describe the new table as entries move from the old
        table.
      </p>
    </div>
  );
}
