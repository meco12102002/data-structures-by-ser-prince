import { useEffect, useMemo, useState } from "react";

const TRAVERSAL_TYPES = [
  "PREORDER",
  "INORDER",
  "POSTORDER",
  "LEVEL ORDER",
];

const VALUE_SETS = [
  [14, 8, 20, 4, 11, 17, 25],
  [30, 42, 50, 36, 18, 24, 9],
  [16, 7, 3, 12, 10, 14, 23],
  [40, 25, 60, 52, 48, 70],
  [21, 33, 28, 37, 10, 6, 14],
];

const PLAY_SPEED = 700;

function GeneratedTraversalPractice() {
  const [problemIndex, setProblemIndex] = useState(0);
  const [type, setType] = useState("PREORDER");
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [answerStep, setAnswerStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const tree = useMemo(
    () => buildTree(VALUE_SETS[problemIndex]),
    [problemIndex]
  );

  const answer = useMemo(
    () => getTraversal(tree.root, type),
    [tree, type]
  );

  const playedNodes =
    answerStep >= 0
      ? answer.slice(0, answerStep + 1)
      : [];

  const isComplete =
    selectedNodes.length === answer.length;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (answerStep >= answer.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setAnswerStep((current) => current + 1);
    }, PLAY_SPEED);

    return () => clearTimeout(timer);
  }, [answerStep, answer.length, isPlaying]);

  function resetAttempt() {
    setSelectedNodes([]);
    setAnswerStep(-1);
    setIsPlaying(false);
    setFeedback(null);
  }

  function changeType(nextType) {
    setType(nextType);
    resetAttempt();
  }

  function generateProblem() {
    setProblemIndex(
      (current) => (current + 1) % VALUE_SETS.length
    );
    resetAttempt();
  }

  function handleNodeClick(value) {
    if (isComplete) {
      return;
    }

    const expectedValue = answer[selectedNodes.length];

    if (value !== expectedValue) {
      setFeedback({
        type: "wrong",
        title: "Not yet.",
        message: `Follow ${getTraversalRule(type)}. The next node is not ${value}.`,
      });
      return;
    }

    const nextSelection = [
      ...selectedNodes,
      value,
    ];

    setSelectedNodes(nextSelection);

    if (nextSelection.length === answer.length) {
      setFeedback({
        type: "success",
        title: "Correct!",
        message: `You completed the ${type.toLowerCase()} traversal.`,
      });
      return;
    }

    setFeedback({
      type: "correct",
      title: "Correct.",
      message: "Keep going through the tree.",
    });
  }

  function playAnswer() {
    if (answerStep >= answer.length - 1) {
      setAnswerStep(-1);
    }

    setIsPlaying((current) => !current);
  }

  function stepAnswer() {
    setIsPlaying(false);
    setAnswerStep((current) =>
      Math.min(current + 1, answer.length - 1)
    );
  }

  return (
    <section
      className="lesson-section generated-traversal"
      aria-labelledby="generated-traversal-heading"
    >
      <span className="section-label">
        09 / GENERATED PRACTICE
      </span>

      <h2 id="generated-traversal-heading">
        Generate Traversal Problems
      </h2>

      <p>
        Generate a tree, choose a traversal rule, click
        nodes in the correct order, then play the answer
        to see how the traversal moves.
      </p>

      <div className="generated-traversal-toolbar">
        <div className="generated-type-tabs">
          {TRAVERSAL_TYPES.map((option) => (
            <button
              key={option}
              type="button"
              className={type === option ? "active" : ""}
              onClick={() => changeType(option)}
              aria-pressed={type === option}
            >
              {option}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="generated-button"
          onClick={generateProblem}
        >
          GENERATE TREE
        </button>
      </div>

      <div className="generated-traversal-workspace">
        <div className="generated-tree-panel">
          <div className="generated-panel-header">
            <span>
              PROBLEM TREE
            </span>

            <strong>
              {getTraversalRule(type)}
            </strong>
          </div>

          <div className="generated-tree">
            <svg
              className="generated-tree-lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {tree.connections.map(([parent, child]) => {
                const parentNode = tree.nodes.find(
                  (node) => node.value === parent
                );
                const childNode = tree.nodes.find(
                  (node) => node.value === child
                );

                const isSelected =
                  selectedNodes.includes(parent) &&
                  selectedNodes.includes(child);

                const isPlayed =
                  playedNodes.includes(parent) &&
                  playedNodes.includes(child);

                return (
                  <line
                    key={`${parent}-${child}`}
                    x1={parentNode.x}
                    y1={parentNode.y}
                    x2={childNode.x}
                    y2={childNode.y}
                    className={
                      isSelected || isPlayed
                        ? "active"
                        : ""
                    }
                  />
                );
              })}
            </svg>

            {tree.nodes.map((node) => {
              const selectedIndex =
                selectedNodes.indexOf(node.value);

              const answerIndex =
                playedNodes.indexOf(node.value);

              const isSelected =
                selectedIndex !== -1;

              const isPlayed =
                answerIndex !== -1;

              const isCurrentAnswer =
                answer[answerStep] === node.value;

              return (
                <button
                  key={node.value}
                  type="button"
                  className={[
                    "generated-node",
                    isSelected ? "selected" : "",
                    isPlayed ? "played" : "",
                    isCurrentAnswer ? "current-answer" : "",
                  ].join(" ")}
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  }}
                  onClick={() => handleNodeClick(node.value)}
                  disabled={isComplete}
                  aria-label={`Node ${node.value}`}
                >
                  <span>
                    {node.value}
                  </span>

                  {isSelected && (
                    <small>
                      {selectedIndex + 1}
                    </small>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="generated-answer-panel">
          <div className="generated-panel-header">
            <span>
              YOUR SEQUENCE
            </span>

            <strong>
              {selectedNodes.length} / {answer.length}
            </strong>
          </div>

          <div className="generated-sequence">
            {answer.map((value, index) => (
              <div
                key={`${value}-${index}`}
                className={
                  selectedNodes[index]
                    ? "filled"
                    : ""
                }
              >
                {selectedNodes[index] ?? "?"}
              </div>
            ))}
          </div>

          {feedback && (
            <div
              className={`generated-feedback ${feedback.type}`}
              role="status"
            >
              <strong>
                {feedback.title}
              </strong>

              <p>
                {feedback.message}
              </p>
            </div>
          )}

          <div className="generated-panel-header generated-answer-heading">
            <span>
              PLAYABLE ANSWER
            </span>

            <strong>
              {answerStep >= 0
                ? answer[answerStep]
                : "-"}
            </strong>
          </div>

          <div className="generated-sequence answer">
            {answer.map((value, index) => (
              <div
                key={`answer-${value}-${index}`}
                className={[
                  index <= answerStep ? "filled" : "",
                  index === answerStep ? "current" : "",
                ].join(" ")}
              >
                {value}
              </div>
            ))}
          </div>

          <div className="generated-actions">
            <button
              type="button"
              onClick={playAnswer}
            >
              {isPlaying ? "PAUSE ANSWER" : "PLAY ANSWER"}
            </button>

            <button
              type="button"
              onClick={stepAnswer}
              disabled={answerStep >= answer.length - 1}
            >
              NEXT STEP
            </button>

            <button
              type="button"
              onClick={resetAttempt}
            >
              RESET
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function buildTree(values) {
  const root = values.reduce(insertNode, null);
  const sortedNodes = [];

  collectInorderNodes(root, sortedNodes);

  const layout = new Map(
    sortedNodes.map((node, index) => [
      node.value,
      {
        x:
          sortedNodes.length === 1
            ? 50
            : 12 + (index * 76) / (sortedNodes.length - 1),
      },
    ])
  );

  const nodes = [];
  const connections = [];

  assignPositions(root, 0, layout, nodes, connections);

  return {
    root,
    nodes,
    connections,
  };
}

function insertNode(root, value) {
  if (!root) {
    return {
      value,
      left: null,
      right: null,
    };
  }

  if (value < root.value) {
    return {
      ...root,
      left: insertNode(root.left, value),
    };
  }

  return {
    ...root,
    right: insertNode(root.right, value),
  };
}

function collectInorderNodes(node, nodes) {
  if (!node) {
    return;
  }

  collectInorderNodes(node.left, nodes);
  nodes.push(node);
  collectInorderNodes(node.right, nodes);
}

function assignPositions(
  node,
  depth,
  layout,
  nodes,
  connections
) {
  if (!node) {
    return;
  }

  const position = layout.get(node.value);

  nodes.push({
    value: node.value,
    x: position.x,
    y: 14 + depth * 25,
  });

  if (node.left) {
    connections.push([node.value, node.left.value]);
    assignPositions(
      node.left,
      depth + 1,
      layout,
      nodes,
      connections
    );
  }

  if (node.right) {
    connections.push([node.value, node.right.value]);
    assignPositions(
      node.right,
      depth + 1,
      layout,
      nodes,
      connections
    );
  }
}

function getTraversal(root, type) {
  if (!root) {
    return [];
  }

  if (type === "PREORDER") {
    return [
      root.value,
      ...getTraversal(root.left, type),
      ...getTraversal(root.right, type),
    ];
  }

  if (type === "INORDER") {
    return [
      ...getTraversal(root.left, type),
      root.value,
      ...getTraversal(root.right, type),
    ];
  }

  if (type === "POSTORDER") {
    return [
      ...getTraversal(root.left, type),
      ...getTraversal(root.right, type),
      root.value,
    ];
  }

  return getLevelOrderTraversal(root);
}

function getLevelOrderTraversal(root) {
  const queue = [root];
  const values = [];

  while (queue.length > 0) {
    const node = queue.shift();
    values.push(node.value);

    if (node.left) {
      queue.push(node.left);
    }

    if (node.right) {
      queue.push(node.right);
    }
  }

  return values;
}

function getTraversalRule(type) {
  if (type === "PREORDER") {
    return "ROOT -> LEFT -> RIGHT";
  }

  if (type === "INORDER") {
    return "LEFT -> ROOT -> RIGHT";
  }

  if (type === "POSTORDER") {
    return "LEFT -> RIGHT -> ROOT";
  }

  return "TOP -> BOTTOM, LEFT -> RIGHT";
}

export default GeneratedTraversalPractice;
