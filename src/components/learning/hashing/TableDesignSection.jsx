import { useContext, useState } from "react";
import { LessonActiveContext } from "../../../hooks/useLessonPlayback";
import { LoadFactorSimulator } from "./HashingLabs";
import {
  HashFunctionSelection,
  JavaResizeIllustration,
  TableSizeSimulator,
} from "./TableDesignLabs";
import { Field } from "./LessonUI";

const activities = [
  ["Table size and allocation", TableSizeSimulator],
  ["Hash function selection", HashFunctionSelection],
  ["Load factor and conceptual rehashing", LoadFactorSimulator],
  ["Java HashMap: 16 buckets and the 13th entry", JavaResizeIllustration],
];

export default function TableDesignSection() {
  const [activity, setActivity] = useState(0);
  const active = useContext(LessonActiveContext);
  return (
    <div>
      <div className="hash-controls lesson-controls">
        <Field label="Table design activity">
          <select
            value={activity}
            onChange={(event) => setActivity(Number(event.target.value))}
          >
            {activities.map(([title], i) => (
              <option value={i} key={title}>
                {title}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {activities.map(([title, Component], i) => (
        <div key={title} data-design-activity={i} hidden={activity !== i}>
          <LessonActiveContext.Provider value={active && activity === i}>
            <Component />
          </LessonActiveContext.Provider>
        </div>
      ))}
    </div>
  );
}
