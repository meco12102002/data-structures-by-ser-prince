import { useState } from "react";
import { reorderEntries } from "../../../utils/hashDesign";
import { integer, mapOperation, setOperation } from "../../../utils/hashing";
import { Chips, CodePanel, Feedback, Field } from "./LessonUI";

export function SetPlayground() {
  const [items, setItems] = useState([]);
  const [value, setValue] = useState("Apple");
  const [feedback, setFeedback] = useState(
    "Add Apple, Banana, Apple, then Grape. Watch the size.",
  );
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [code, setCode] = useState("HashSet<String> fruits = new HashSet<>();");
  function run(operation, nextValue = value) {
    try {
      const result = setOperation(items, operation, nextValue.trim());
      setItems(result.items);
      setFeedback(result.message);
      setError(false);
      setAttempt((current) => current + 1);
      setCode(
        operation === "clear"
          ? "fruits.clear();"
          : `fruits.${operation}(${JSON.stringify(nextValue.trim())});`,
      );
    } catch (cause) {
      setError(true);
      setFeedback(cause.message);
    }
  }
  return (
    <div className="hash-lab lesson-panel">
      <div className="hash-controls lesson-controls">
        <Field label="Element (case-sensitive)">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            maxLength={40}
          />
        </Field>
        {["add", "remove", "contains", "clear"].map((operation) => (
          <button key={operation} onClick={() => run(operation)}>
            {operation === "contains"
              ? "Check membership"
              : operation[0].toUpperCase() + operation.slice(1)}
          </button>
        ))}
      </div>
      <div
        className="hash-controls lesson-controls"
        aria-label="Fruit examples"
      >
        {["Apple", "Banana", "Grape"].map((fruit) => (
          <button
            onClick={() => {
              setValue(fruit);
              run("add", fruit);
            }}
            key={fruit}
          >
            + {fruit}
          </button>
        ))}
      </div>
      <div className="hash-panel lesson-panel" key={attempt}>
        <h3>Set membership · size {items.length}</h3>
        <Chips items={items} unordered />
        <p className="hash-small">
          Contents only. These positions do not promise a HashSet iteration
          order.
        </p>
      </div>
      <Feedback error={error}>{feedback}</Feedback>
      <CodePanel
        lines={[
          "import java.util.HashSet;",
          "HashSet<String> fruits = new HashSet<>();",
          ...(code.startsWith("HashSet") ? [] : [code]),
        ]}
        activeLine={2}
      />
      <p className="hash-small">
        Java API excerpt: place the declaration and operation inside a method.
        Complete programs are in the walkthrough section.
      </p>
    </div>
  );
}

function OrderedTree({ values }) {
  if (!values.length) return null;
  const middle = Math.floor(values.length / 2);
  return (
    <li>
      <span className="hash-tree-node">{values[middle]}</span>
      {values.length > 1 && (
        <ul>
          {values.slice(0, middle).length > 0 && (
            <OrderedTree values={values.slice(0, middle)} />
          )}
          {values.slice(middle + 1).length > 0 && (
            <OrderedTree values={values.slice(middle + 1)} />
          )}
        </ul>
      )}
    </li>
  );
}

export function SetComparison() {
  const [items, setItems] = useState([]);
  const [value, setValue] = useState("50");
  const [feedback, setFeedback] = useState(
    "Add 50, 10, 30, then try 10 again.",
  );
  const [error, setError] = useState(false);
  const [code, setCode] = useState("// Both sets start empty.");
  const sorted = [...items].sort((a, b) => a - b);
  function run(operation, input = value) {
    try {
      const number = integer(input, "Element");
      if (number < -2147483648 || number > 2147483647)
        throw new Error("Use a Java int: −2147483648 to 2147483647.");
      if (operation === "add" && items.length >= 15 && !items.includes(number))
        throw new Error(
          "This tree diagram supports 15 unique values. Remove one or reset.",
        );
      const result = setOperation(items, operation, number);
      setItems(result.items);
      setFeedback(result.message);
      setError(false);
      setCode(
        `hashSet.${operation}(${number});\ntreeSet.${operation}(${number});`,
      );
    } catch (cause) {
      setFeedback(cause.message);
      setError(true);
    }
  }
  return (
    <div className="hash-lab lesson-panel">
      <div className="hash-controls lesson-controls">
        <Field label="Integer element">
          <input
            type="number"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Field>
        <button onClick={() => run("add")}>Add to both</button>
        <button onClick={() => run("remove")}>Remove from both</button>
        <button
          disabled={!items.length}
          onClick={() => run("add", String(items[0]))}
        >
          Insert duplicate
        </button>
        <button
          onClick={() => {
            setFeedback(
              "Same members; TreeSet sorts them. HashSet makes no iteration-order promise.",
            );
            setError(false);
          }}
        >
          Compare
        </button>
        <button
          onClick={() => {
            setItems([]);
            setValue("50");
            setCode("// Both sets start empty.");
            setError(false);
            setFeedback("Both sets reset. Try 50, 10, 30, 10.");
          }}
        >
          Reset
        </button>
      </div>
      <div className="hash-controls lesson-controls">
        {[50, 10, 30].map((number) => (
          <button
            key={number}
            onClick={() => {
              setValue(String(number));
              run("add", String(number));
            }}
          >
            + {number}
          </button>
        ))}
      </div>
      <div className="hash-grid-two">
        <div className="hash-panel lesson-panel">
          <h3>HashSet</h3>
          <p>Hash-based · unique elements</p>
          <Chips items={items} unordered />
          <p>No guaranteed iteration order. Positions show membership only.</p>
          <CodePanel
            lines={[
              "HashSet<Integer> hashSet = new HashSet<>();",
              code.split("\n")[0],
            ]}
          />
        </div>
        <div className="hash-panel lesson-panel">
          <h3>TreeSet</h3>
          <p>Tree-based · sorted by default</p>
          <Chips items={sorted} />
          <div
            className="hash-tree"
            role="group"
            aria-label="Simplified ordered tree"
          >
            <ul>
              <OrderedTree values={sorted} />
            </ul>
          </div>
          <p className="hash-small">
            Illustrative ordered tree, rebuilt for readability. Java maintains
            its own balanced tree.
          </p>
          <CodePanel
            lines={[
              "TreeSet<Integer> treeSet = new TreeSet<>();",
              code.split("\n")[1] || "// Both sets start empty.",
            ]}
          />
        </div>
      </div>
      <Feedback error={error}>{feedback}</Feedback>
    </div>
  );
}

const initialStudents = [
  { key: "2026001", value: "Ana Reyes" },
  { key: "2026002", value: "John Cruz" },
  { key: "2026003", value: "Kim Santos" },
];
const initialProducts = [
  { key: "banana", value: "20" },
  { key: "apple", value: "10" },
  { key: "grape", value: "30" },
];

export function MapPlayground({ compare = false }) {
  const initial = compare ? initialProducts : initialStudents;
  const [entries, setEntries] = useState(initial);
  const [key, setKey] = useState(compare ? "banana" : "2026001");
  const [value, setValue] = useState(compare ? "25" : "Ana Santos");
  const [operation, setOperation] = useState("put");
  const [feedback, setFeedback] = useState(
    "Update an existing key, then try a new one.",
  );
  const [error, setError] = useState(false);
  const [statement, setStatement] = useState("// Select an operation.");
  function run() {
    try {
      let nextValue = value.trim();
      if (compare && operation === "put") {
        const number = integer(nextValue, "Price");
        if (number < -2147483648 || number > 2147483647)
          throw new Error("Use a price within the Java int range.");
        nextValue = String(number);
      }
      const result = mapOperation(entries, operation, key.trim(), nextValue);
      setEntries(result.entries);
      setFeedback(result.message);
      setError(false);
      setStatement(
        `map.${operation}(${JSON.stringify(key.trim())}${operation === "put" ? `, ${compare ? nextValue : JSON.stringify(nextValue)}` : ""});`,
      );
    } catch (cause) {
      setFeedback(cause.message);
      setError(true);
    }
  }
  const sorted = [...entries].sort((a, b) =>
    a.key < b.key ? -1 : a.key > b.key ? 1 : 0,
  );
  const variants = compare
    ? [
        ["HashMap", "No guaranteed iteration order", entries],
        ["TreeMap", "Sorted keys by default", sorted],
        ["LinkedHashMap", "Insertion order by default", entries],
      ]
    : [];
  function moveEntry(entryKey, direction) {
    const next = reorderEntries(entries, entryKey, direction);
    setEntries(next);
    setFeedback(
      "Rebuilt all three maps using the new insertion order. TreeMap still sorts keys; LinkedHashMap follows this order; HashMap promises no iteration order.",
    );
    setStatement("// Rebuilt using the insertion order shown above.");
    setError(false);
  }
  return (
    <div className="hash-lab lesson-panel">
      <div className="hash-controls lesson-controls">
        <Field label={compare ? "Product key" : "Student ID (key)"}>
          <input
            value={key}
            onChange={(event) => setKey(event.target.value)}
            maxLength={40}
          />
        </Field>
        <Field
          label={compare ? "Integer price (value)" : "Student name (value)"}
        >
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            maxLength={60}
          />
        </Field>
        <Field label="Map operation">
          <select
            value={operation}
            onChange={(event) => setOperation(event.target.value)}
          >
            <option value="put">put() · Add / update</option>
            <option value="get">get() · Retrieve</option>
            <option value="containsKey">containsKey() · Check key</option>
            <option value="remove">remove() · Delete</option>
          </select>
        </Field>
        <button className="hash-primary active" onClick={run}>
          Apply to {compare ? "all maps" : "directory"}
        </button>
        <button
          onClick={() => {
            setEntries(initial);
            setKey(compare ? "banana" : "2026001");
            setValue(compare ? "25" : "Ana Santos");
            setStatement("// Select an operation.");
            setOperation("put");
            setError(false);
            setFeedback("Initial mappings restored.");
          }}
        >
          Reset
        </button>
        {compare && (
          <button
            onClick={() => {
              setError(false);
              setFeedback(
                "TreeMap sorts keys. LinkedHashMap keeps arrival order. HashMap promises no iteration order; its panel shows contents only.",
              );
            }}
          >
            Compare iteration order
          </button>
        )}
      </div>
      {compare && (
        <details className="hash-definitions lesson-panel">
          <summary>Change the insertion order</summary>
          <p>
            Move a key earlier or later, then rebuild all three maps with those
            same mappings in the new order. This rebuild is separate from
            updating an existing key’s value.
          </p>
          <div className="hash-controls lesson-controls">
            {entries.map((entry, i) => (
              <div key={entry.key} className="hash-panel lesson-panel">
                <strong>
                  {i + 1}. {entry.key}
                </strong>
                <div className="lesson-controls">
                  <button
                    aria-label={`Move ${entry.key} earlier`}
                    disabled={i === 0}
                    onClick={() => moveEntry(entry.key, -1)}
                  >
                    Earlier
                  </button>
                  <button
                    aria-label={`Move ${entry.key} later`}
                    disabled={i === entries.length - 1}
                    onClick={() => moveEntry(entry.key, 1)}
                  >
                    Later
                  </button>
                </div>
              </div>
            ))}
          </div>
          <CodePanel
            lines={[
              "Map<String, Integer> map = new LinkedHashMap<>();",
              ...entries.map(
                (entry) =>
                  `map.put(${JSON.stringify(entry.key)}, ${entry.value});`,
              ),
            ]}
          />
        </details>
      )}
      {compare ? (
        <div className="hash-grid-three">
          {variants.map(([name, description, values]) => (
            <div className="hash-panel lesson-panel" key={name}>
              <h3>{name}</h3>
              <p>{description}</p>
              <Chips items={values} unordered={name === "HashMap"} />
              <p className="hash-small">
                {name === "HashMap"
                  ? "Contents only; the display order is not a Java output prediction."
                  : `Iteration keys: ${values.map((entry) => entry.key).join(" → ") || "(empty)"}`}
              </p>
              <CodePanel
                lines={[
                  `${name}<String, Integer> map`,
                  `    = new ${name}<>();`,
                  statement,
                ]}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="hash-grid-two">
          <div className="hash-panel lesson-panel">
            <h3>Set · unique IDs only</h3>
            <Chips items={entries.map((entry) => entry.key)} unordered />
            <p>Membership answers “is this ID registered?”</p>
          </div>
          <div className="hash-panel lesson-panel">
            <h3>Map · unique ID → record</h3>
            <Chips items={entries} unordered />
            <p>Mappings answer “which record belongs to this ID?”</p>
            <CodePanel
              lines={[
                "HashMap<String, String> map = new HashMap<>();",
                statement,
              ]}
            />
          </div>
        </div>
      )}
      <Feedback error={error}>
        {feedback} Current size: {entries.length}.
      </Feedback>
      <p className="hash-small">
        Code excerpts belong inside a Java method, with imports from java.util.
        Strings are case-sensitive; TreeMap string keys use Java’s natural
        lexicographic order.
      </p>
    </div>
  );
}
