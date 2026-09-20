import { useEffect, useMemo, useState } from "react";

const TREE_NODES = {
  10: {
    id: 10,
    x: 50,
    y: 18,
  },

  5: {
    id: 5,
    x: 30,
    y: 52,
  },

  15: {
    id: 15,
    x: 70,
    y: 52,
  },

  2: {
    id: 2,
    x: 20,
    y: 84,
  },

  7: {
    id: 7,
    x: 40,
    y: 84,
  },
};

const CONNECTIONS = [
  [10, 5],
  [10, 15],
  [5, 2],
  [5, 7],
];

const PREORDER = [10, 5, 2, 7, 15];

const SPEEDS = {
  slow: 1200,
  normal: 700,
  fast: 350,
};

function TraversalDemo() {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");

  const visitedNodes = useMemo(() => {
    if (currentStep < 0) {
      return [];
    }

    return PREORDER.slice(0, currentStep + 1);
  }, [currentStep]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (currentStep >= PREORDER.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((previous) => previous + 1);
    }, SPEEDS[speed]);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed]);

  function handlePlay() {
    if (currentStep >= PREORDER.length - 1) {
      setCurrentStep(-1);
    }

    setIsPlaying((previous) => !previous);
  }

  function handleNext() {
    setIsPlaying(false);

    setCurrentStep((previous) =>
      Math.min(previous + 1, PREORDER.length - 1)
    );
  }

  function handlePrevious() {
    setIsPlaying(false);

    setCurrentStep((previous) =>
      Math.max(previous - 1, -1)
    );
  }

  function handleReset() {
    setIsPlaying(false);
    setCurrentStep(-1);
  }

  const currentNode =
    currentStep >= 0
      ? PREORDER[currentStep]
      : null;

  return (
    <div className="traversal-demo-container">

      <div className="traversal-demo-header">

        <div>
          <span className="traversal-demo-label">
            PREORDER / VISUALIZATION
          </span>

          <h3>
            ROOT → LEFT → RIGHT
          </h3>
        </div>

        <div className="traversal-demo-status">

          <span>
            CURRENT NODE
          </span>

          <strong>
            {currentNode ?? "—"}
          </strong>

        </div>

      </div>


      <div className="traversal-tree">

        <svg
          className="traversal-tree-lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >

          {CONNECTIONS.map(([parent, child]) => {
            const parentNode = TREE_NODES[parent];
            const childNode = TREE_NODES[child];

            const isVisited =
              visitedNodes.includes(parent) &&
              visitedNodes.includes(child);

            return (
              <line
                key={`${parent}-${child}`}
                x1={parentNode.x}
                y1={parentNode.y}
                x2={childNode.x}
                y2={childNode.y}
                className={
                  isVisited
                    ? "tree-line visited"
                    : "tree-line"
                }
              />
            );
          })}

        </svg>


        {Object.values(TREE_NODES).map((node) => {
          const isCurrent =
            currentNode === node.id;

          const isVisited =
            visitedNodes.includes(node.id);

          return (
            <div
              key={node.id}
              className={`
                traversal-node
                ${isCurrent ? "current" : ""}
                ${isVisited ? "visited" : ""}
              `}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
            >

              <span>
                {node.id}
              </span>

              {isVisited && (
                <small>
                  {PREORDER.indexOf(node.id) + 1}
                </small>
              )}

            </div>
          );
        })}

      </div>


      <div className="traversal-sequence">

        <span>
          VISIT ORDER
        </span>

        <div className="sequence-items">

          {PREORDER.map((node, index) => {
            const isVisited =
              index <= currentStep;

            const isCurrent =
              index === currentStep;

            return (
              <div
                key={node}
                className={`
                  sequence-node
                  ${isVisited ? "visited" : ""}
                  ${isCurrent ? "current" : ""}
                `}
              >
                {node}
              </div>
            );
          })}

        </div>

      </div>


      <div className="traversal-controls">

        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep < 0}
        >
          ← PREVIOUS
        </button>

        <button
          type="button"
          className="play-button"
          onClick={handlePlay}
        >
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={
            currentStep >= PREORDER.length - 1
          }
        >
          NEXT →
        </button>

        <button
          type="button"
          onClick={handleReset}
        >
          RESET
        </button>


        <div className="speed-control">

          <span>
            SPEED
          </span>

          {Object.keys(SPEEDS).map((option) => (
            <button
              type="button"
              key={option}
              className={
                speed === option
                  ? "active"
                  : ""
              }
              onClick={() => setSpeed(option)}
            >
              {option.toUpperCase()}
            </button>
          ))}

        </div>

      </div>

    </div>
  );
}

export default TraversalDemo;