import { useEffect, useState } from "react";

const nodes = {
  10: {
    value: 10,
    x: 50,
    y: 18,
    parent: null,
    left: 5,
    right: 15,
    type: "ROOT",
    depth: 0,
  },

  5: {
    value: 5,
    x: 30,
    y: 52,
    parent: 10,
    left: 2,
    right: 7,
    type: "INTERNAL NODE",
    depth: 1,
  },

  15: {
    value: 15,
    x: 70,
    y: 52,
    parent: 10,
    left: null,
    right: null,
    type: "LEAF",
    depth: 1,
  },

  2: {
    value: 2,
    x: 20,
    y: 84,
    parent: 5,
    left: null,
    right: null,
    type: "LEAF",
    depth: 2,
  },

  7: {
    value: 7,
    x: 40,
    y: 84,
    parent: 5,
    left: null,
    right: null,
    type: "LEAF",
    depth: 2,
  },
};

const connections = [
  [10, 5],
  [10, 15],
  [5, 2],
  [5, 7],
];

/*
  Each step teaches one concept.

  highlight:
  - nodes that should be highlighted
  - edges that should be highlighted

  concept:
  - the current concept

  title:
  - heading shown to the student

  description:
  - explanation shown to the student
*/

const demoSteps = [
  {
    concept: "ROOT",
    title: "Every tree has a root.",
    description:
      "The root is the starting point of the tree. It is the node at the very top and has no parent.",
    highlight: [10],
    edges: [],
  },

  {
    concept: "PARENT",
    title: "A node can have children.",
    description:
      "Node 10 is the parent of nodes 5 and 15 because they are directly connected below it.",
    highlight: [10, 5, 15],
    edges: [
      [10, 5],
      [10, 15],
    ],
  },

  {
    concept: "CHILD",
    title: "Meet the children.",
    description:
      "Nodes directly connected below another node are its children. Nodes 5 and 15 are children of 10.",
    highlight: [5, 15],
    edges: [
      [10, 5],
      [10, 15],
    ],
  },

  {
    concept: "SIBLINGS",
    title: "Nodes can be siblings.",
    description:
      "Nodes that share the same parent are called siblings. Nodes 5 and 15 are siblings because both have 10 as their parent.",
    highlight: [5, 15],
    edges: [
      [10, 5],
      [10, 15],
    ],
  },

  {
    concept: "CHILDREN",
    title: "Node 5 also has children.",
    description:
      "Node 5 has two children: 2 on the left and 7 on the right.",
    highlight: [5, 2, 7],
    edges: [
      [5, 2],
      [5, 7],
    ],
  },

  {
    concept: "LEAF",
    title: "Some nodes have no children.",
    description:
      "A leaf is a node that has no children. In this tree, 2, 7, and 15 are leaf nodes.",
    highlight: [2, 7, 15],
    edges: [],
  },

  {
    concept: "EDGE",
    title: "Nodes are connected by edges.",
    description:
      "An edge is the connection between two nodes. For example, the line between 10 and 5 is an edge.",
    highlight: [10, 5],
    edges: [[10, 5]],
  },

  {
    concept: "SUBTREE",
    title: "A tree can contain smaller trees.",
    description:
      "The node 5 together with its children 2 and 7 forms a subtree of the larger tree.",
    highlight: [5, 2, 7],
    edges: [
      [5, 2],
      [5, 7],
    ],
  },

  {
    concept: "DEPTH",
    title: "Nodes can exist at different depths.",
    description:
      "Depth describes how far a node is from the root. The root has depth 0, its children have depth 1, and nodes below them have depth 2.",
    highlight: [10, 5, 15, 2, 7],
    edges: [],
  },
];

function BinaryTree() {
  const [mode, setMode] = useState("demo");
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [selectedNode, setSelectedNode] = useState(null);

  const speeds = {
    slow: 2500,
    normal: 1600,
    fast: 800,
  };

  const step =
    currentStep >= 0
      ? demoSteps[currentStep]
      : null;

  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep >= demoSteps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((previous) => previous + 1);
    }, speeds[speed]);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, speed]);

  const playDemo = () => {
    if (currentStep >= demoSteps.length - 1) {
      setCurrentStep(-1);
    }

    setIsPlaying(true);
  };

  const pauseDemo = () => {
    setIsPlaying(false);
  };

  const resetDemo = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
    setSelectedNode(null);
  };

  const nextStep = () => {
    setIsPlaying(false);

    setCurrentStep((previous) => {
      if (previous >= demoSteps.length - 1) {
        return previous;
      }

      return previous + 1;
    });
  };

  const previousStep = () => {
    setIsPlaying(false);

    setCurrentStep((previous) => {
      if (previous <= -1) {
        return -1;
      }

      return previous - 1;
    });
  };

  const selectNode = (value) => {
    if (mode !== "explore") return;

    setSelectedNode(value);
  };

  const startExplore = () => {
    setIsPlaying(false);
    setMode("explore");
    setCurrentStep(-1);
    setSelectedNode(null);
  };

  const startDemo = () => {
    setMode("demo");
    setSelectedNode(null);
    setCurrentStep(-1);
  };

  const isHighlighted = (value) => {
    if (!step) return false;

    return step.highlight.includes(value);
  };

  const isEdgeHighlighted = (parent, child) => {
    if (!step) return false;

    return step.edges.some(
      ([from, to]) =>
        from === parent && to === child
    );
  };

  const selectedNodeData = selectedNode
    ? nodes[selectedNode]
    : null;

  return (
    <div className="binary-tree">

      {/* ================================
          HEADER
      ================================= */}

      <div className="binary-tree-header">
        <div>
          <span className="binary-tree-label">
            INTERACTIVE EXPLORATION
          </span>

          <h3>Binary Tree</h3>
        </div>

        <div className="binary-tree-mode">
          <button
            type="button"
            className={
              mode === "demo" ? "active" : ""
            }
            onClick={startDemo}
          >
            GUIDED DEMO
          </button>

          <button
            type="button"
            className={
              mode === "explore" ? "active" : ""
            }
            onClick={startExplore}
          >
            EXPLORE
          </button>
        </div>
      </div>

      {/* ================================
          VISUALIZATION
      ================================= */}

      <div className="binary-tree-main">

        <div className="binary-tree-visual">

          <div className="binary-tree-grid" />

          <svg
            className="binary-tree-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {connections.map(
              ([parent, child]) => {
                const parentNode =
                  nodes[parent];

                const childNode =
                  nodes[child];

                const highlighted =
                  isEdgeHighlighted(
                    parent,
                    child
                  );

                return (
                  <line
                    key={`${parent}-${child}`}
                    x1={parentNode.x}
                    y1={parentNode.y}
                    x2={childNode.x}
                    y2={childNode.y}
                    className={
                      highlighted
                        ? "highlighted"
                        : ""
                    }
                  />
                );
              }
            )}
          </svg>

          {Object.values(nodes).map(
            (treeNode) => {
              const highlighted =
                isHighlighted(
                  treeNode.value
                );

              const selected =
                selectedNode ===
                treeNode.value;

              return (
                <button
                  key={treeNode.value}
                  type="button"
                  className={[
                    "binary-tree-node",
                    highlighted
                      ? "highlighted"
                      : "",
                    selected
                      ? "selected"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    left: `${treeNode.x}%`,
                    top: `${treeNode.y}%`,
                  }}
                  onClick={() =>
                    selectNode(
                      treeNode.value
                    )
                  }
                  aria-label={`Node ${treeNode.value}`}
                >
                  {treeNode.value}
                </button>
              );
            }
          )}

        </div>

        {/* ================================
            INFORMATION PANEL
        ================================= */}

        <div className="binary-tree-info">

          {mode === "demo" && (
            <>
              {!step ? (
                <>
                  <span className="binary-tree-info-label">
                    GUIDED DEMO
                  </span>

                  <h3>
                    Let's explore the tree.
                  </h3>

                  <p>
                    Press play to discover the
                    different parts of a binary
                    tree one step at a time.
                  </p>
                </>
              ) : (
                <>
                  <span className="binary-tree-info-label">
                    {step.concept}
                  </span>

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.description}
                  </p>
                </>
              )}

              <div className="binary-tree-progress">

                <div className="binary-tree-progress-top">
                  <span>CONCEPTS</span>

                  <span>
                    {currentStep + 1} /{" "}
                    {demoSteps.length}
                  </span>
                </div>

                <div className="binary-tree-progress-track">
                  <div
                    className="binary-tree-progress-bar"
                    style={{
                      width:
                        currentStep < 0
                          ? "0%"
                          : `${
                              ((currentStep + 1) /
                                demoSteps.length) *
                              100
                            }%`,
                    }}
                  />
                </div>

              </div>
            </>
          )}

          {mode === "explore" && (
            <>
              {!selectedNodeData ? (
                <>
                  <span className="binary-tree-info-label">
                    EXPLORE MODE
                  </span>

                  <h3>
                    Click a node.
                  </h3>

                  <p>
                    Select any node to inspect
                    its role and relationships
                    within the tree.
                  </p>
                </>
              ) : (
                <>
                  <span className="binary-tree-info-label">
                    SELECTED NODE
                  </span>

                  <h3>
                    Node {selectedNodeData.value}
                  </h3>

                  <div className="binary-tree-properties">

                    <div>
                      <span>TYPE</span>

                      <strong>
                        {selectedNodeData.type}
                      </strong>
                    </div>

                    <div>
                      <span>PARENT</span>

                      <strong>
                        {selectedNodeData.parent ??
                          "NONE"}
                      </strong>
                    </div>

                    <div>
                      <span>LEFT CHILD</span>

                      <strong>
                        {selectedNodeData.left ??
                          "NONE"}
                      </strong>
                    </div>

                    <div>
                      <span>RIGHT CHILD</span>

                      <strong>
                        {selectedNodeData.right ??
                          "NONE"}
                      </strong>
                    </div>

                    <div>
                      <span>DEPTH</span>

                      <strong>
                        {selectedNodeData.depth}
                      </strong>
                    </div>

                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>

      {/* ================================
          CONTROLS
      ================================= */}

      {mode === "demo" && (
        <div className="binary-tree-controls">

          <div className="binary-tree-navigation">

            <button
              type="button"
              onClick={previousStep}
            >
              ← PREVIOUS
            </button>

            {!isPlaying ? (
              <button
                type="button"
                className="play-button"
                onClick={playDemo}
              >
                ▶ PLAY DEMO
              </button>
            ) : (
              <button
                type="button"
                className="play-button"
                onClick={pauseDemo}
              >
                ❚❚ PAUSE
              </button>
            )}

            <button
              type="button"
              onClick={nextStep}
            >
              NEXT →
            </button>

          </div>

          <div className="binary-tree-speed">

            <span>SPEED</span>

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

            <button
              type="button"
              onClick={resetDemo}
            >
              RESET
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default BinaryTree;