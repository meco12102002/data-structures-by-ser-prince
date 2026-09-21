import { useState } from "react";

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

const TRAVERSALS = {
  PREORDER: [10, 5, 2, 7, 15],

  INORDER: [2, 5, 7, 10, 15],

  POSTORDER: [2, 7, 5, 15, 10],

  "LEVEL ORDER": [10, 5, 15, 2, 7],
};

function TraversalPractice({ type }) {
  const traversal =
    TRAVERSALS[type] || TRAVERSALS.PREORDER;

  const [selectedNodes, setSelectedNodes] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const nextNode =
    traversal[selectedNodes.length];

  function handleNodeClick(nodeId) {
    if (selectedNodes.length === traversal.length) {
      return;
    }

    if (nodeId === nextNode) {

      const updatedSelection = [
        ...selectedNodes,
        nodeId,
      ];

      setSelectedNodes(updatedSelection);
      setAttempts(0);

      if (updatedSelection.length === traversal.length) {
        setFeedback({
          type: "success",
          title: "Correct!",
          message:
            `You completed the ${type.toLowerCase()} traversal.`,
        });

        return;
      }

      setFeedback({
        type: "correct",
        title: "Correct.",
        message:
          `Good. Continue following ${getRule(type)}.`,
      });

      return;
    }

    const newAttempts = attempts + 1;

    setAttempts(newAttempts);

    if (newAttempts >= 2) {
      setFeedback({
        type: "hint",
        title: "Not yet.",
        message: getHint(type, nextNode),
      });
    } else {
      setFeedback({
        type: "wrong",
        title: "Not yet.",
        message:
          `Think about the rule: ${getRule(type)}.`,
      });
    }
  }

  function handleReset() {
    setSelectedNodes([]);
    setFeedback(null);
    setAttempts(0);
  }

  return (
    <div className="traversal-practice-container">

      {/* =================================
          HEADER
      ================================= */}

      <div className="practice-header">

        <div>

          <span className="traversal-practice-label">
            YOUR TURN
          </span>

          <h3>
            Perform the {type.toLowerCase()} traversal.
          </h3>

          <p>
            Click the nodes in the correct order.
            Your progress will not reset when you
            make a mistake.
          </p>

        </div>

        <div className="practice-progress">

          <strong>
            {selectedNodes.length}
          </strong>

          <span>
            / {traversal.length}
          </span>

        </div>

      </div>


      {/* =================================
          TREE
      ================================= */}

      <div className="practice-tree">

        <svg
          className="practice-tree-lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >

          {CONNECTIONS.map(([parent, child]) => {

            const parentNode =
              TREE_NODES[parent];

            const childNode =
              TREE_NODES[child];

            const isVisited =
              selectedNodes.includes(parent) &&
              selectedNodes.includes(child);

            return (
              <line
                key={`${parent}-${child}`}
                x1={parentNode.x}
                y1={parentNode.y}
                x2={childNode.x}
                y2={childNode.y}
                className={
                  isVisited
                    ? "practice-line visited"
                    : "practice-line"
                }
              />
            );
          })}

        </svg>


        {Object.values(TREE_NODES).map((node) => {

          const selectedIndex =
            selectedNodes.indexOf(node.id);

          const isSelected =
            selectedIndex !== -1;

          const isNext =
            nextNode === node.id;

          return (
            <button
              type="button"
              key={node.id}
              className={`
                practice-node
                ${isSelected ? "selected" : ""}
                ${isNext ? "next" : ""}
              `}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
              onClick={() => handleNodeClick(node.id)}
              disabled={
                selectedNodes.length === traversal.length
              }
              aria-label={`Node ${node.id}`}
            >

              <span>
                {node.id}
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


      {/* =================================
          SEQUENCE
      ================================= */}

      <div className="practice-sequence">

        <span>
          YOUR SEQUENCE
        </span>

        <div className="practice-sequence-items">

          {traversal.map((node, index) => {

            const selected =
              selectedNodes[index];

            return (
              <div
                key={`${node}-${index}`}
                className={
                  selected
                    ? "practice-sequence-node filled"
                    : "practice-sequence-node"
                }
              >
                {selected ?? "?"}
              </div>
            );
          })}

        </div>

      </div>


      {/* =================================
          FEEDBACK
      ================================= */}

      {feedback && (
        <div
          className={`
            practice-feedback
            ${feedback.type}
          `}
          aria-live="polite"
        >

          <strong>
            {feedback.title}
          </strong>

          <p>
            {feedback.message}
          </p>

        </div>
      )}


      {/* =================================
          RESET
      ================================= */}

      <div className="practice-actions">

        <button
          type="button"
          onClick={handleReset}
        >
          RESET PRACTICE
        </button>

      </div>

    </div>
  );
}

function getRule(type) {
  if (type === "PREORDER") {
    return "ROOT → LEFT → RIGHT";
  }

  if (type === "INORDER") {
    return "LEFT → ROOT → RIGHT";
  }

  if (type === "POSTORDER") {
    return "LEFT → RIGHT → ROOT";
  }

  return "TOP → BOTTOM, LEFT → RIGHT";
}

function getHint(type, nodeId) {
  if (type === "PREORDER") {
    return getPreorderHint(nodeId);
  }

  if (type === "INORDER") {
    return getInorderHint(nodeId);
  }

  if (type === "POSTORDER") {
    return getPostorderHint(nodeId);
  }

  return getLevelOrderHint(nodeId);
}

function getPreorderHint(nodeId) {
  if (nodeId === 10) {
    return "Start with the root. Which node is at the top?";
  }

  if (nodeId === 5) {
    return "You've visited the root. Move to its left child.";
  }

  if (nodeId === 2) {
    return "At node 5, visit its left child before its right child.";
  }

  if (nodeId === 7) {
    return "You've finished node 2. Return to node 5 and visit its right child.";
  }

  if (nodeId === 15) {
    return "You've finished the left subtree. Now visit the right subtree.";
  }

  return "Follow ROOT → LEFT → RIGHT.";
}

function getInorderHint(nodeId) {
  if (nodeId === 2) {
    return "In inorder, we visit the left subtree before the root.";
  }

  if (nodeId === 5) {
    return "You've reached the leftmost node. Now visit its parent.";
  }

  if (nodeId === 7) {
    return "After visiting node 5, move to its right subtree.";
  }

  if (nodeId === 10) {
    return "The left subtree of 10 is complete. Now visit 10.";
  }

  if (nodeId === 15) {
    return "The left subtree and root are complete. Now visit 15.";
  }

  return "Follow LEFT → ROOT → RIGHT.";
}

function getPostorderHint(nodeId) {
  if (nodeId === 2) {
    return "Postorder starts with the left subtree.";
  }

  if (nodeId === 7) {
    return "Node 2 is complete. Now finish the remaining child of node 5.";
  }

  if (nodeId === 5) {
    return "Both children of node 5 are complete. Now visit node 5.";
  }

  if (nodeId === 15) {
    return "The left subtree is complete. Now visit the right child of 10.";
  }

  if (nodeId === 10) {
    return "Both subtrees are complete. Now visit the root.";
  }

  return "Follow LEFT → RIGHT → ROOT.";
}

function getLevelOrderHint(nodeId) {
  if (nodeId === 10) {
    return "Start at the top of the tree.";
  }

  if (nodeId === 5) {
    return "After the root, move from left to right across the next level.";
  }

  if (nodeId === 15) {
    return "Visit the other node on the same level before going deeper.";
  }

  if (nodeId === 2) {
    return "The second level is complete. Now move to the next level.";
  }

  if (nodeId === 7) {
    return "Continue across the current level from left to right.";
  }

  return "Follow TOP → BOTTOM, LEFT → RIGHT.";
}

export default TraversalPractice;