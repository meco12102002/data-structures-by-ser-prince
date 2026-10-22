import { useContext, useId, useState } from "react";
import { LessonActiveContext } from "../../../hooks/useLessonPlayback";
import { LoadFactorSimulator } from "./HashingLabs";
import {
  HashFunctionSelection,
  JavaResizeIllustration,
  TableSizeSimulator,
} from "./TableDesignLabs";

const activities = [
  ["Allocation", "Compare table sizes", TableSizeSimulator],
  ["Hash functions", "Choose a reliable rule", HashFunctionSelection],
  ["Load factor", "Grow and redistribute", LoadFactorSimulator],
  ["Java resizing", "Follow the 13th entry", JavaResizeIllustration],
];

export default function TableDesignSection() {
  const [activity, setActivity] = useState(0);
  const active = useContext(LessonActiveContext);
  const id = useId();
  return (
    <div>
      <div
        className="hash-activity-picker"
        role="group"
        aria-label="Table design activities"
      >
        {activities.map(([title, description], i) => (
          <button
            key={title}
            id={`${id}-choice-${i}`}
            aria-pressed={activity === i}
            aria-controls={`${id}-activity-${i}`}
            onClick={() => setActivity(i)}
          >
            <span className="hash-activity-number" aria-hidden="true">
              0{i + 1}
            </span>
            <strong>{title}</strong>
            <span>{description}</span>
          </button>
        ))}
      </div>
      {activities.map(([title, , Component], i) => (
        <div
          key={title}
          id={`${id}-activity-${i}`}
          role="region"
          aria-labelledby={`${id}-choice-${i}`}
          data-design-activity={i}
          hidden={activity !== i}
        >
          <LessonActiveContext.Provider value={active && activity === i}>
            <Component />
          </LessonActiveContext.Provider>
        </div>
      ))}
    </div>
  );
}
