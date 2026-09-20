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

const PREORDER = [10, 5, 2, 7, 15];

function TraversalPractice() {
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const nextNode = PREORDER[selectedNodes.length];

  function handleNodeClick(nodeId) {
    if (selectedNodes.length === PREORDER.length) {
      return;
    }

    if (nodeId === nextNode) {
      const updatedSelection = [
        ...selectedNodes,
        nodeId,
      ];

      setSelectedNodes(updatedSelection);
      setAttempts(0);

      if (updatedSelection.length === PREORDER.length) {
        setFeedback({
          type: "success",
          title: "Correct!",
          message:
            "You completed the preorder traversal: ROOT → LEFT → RIGHT.",
        });

        return;
      }

      setFeedback({
        type: "correct",
        title: "Correct.",
        message:
          "Good. Now continue following ROOT → LEFT → RIGHT.",
      });

      return;
    }

    const newAttempts = attempts + 1;

    setAttempts(newAttempts);

    if (newAttempts >= 2) {
      setFeedback({
        type: "hint",
        title: "Not yet.",
        message: getHint(nextNode),
      });
    } else {
      setFeedback({
        type: "wrong",
        title: "Not yet.",
        message:
          "Think about the preorder rule: ROOT → LEFT → RIGHT.",
      });
    }
  }

  function getHint(nodeId) {
    if (nodeId === 10) {
      return "Start with the root. Which node is at the top of the tree?";
    }

    if (nodeId === 5) {
      return "You've visited the root. Now move to its left child.";
    }

    if (nodeId === 2) {
      return "You're at node 5. Before moving to its right child, visit its left child.";
    }

    if (nodeId === 7) {
      return "You've finished node 2. Now return to node 5 and visit its right child.";
    }

    if (nodeId === 15) {
      return "You've finished the left subtree of 10. Now visit the right subtree.";
    }

    return "Follow ROOT → LEFT → RIGHT.";
  }

  function handleReset() {
    setSelectedNodes([]);
    setFeedback(null);
    setAttempts(0);
  }

  return (
    <div className="traversal-practice-container">

      {/* HEADER */}

      <div className="practice-header">

        <div>
          <span className="traversal-practice-label">
            YOUR TURN
          </span>

          <h3>
            Perform the preorder traversal.
          </h3>

          <p>
            Click the nodes in the correct order.
            Your progress will not reset when you make
            a mistake.
          </p>
        </div>

        <div className="practice-progress">
          <strong>
            {selectedNodes.length}
          </strong>

          <span>
            / {PREORDER.length}
          </span>
        </div>

      </div>


      {/* TREE */}

      <div className="practice-tree">

        <svg
          className="practice-tree-lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >

          {CONNECTIONS.map(([parent, child]) => {

            const parentNode = TREE_NODES[parent];
            const childNode = TREE_NODES[child];

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
                selectedNodes.length === PREORDER.length
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


      {/* CURRENT SEQUENCE */}

      <div className="practice-sequence">

        <span>
          YOUR SEQUENCE
        </span>

        <div className="practice-sequence-items">

          {PREORDER.map((node, index) => {

            const selected =
              selectedNodes[index];

            return (
              <div
                key={node}
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


      {/* FEEDBACK */}

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


      {/* RESET */}

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

export default TraversalPractice;