import { useEffect, useState } from "react";

const tree = {
  10: { x: 50, y: 18 },
  5: { x: 30, y: 50 },
  15: { x: 70, y: 50 },
  2: { x: 20, y: 82 },
  7: { x: 40, y: 82 },
};

const connections = [
  [10, 5],
  [10, 15],
  [5, 2],
  [5, 7],
];

const speeds = {
  slow: 1800,
  normal: 1200,
  fast: 600,
};

const traversals = {
  preorder: {
    label: "PREORDER",
    rule: "ROOT → LEFT → RIGHT",

    steps: [
      {
        node: 10,
        action: "VISIT ROOT",
        description:
          "Start at the root and visit 10 first.",
      },
      {
        node: 5,
        action: "MOVE LEFT",
        description:
          "Move left from 10 to its left child, 5.",
      },
      {
        node: 2,
        action: "MOVE LEFT",
        description:
          "Move left from 5 to its left child, 2.",
      },
      {
        node: 7,
        action: "MOVE RIGHT",
        description:
          "2 has no children. Backtrack to 5, then move right to 7.",
      },
      {
        node: 15,
        action: "MOVE RIGHT",
        description:
          "The left subtree is complete. Backtrack to 10, then move right to 15.",
      },
    ],
  },

  inorder: {
    label: "INORDER",
    rule: "LEFT → ROOT → RIGHT",

    steps: [
      {
        node: 2,
        action: "MOVE LEFT",
        description:
          "Start at 10 and move left to 5, then left again to 2.",
      },
      {
        node: 5,
        action: "VISIT",
        description:
          "2 has no left child. Backtrack to 5 and visit it.",
      },
      {
        node: 7,
        action: "MOVE RIGHT",
        description:
          "After visiting 5, move right to its child, 7.",
      },
      {
        node: 10,
        action: "BACKTRACK",
        description:
          "7 has no children. Backtrack to 10 and visit the root.",
      },
      {
        node: 15,
        action: "MOVE RIGHT",
        description:
          "After visiting 10, move right to 15 and visit it.",
      },
    ],
  },

  postorder: {
    label: "POSTORDER",
    rule: "LEFT → RIGHT → ROOT",

    steps: [
      {
        node: 2,
        action: "MOVE LEFT",
        description:
          "Start at 10 and move left to 5, then left again to 2.",
      },
      {
        node: 7,
        action: "MOVE RIGHT",
        description:
          "2 has no children. Backtrack to 5, then move right to 7.",
      },
      {
        node: 5,
        action: "BACKTRACK",
        description:
          "Both children of 5 are complete. Backtrack and visit 5.",
      },
      {
        node: 15,
        action: "MOVE RIGHT",
        description:
          "The left subtree is complete. Move right from 10 to 15.",
      },
      {
        node: 10,
        action: "BACKTRACK",
        description:
          "Both subtrees are complete. Backtrack and visit the root, 10.",
      },
    ],
  },

  levelorder: {
    label: "LEVEL ORDER",
    rule: "TOP → BOTTOM, LEFT → RIGHT",

    steps: [
      {
        node: 10,
        action: "LEVEL 1",
        description:
          "Start at the root. Visit 10.",
      },
      {
        node: 5,
        action: "LEVEL 2 · LEFT",
        description:
          "Move to the next level and visit the left child, 5.",
      },
      {
        node: 15,
        action: "LEVEL 2 · RIGHT",
        description:
          "Continue across the same level and visit 15.",
      },
      {
        node: 2,
        action: "LEVEL 3 · LEFT",
        description:
          "Move to the next level and visit the leftmost node, 2.",
      },
      {
        node: 7,
        action: "LEVEL 3 · RIGHT",
        description:
          "Continue across the level and visit 7.",
      },
    ],
  },
};

const traversalTypes = Object.keys(traversals);

function TreeTraversalPreview() {
  const [activeTraversal, setActiveTraversal] =
    useState("preorder");

  const [currentStep, setCurrentStep] = useState(-1);

  const [isPlaying, setIsPlaying] = useState(false);

  const [speed, setSpeed] = useState("normal");

  const traversal = traversals[activeTraversal];

  const currentStepData =
    currentStep >= 0
      ? traversal.steps[currentStep]
      : null;

  const currentNode =
    currentStepData?.node ?? null;

  const progress =
    currentStep >= 0
      ? currentStep + 1
      : 0;

  /*
   * Automatically move through the traversal.
   */
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (
      currentStep >=
      traversal.steps.length - 1
    ) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((step) => step + 1);
    }, speeds[speed]);

    return () => clearTimeout(timer);
  }, [
    isPlaying,
    currentStep,
    traversal.steps.length,
    speed,
  ]);

  /*
   * Change traversal type.
   */
  const selectTraversal = (type) => {
    setActiveTraversal(type);
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  /*
   * Start or restart the traversal.
   */
  const playTraversal = () => {
    if (
      currentStep >=
      traversal.steps.length - 1
    ) {
      setCurrentStep(-1);
    }

    setIsPlaying(true);
  };

  /*
   * Reset the current traversal.
   */
  const resetTraversal = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  /*
   * Determine whether a node has already
   * appeared in the traversal.
   */
  const isVisited = (nodeId) => {
    if (currentStep < 0) {
      return false;
    }

    return traversal.steps
      .slice(0, currentStep + 1)
      .some(
        (step) => step.node === nodeId
      );
  };

  /*
   * Determine whether this is the
   * currently active node.
   */
  const isCurrent = (nodeId) => {
    return currentNode === nodeId;
  };

  /*
   * Move to the previous traversal.
   */
  const goPrevious = () => {
    const currentIndex =
      traversalTypes.indexOf(
        activeTraversal
      );

    const previousIndex =
      (currentIndex -
        1 +
        traversalTypes.length) %
      traversalTypes.length;

    selectTraversal(
      traversalTypes[previousIndex]
    );
  };

  /*
   * Move to the next traversal.
   */
  const goNext = () => {
    const currentIndex =
      traversalTypes.indexOf(
        activeTraversal
      );

    const nextIndex =
      (currentIndex + 1) %
      traversalTypes.length;

    selectTraversal(
      traversalTypes[nextIndex]
    );
  };

  return (
    <section className="tree-preview">

      {/* HEADER */}

      <div className="tree-preview-header">
        <div>
          <span className="tree-preview-label">
            INTERACTIVE PREVIEW
          </span>

          <h2>
            Explore tree traversal.
          </h2>
        </div>

        <span className="tree-preview-index">
          {String(
            traversalTypes.indexOf(
              activeTraversal
            ) + 1
          ).padStart(2, "0")}

          {" / "}

          {String(
            traversalTypes.length
          ).padStart(2, "0")}
        </span>
      </div>

      {/* TRAVERSAL PAGINATION */}

      <div className="tree-preview-tabs">
        {traversalTypes.map((type) => {
          const item = traversals[type];

          return (
            <button
              key={type}
              type="button"
              className={
                activeTraversal === type
                  ? "active"
                  : ""
              }
              onClick={() =>
                selectTraversal(type)
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* MAIN */}

      <div className="tree-preview-main">

        {/* TREE VISUALIZATION */}

        <div className="tree-preview-visual">

          <div className="tree-preview-grid" />

          <svg
            className="tree-preview-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {connections.map(
              ([parentId, childId]) => {
                const parent =
                  tree[parentId];

                const child =
                  tree[childId];

                return (
                  <line
                    key={`${parentId}-${childId}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={child.x}
                    y2={child.y}
                    className={
                      isVisited(parentId) &&
                      isVisited(childId)
                        ? "visited"
                        : ""
                    }
                  />
                );
              }
            )}
          </svg>

          {Object.entries(tree).map(
            ([id, node]) => {
              const nodeId = Number(id);

              return (
                <div
                  key={id}
                  className={`
                    tree-preview-node

                    ${
                      isVisited(nodeId)
                        ? "visited"
                        : ""
                    }

                    ${
                      isCurrent(nodeId)
                        ? "current"
                        : ""
                    }
                  `}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  }}
                >
                  {id}
                </div>
              );
            }
          )}
        </div>

        {/* INFORMATION PANEL */}

        <div className="tree-preview-info">

          <span className="tree-preview-info-label">
            {traversal.rule}
          </span>

          <h3>
            {currentStepData
              ? currentStepData.action
              : "Ready to explore"}
          </h3>

          <p>
            {currentStepData
              ? currentStepData.description
              : `Press PLAY to see how ${traversal.label.toLowerCase()} moves through the tree.`}
          </p>

          {/* RESULT SEQUENCE */}

          <div className="tree-preview-order">
            {traversal.steps.map(
              (step, index) => (
                <span
                  key={`${step.node}-${index}`}
                  className={
                    index <= currentStep
                      ? "visited"
                      : ""
                  }
                >
                  {step.node}
                </span>
              )
            )}
          </div>

          {/* CONTROLS */}

          <div className="tree-preview-controls">

            {/* PLAY */}

            <button
              type="button"
              className="tree-preview-play"
              onClick={
                isPlaying
                  ? resetTraversal
                  : playTraversal
              }
            >
              {isPlaying
                ? "RESET"
                : "PLAY"}

              <span>
                {isPlaying
                  ? "↺"
                  : "▶"}
              </span>
            </button>

            {/* SPEED */}

            <div className="tree-preview-speed">
              <span>SPEED</span>

              <div>
                <button
                  type="button"
                  className={
                    speed === "slow"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSpeed("slow")
                  }
                >
                  SLOW
                </button>

                <button
                  type="button"
                  className={
                    speed === "normal"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSpeed("normal")
                  }
                >
                  NORMAL
                </button>

                <button
                  type="button"
                  className={
                    speed === "fast"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSpeed("fast")
                  }
                >
                  FAST
                </button>
              </div>
            </div>

            {/* PROGRESS */}

            <div className="tree-preview-progress">
              <div
                className="tree-preview-progress-bar"
                style={{
                  width: `${
                    (progress /
                      traversal.steps
                        .length) *
                    100
                  }%`,
                }}
              />
            </div>

            <span className="tree-preview-step">
              {progress} /{" "}
              {traversal.steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* PREVIOUS / NEXT */}

      <div className="tree-preview-footer">

        <button
          type="button"
          onClick={goPrevious}
        >
          ← PREVIOUS
        </button>

        <span>
          {traversal.label}
        </span>

        <button
          type="button"
          onClick={goNext}
        >
          NEXT →
        </button>

      </div>
    </section>
  );
}

export default TreeTraversalPreview;