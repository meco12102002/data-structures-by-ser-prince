import { useState } from "react";
import { handoutRecords, recordLookupTrace } from "../../../utils/hashDesign";
import { useLessonPlayback } from "../../../hooks/useLessonPlayback";
import { BucketTable, CodePanel, Feedback, Field, Playback } from "./LessonUI";

export default function HandoutRecordLookup() {
  const [key, setKey] = useState("name");
  const player = useLessonPlayback(recordLookupTrace(key));
  const { stage, record } = player.frame;
  const values = [
    record.key,
    `hash("${key}") = ${record.hash}`,
    `${record.hash} % 5 = ${record.hash % 5}`,
    `Bucket ${record.hash % 5}`,
    JSON.stringify(record.value),
  ];
  return (
    <div
      className="hash-lab lesson-panel"
      role="group"
      aria-label="Handout record lookup"
    >
      <h3>How hashing works · the handout’s records</h3>
      <p>
        These records are already stored. Choose a key, then follow its lookup
        from key to value.
      </p>
      <div className="hash-controls lesson-controls">
        <Field label="Handout record key">
          <select
            value={key}
            onChange={(event) => {
              setKey(event.target.value);
              player.replace(recordLookupTrace(event.target.value));
            }}
          >
            {handoutRecords.map((item) => (
              <option key={item.key}>{item.key}</option>
            ))}
          </select>
        </Field>
        <button
          onClick={() => {
            setKey("name");
            player.replace(recordLookupTrace("name"));
          }}
        >
          Reset lookup
        </button>
      </div>
      <div className="hash-pipeline hash-record-pipeline">
        {["KEY", "HASH FUNCTION", "INDEX", "BUCKET", "VALUE"].map(
          (label, i) => (
            <div className={stage === i ? "is-active" : ""} key={label}>
              <span>
                {i + 1} · {label}
              </span>
              <strong>{stage >= i ? values[i] : "?"}</strong>
            </div>
          ),
        )}
      </div>
      <BucketTable
        table={player.frame.table}
        active={player.frame.index}
        activeKey={record.key}
      />
      <Playback player={player} />
      <Feedback>{player.frame.message}</Feedback>
      <p className="hash-small">
        The handout assigns illustrative hash values 2, 4, and 3. These are not
        Java String.hashCode() outputs. The bucket stores the original key and
        value; hashing does not replace the value.
      </p>
      <CodePanel
        lines={[
          "Map<String, Object> record = new HashMap<>();",
          'record.put("name", "Kimmy");',
          'record.put("age", 32);',
          'record.put("city", "Tacloban");',
          `record.get("${key}");`,
        ]}
        activeLine={stage === 4 ? 4 : -1}
      />
      <p className="hash-small">
        Java connection: a mixed-value Map illustrates these three records. The
        handout’s complete HashMap programs remain in Java Code Walkthroughs.
        Excerpts belong inside a method with java.util imports.
      </p>
      <div
        className="hash-table-scroll"
        role="region"
        aria-label="Arrays linked lists and hashing comparison"
        tabIndex={0}
      >
        <table>
          <caption>How would we find “Jack”?</caption>
          <thead>
            <tr>
              <th scope="col">Structure</th>
              <th scope="col">How to locate the record</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Array</th>
              <td>
                A known index provides direct access. With only a name in an
                unsorted array, a sequential search may inspect every entry.
              </td>
            </tr>
            <tr>
              <th scope="row">Linked list</th>
              <td>Follow nodes and compare names until a match is found.</td>
            </tr>
            <tr>
              <th scope="row">Hash table</th>
              <td>
                Calculate a bucket from the key, then compare keys there. Good
                distribution supports average-case fast lookup; collisions still
                require checks.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
