import { useState } from "react";

const rules = [
  {
    number: "01",
    title: "Smaller values go left.",
    description:
      "If a value is smaller than the current node, follow the left branch.",
    example: "8 < 10",
    direction: "GO LEFT",
  },
  {
    number: "02",
    title: "Larger values go right.",
    description:
      "If a value is greater than the current node, follow the right branch.",
    example: "15 > 10",
    direction: "GO RIGHT",
  },
  {
    number: "03",
    title: "The rule continues at every node.",
    description:
      "After moving left or right, compare the value again with the new node until the correct position is found.",
    example: "7 > 5",
    direction: "COMPARE AGAIN",
  },
];

const examples = [
  {
    label: "VALID",
    valid: true,

    nodes: [
      { value: 10, x: 50, y: 18 },
      { value: 5, x: 30, y: 55 },
      { value: 15, x: 70, y: 55 },
      { value: 2, x: 20, y: 88 },
      { value: 7, x: 40, y: 88 },
    ],

    connections: [
      [10, 5],
      [10, 15],
      [5, 2],
      [5, 7],
    ],
  },

  {
    label: "INVALID",
    valid: false,

    nodes: [
      { value: 10, x: 50, y: 18 },
      { value: 15, x: 30, y: 55 },
      { value: 5, x: 70, y: 55 },
    ],

    connections: [
      [10, 15],
      [10, 5],
    ],
  },
];

const insertionValues = [
  10,
  5,
  15,
  2,
  7,
  12,
  20,
];

const initialTree = [
  {
    value: 10,
    x: 50,
    y: 16,
    parent: null,
    side: null,
    level: 0,
  },
];

function getChildPosition(parent, side) {
  const levelGap = 27;
  const horizontalGap = Math.max(
    7,
    25 - parent.level * 5
  );

  return {
    x:
      side === "left"
        ? parent.x - horizontalGap
        : parent.x + horizontalGap,

    y: parent.y + levelGap,

    level: parent.level + 1,
  };
}

function findComparisonNode(tree, value) {
  let current = tree.find(
    (node) => node.parent === null
  );

  while (current) {
    if (value < current.value) {
      const leftChild = tree.find(
        (node) =>
          node.parent === current.value &&
          node.side === "left"
      );

      if (!leftChild) {
        return {
          node: current,
          direction: "left",
        };
      }

      current = leftChild;
      continue;
    }

    if (value > current.value) {
      const rightChild = tree.find(
        (node) =>
          node.parent === current.value &&
          node.side === "right"
      );

      if (!rightChild) {
        return {
          node: current,
          direction: "right",
        };
      }

      current = rightChild;
      continue;
    }

    return null;
  }

  return null;
}

function BinarySearchTreeSection() {
  const [activeRule, setActiveRule] = useState(0);
  const [activeExample, setActiveExample] = useState(0);

  const [tree, setTree] = useState(initialTree);
  const [currentValueIndex, setCurrentValueIndex] =
    useState(1);

  const [feedback, setFeedback] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);

  const rule = rules[activeRule];
  const example = examples[activeExample];

  const currentValue =
    insertionValues[currentValueIndex];

  const comparison =
    currentValue !== undefined
      ? findComparisonNode(
          tree,
          currentValue
        )
      : null;

  function resetInsertionActivity() {
    setTree(initialTree);
    setCurrentValueIndex(1);
    setFeedback(null);
    setAttempts(0);
    setCompleted(false);
  }

  function handleDirection(selectedDirection) {
    if (!comparison || completed) {
      return;
    }

    const correctDirection =
      comparison.direction;

    if (
      selectedDirection === correctDirection
    ) {
      const parent = comparison.node;

      const position = getChildPosition(
        parent,
        selectedDirection
      );

      const newNode = {
        value: currentValue,
        x: position.x,
        y: position.y,
        parent: parent.value,
        side: selectedDirection,
        level: position.level,
      };

      const updatedTree = [
        ...tree,
        newNode,
      ];

      setTree(updatedTree);

      setFeedback({
        type: "correct",
        message:
          selectedDirection === "left"
            ? `${currentValue} is smaller than ${parent.value}. Move left.`
            : `${currentValue} is greater than ${parent.value}. Move right.`,
      });

      const nextIndex =
        currentValueIndex + 1;

      if (
        nextIndex >= insertionValues.length
      ) {
        setCompleted(true);
        setCurrentValueIndex(
          insertionValues.length
        );
        return;
      }

      setCurrentValueIndex(nextIndex);
      setAttempts(0);

      return;
    }

    const parent = comparison.node;

    const correctText =
      correctDirection === "left"
        ? "LEFT"
        : "RIGHT";

    const strongerHint =
      attempts >= 1
        ? `${currentValue} ${
            currentValue < parent.value
              ? "<"
              : ">"
          } ${parent.value}.`
        : `Compare ${currentValue} with ${parent.value}.`;

    setAttempts(
      (previous) => previous + 1
    );

    setFeedback({
      type: "wrong",
      message:
        `Not quite. ${strongerHint} ` +
        `The correct direction is ${correctText}.`,
    });
  }

  return (
    <section
      className="bst-section"
      aria-labelledby="binary-search-tree-heading"
    >

      {/* =================================
          INTRODUCTION
      ================================= */}

      <header className="bst-section-header">

        <span className="section-label">
          02 / BINARY SEARCH TREES
        </span>

        <h2 id="binary-search-tree-heading">
          Binary Search Trees:
          <br />
          <span>Rules and Structure</span>
        </h2>

        <p>
          A Binary Search Tree (BST) is a type of
          binary tree that organizes values according
          to an ordering rule. That rule determines
          where values belong and helps us search for
          data efficiently.
        </p>

      </header>


      {/* =================================
          WHAT IS A BST
      ================================= */}

      <section
        className="bst-concept"
        aria-labelledby="what-is-a-binary-search-tree"
      >

        <span className="bst-content-label">
          WHAT IS A BINARY SEARCH TREE?
        </span>

        <h3 id="what-is-a-binary-search-tree">
          A binary tree with an ordering rule.
        </h3>

        <p>
          Smaller values belong in the left subtree,
          while larger values belong in the right
          subtree. The same rule continues at every
          node.
        </p>

      </section>


      {/* =================================
          RULES
      ================================= */}

      <section
        className="bst-rules"
        aria-labelledby="binary-search-tree-rules"
      >

        <div className="bst-rules-heading">

          <span className="bst-content-label">
            BINARY SEARCH TREE RULES
          </span>

          <h3 id="binary-search-tree-rules">
            Three rules to remember
          </h3>

        </div>


        <div className="bst-rule-layout">

          <div className="bst-rule-list">

            {rules.map((item, index) => (

              <button
                key={item.number}
                type="button"
                className={`bst-rule-button ${
                  activeRule === index
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveRule(index)
                }
                aria-pressed={
                  activeRule === index
                }
              >

                <span className="bst-rule-number">
                  {item.number}
                </span>

                <span className="bst-rule-title">
                  {item.title}
                </span>

                <span
                  className="bst-rule-arrow"
                  aria-hidden="true"
                >
                  →
                </span>

              </button>

            ))}

          </div>


          <article className="bst-rule-detail">

            <span className="bst-detail-label">
              RULE {rule.number}
            </span>

            <h4>
              {rule.title}
            </h4>

            <p>
              {rule.description}
            </p>

            <div className="bst-rule-example">

              <div className="bst-example-node">
                10
              </div>

              <div className="bst-example-comparison">

                <span className="bst-comparison-value">
                  {rule.example}
                </span>

                <span className="bst-comparison-direction">
                  {rule.direction}
                </span>

              </div>

            </div>

          </article>

        </div>

      </section>


      {/* =================================
          BST EXAMPLE
      ================================= */}

      <section
        className="bst-example"
        aria-labelledby="binary-search-tree-example"
      >

        <div className="bst-example-header">

          <span className="bst-content-label">
            BINARY SEARCH TREE EXAMPLE
          </span>

          <h3 id="binary-search-tree-example">
            See the rules in a real tree.
          </h3>

          <p>
            Start at the root and compare each value
            with the node above it.
          </p>

        </div>


        <div className="bst-example-container">

          <div
            className="bst-example-tree"
            role="img"
            aria-label="Binary Search Tree containing 10 as the root, with 5 and 15 as children and 2 and 7 below 5"
          >

            <svg
              className="bst-tree-lines"
              viewBox="0 0 100 110"
              preserveAspectRatio="none"
              aria-hidden="true"
            >

              {examples[0].connections.map(
                ([parent, child]) => {

                  const parentNode =
                    examples[0].nodes.find(
                      (node) =>
                        node.value === parent
                    );

                  const childNode =
                    examples[0].nodes.find(
                      (node) =>
                        node.value === child
                    );

                  return (
                    <line
                      key={`${parent}-${child}`}
                      x1={parentNode.x}
                      y1={parentNode.y}
                      x2={childNode.x}
                      y2={childNode.y}
                    />
                  );
                }
              )}

            </svg>


            {examples[0].nodes.map(
              (node) => (

                <div
                  key={node.value}
                  className="bst-validation-node"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  }}
                >
                  {node.value}
                </div>

              )
            )}

          </div>


          <div className="bst-example-explanation">

            <div className="bst-example-step">
              <span>01</span>

              <p>
                <strong>10</strong> is the
                root node.
              </p>
            </div>

            <div className="bst-example-step">
              <span>02</span>

              <p>
                <strong>5</strong> is smaller
                than 10, so it goes left.
              </p>
            </div>

            <div className="bst-example-step">
              <span>03</span>

              <p>
                <strong>15</strong> is greater
                than 10, so it goes right.
              </p>
            </div>

            <div className="bst-example-step">
              <span>04</span>

              <p>
                The same rule continues for
                every subtree.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =================================
          VALID / INVALID
      ================================= */}

      <section
        className="bst-validation"
        aria-labelledby="valid-invalid-bst"
      >

        <div className="bst-validation-header">

          <span className="bst-content-label">
            CHECK YOUR UNDERSTANDING
          </span>

          <h3 id="valid-invalid-bst">
            Valid vs. Invalid Binary Search Trees
          </h3>

          <p>
            Compare each value with its parent and
            check whether it is on the correct side.
          </p>

        </div>


        <div className="bst-validation-container">

          <div className="bst-validation-status">
            {example.label}
          </div>


          <div
            className="bst-validation-tree"
            role="img"
            aria-label={
              example.valid
                ? "Valid Binary Search Tree"
                : "Invalid Binary Search Tree"
            }
          >

            <svg
              className="bst-tree-lines"
              viewBox="0 0 100 110"
              preserveAspectRatio="none"
              aria-hidden="true"
            >

              {example.connections.map(
                ([parent, child]) => {

                  const parentNode =
                    example.nodes.find(
                      (node) =>
                        node.value === parent
                    );

                  const childNode =
                    example.nodes.find(
                      (node) =>
                        node.value === child
                    );

                  return (
                    <line
                      key={`${parent}-${child}`}
                      x1={parentNode.x}
                      y1={parentNode.y}
                      x2={childNode.x}
                      y2={childNode.y}
                    />
                  );
                }
              )}

            </svg>


            {example.nodes.map(
              (node) => (

                <div
                  key={node.value}
                  className="bst-validation-node"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  }}
                >
                  {node.value}
                </div>

              )
            )}

          </div>


          <div className="bst-validation-explanation">

            {example.valid ? (

              <>
                <span className="bst-valid-label">
                  VALID
                </span>

                <h4>
                  Every value is on the correct side.
                </h4>

                <p>
                  Smaller values are in the left
                  subtree and larger values are in
                  the right subtree.
                </p>
              </>

            ) : (

              <>
                <span className="bst-invalid-label">
                  INVALID
                </span>

                <h4>
                  The ordering rule is broken.
                </h4>

                <p>
                  <strong>15</strong> is greater
                  than <strong>10</strong>, but it
                  is placed on the left side.
                </p>
              </>

            )}

          </div>

        </div>


        <div className="bst-example-controls">

          {examples.map((item, index) => (

            <button
              key={item.label}
              type="button"
              className={
                activeExample === index
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveExample(index)
              }
              aria-pressed={
                activeExample === index
              }
            >
              {item.label}
            </button>

          ))}

        </div>

      </section>


      {/* =================================
          INSERTION ACTIVITY
      ================================= */}

      <section
        className="bst-insertion"
        aria-labelledby="binary-search-tree-insertion"
      >

        <header className="bst-insertion-header">

          <span className="bst-content-label">
            INTERACTIVE ACTIVITY
          </span>

          <h3 id="binary-search-tree-insertion">
            Build a Binary Search Tree
          </h3>

          <p>
            Use the BST rules to insert each value.
            At every step, compare the value with the
            current node and decide whether to go
            <strong> LEFT</strong> or
            <strong> RIGHT</strong>.
          </p>

        </header>


        {/* =================================
            INSERTION WORKSPACE
        ================================= */}

        <div className="bst-insertion-workspace">

          {/* =================================
              LEFT — DECISION PANEL
          ================================= */}

          <div className="bst-insertion-panel">

            <div className="bst-panel-header">

              <span>
                BUILD YOUR TREE
              </span>

              <span>
                {Math.min(
                  currentValueIndex,
                  insertionValues.length - 1
                )}{" "}
                /{" "}
                {insertionValues.length - 1}
              </span>

            </div>


            {/* VALUES */}

            <div className="bst-insertion-values">

              <span className="bst-insertion-values-label">
                VALUES TO INSERT
              </span>

              <div className="bst-value-list">

                {insertionValues.map(
                  (value, index) => (

                    <div
                      key={value}
                      className={`bst-value-item ${
                        index < currentValueIndex
                          ? "completed"
                          : index ===
                              currentValueIndex
                            ? "current"
                            : ""
                      }`}
                    >
                      {value}
                    </div>

                  )
                )}

              </div>

            </div>


            {!completed ? (

              <div className="bst-task">

                <span className="bst-task-label">
                  CURRENT VALUE
                </span>

                <div className="bst-task-value">
                  {currentValue}
                </div>


                <div className="bst-comparison-card">

                  <span>
                    COMPARE
                  </span>

                  <strong>
                    {currentValue}
                  </strong>

                  <span>
                    WITH
                  </span>

                  <strong>
                    {comparison?.node?.value}
                  </strong>

                </div>


                <p className="bst-task-question">
                  Which direction should
                  <strong> {currentValue}</strong>{" "}
                  go?
                </p>


                {/* DECISION BUTTONS */}

                <div className="bst-direction-buttons">

                  <button
                    type="button"
                    className="bst-direction-button"
                    onClick={() =>
                      handleDirection("left")
                    }
                  >

                    <span className="bst-direction-symbol">
                      ←
                    </span>

                    <span>
                      GO LEFT
                    </span>

                    <small>
                      {currentValue} &lt;{" "}
                      {comparison?.node?.value}
                    </small>

                  </button>


                  <button
                    type="button"
                    className="bst-direction-button"
                    onClick={() =>
                      handleDirection("right")
                    }
                  >

                    <span className="bst-direction-symbol">
                      →
                    </span>

                    <span>
                      GO RIGHT
                    </span>

                    <small>
                      {currentValue} &gt;{" "}
                      {comparison?.node?.value}
                    </small>

                  </button>

                </div>


                {/* FEEDBACK */}

                {feedback && (

                  <div
                    className={`bst-insertion-feedback ${
                      feedback.type
                    }`}
                    role="status"
                  >

                    <span>
                      {feedback.type ===
                      "correct"
                        ? "CORRECT"
                        : "TRY AGAIN"}
                    </span>

                    <p>
                      {feedback.message}
                    </p>

                  </div>

                )}

              </div>

            ) : (

              <div
                className="bst-insertion-complete"
                role="status"
              >

                <span className="bst-content-label">
                  COMPLETE
                </span>

                <h4>
                  You built a valid BST.
                </h4>

                <p>
                  You successfully applied the
                  Binary Search Tree rules to
                  place every value.
                </p>

                <button
                  type="button"
                  className="bst-reset-button"
                  onClick={
                    resetInsertionActivity
                  }
                >
                  BUILD AGAIN
                </button>

              </div>

            )}


            {!completed && (

              <button
                type="button"
                className="bst-reset-button bst-reset-inline"
                onClick={
                  resetInsertionActivity
                }
              >
                RESET ACTIVITY
              </button>

            )}

          </div>


          {/* =================================
              RIGHT — LIVE TREE
          ================================= */}

          <div className="bst-live-tree-panel">

            <div className="bst-live-tree-header">

              <span>
                CURRENT TREE
              </span>

              <span>
                {tree.length}{" "}
                {tree.length === 1
                  ? "NODE"
                  : "NODES"}
              </span>

            </div>


            <div
              className="bst-live-tree"
              role="img"
              aria-label="Current Binary Search Tree being built"
            >

              <svg
                className="bst-tree-lines"
                viewBox="0 0 100 110"
                preserveAspectRatio="none"
                aria-hidden="true"
              >

                {tree
                  .filter(
                    (node) =>
                      node.parent !== null
                  )
                  .map((node) => {

                    const parent =
                      tree.find(
                        (item) =>
                          item.value ===
                          node.parent
                      );

                    if (!parent) {
                      return null;
                    }

                    return (
                      <line
                        key={`${node.parent}-${node.value}`}
                        x1={parent.x}
                        y1={parent.y}
                        x2={node.x}
                        y2={node.y}
                      />
                    );
                  })}

              </svg>


              {tree.map((node) => (

                <div
                  key={node.value}
                  className="bst-insertion-node"
                  style={{
                    left: `${node.x}%`,
                    top: `${node.y}%`,
                  }}
                >
                  {node.value}
                </div>

              ))}

            </div>


            {!completed && comparison && (

              <div className="bst-tree-hint">

                <span>
                  CURRENT COMPARISON
                </span>

                <strong>
                  {currentValue}{" "}
                  {currentValue <
                  comparison.node.value
                    ? "<"
                    : ">"}{" "}
                  {comparison.node.value}
                </strong>

                <p>
                  Decide where the value should
                  go from here.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =================================
          NEXT CONCEPT
      ================================= */}

      <section
        className="bst-next"
        aria-labelledby="bst-next-concept"
      >

        <span className="section-label">
          NEXT CONCEPT
        </span>

        <h3 id="bst-next-concept">
          How to Search a Binary Search Tree
        </h3>

        <p>
          Now that you can build a Binary Search Tree,
          the next step is to use its ordering rules
          to find a specific value.
        </p>

      </section>

    </section>
  );
}

export default BinarySearchTreeSection;