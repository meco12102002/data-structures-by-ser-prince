import { useState } from "react";
import { javaPrograms } from "../../../data/hashingJava";
import { useLessonPlayback } from "../../../hooks/useLessonPlayback";
import { Chips, CodePanel, Feedback, Field, Playback } from "./LessonUI";

export default function JavaWalkthrough() {
  const [selected, setSelected] = useState(0);
  const program = javaPrograms[selected];
  const player = useLessonPlayback(program.frames);
  return (
    <div className="hash-lab lesson-panel">
      <div className="hash-controls lesson-controls">
        <Field label="Java collection">
          <select
            value={selected}
            onChange={(event) => {
              const index = Number(event.target.value);
              setSelected(index);
              player.replace(javaPrograms[index].frames);
            }}
          >
            {javaPrograms.map((item, index) => (
              <option value={index} key={item.className}>
                {item.title}
              </option>
            ))}
          </select>
        </Field>
        <span className="hash-model-label">
          PREDEFINED EXECUTION TRACE · NO JAVA RUNTIME
        </span>
      </div>
      <p className="hash-small">
        Handout example · {program.pages.length === 1 ? "p." : "pp."}{" "}
        {program.pages}. Comments are condensed; the program’s operations are
        preserved.
      </p>
      <div className="hash-grid-two">
        <div className="hash-panel lesson-panel">
          <h3>{program.className}.java</h3>
          <CodePanel lines={program.lines} activeLine={player.frame.line} />
        </div>
        <div className="hash-panel lesson-panel">
          <h3>{program.type} · visual state</h3>
          <Chips items={player.frame.items} unordered={program.unordered} />
          {program.unordered && (
            <p className="hash-small">
              Membership only; no iteration-order guarantee.
            </p>
          )}
          <h3>Console output</h3>
          {program.unordered && (
            <p className="hash-small">
              One valid example output. When a whole HashMap or HashSet is
              printed, entry order may differ; it is not sorted or
              insertion-ordered by contract.
            </p>
          )}
          <pre
            className="hash-console"
            tabIndex={0}
            aria-label="Simulated Java console"
          >
            {player.frame.console.join("\n") || "(no output yet)"}
          </pre>
        </div>
      </div>
      <Playback player={player} />
      <Feedback>{player.frame.explanation}</Feedback>
    </div>
  );
}
