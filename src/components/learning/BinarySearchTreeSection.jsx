import { useState } from "react";

const rules = [
  {
    number: "01",
    title: "Smaller values go left.",
    description:
      "When a value is smaller than the current node, it belongs in the left subtree.",
    example: "8 < 10",
    direction: "GO LEFT",
  },
  {
    number: "02",
    title: "Larger values go right.",
    description:
      "When a value is greater than the current node, it belongs in the right subtree.",
    example: "15 > 10",
    direction: "GO RIGHT",
  },
  {
    number: "03",
    title: "Every subtree follows the same rule.",
    description:
      "The ordering rule continues at every node. Each left and right subtree must also follow the Binary Search Tree rules.",
    example: "5 → 2, 7",
    direction: "RECURSIVE",
  },
];

const examples = [
  {
    label: "VALID BST",
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
    label: "INVALID BST",
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

function BinarySearchTreeSection() {
  const [activeRule, setActiveRule] = useState(0);
  const [activeExample, setActiveExample] = useState(0);

  const rule = rules[activeRule];
  const example = examples[activeExample];

  return (
    <section className="bst-section">

      {/* =================================
          SECTION HEADER
      ================================= */}

      <div className="bst-section-header">

        <span className="section-label">
          02 / BINARY SEARCH TREES
        </span>

        <h2>
          What makes a
          <br />
          <span>Binary Search Tree?</span>
        </h2>

        <p>
          A Binary Search Tree is a binary tree that
          follows a specific ordering rule. Once you
          understand the rule, searching and inserting
          values becomes much easier to reason about.
        </p>

      </div>


      {/* =================================
          CORE RULE
      ================================= */}

      <div className="bst-core">

        <div className="bst-core-label">
          THE CORE RULE
        </div>

        <div className="bst-core-rule">
          <span>LEFT</span>

          <strong>
            &lt; NODE &lt;
          </strong>

          <span>RIGHT</span>
        </div>

        <p>
          Values smaller than a node belong on its
          left. Values greater than a node belong on
          its right.
        </p>

      </div>


      {/* =================================
          BST RULES
      ================================= */}

      <div className="bst-rules">

        <div className="bst-rules-heading">

          <span className="section-label">
            THE RULES
          </span>

          <p>
            A valid Binary Search Tree must maintain
            these rules throughout the entire structure.
          </p>

        </div>


        <div className="bst-rule-layout">

          {/* RULE LIST */}

          <div className="bst-rule-list">

            {rules.map((item, index) => (

              <button
                key={item.number}
                type="button"
                className={`bst-rule-button ${
                  activeRule === index ? "active" : ""
                }`}
                onClick={() => setActiveRule(index)}
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


          {/* RULE DETAIL */}

          <div className="bst-rule-detail">

            <span className="bst-detail-label">
              RULE {rule.number}
            </span>

            <h3>
              {rule.title}
            </h3>

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

          </div>

        </div>

      </div>


      {/* =================================
          VALIDATION ACTIVITY
      ================================= */}

      <div className="bst-validation">

        <div className="bst-validation-header">

          <span className="section-label">
            TRY TO SPOT THE RULE
          </span>

          <h3>
            Is this a valid Binary Search Tree?
          </h3>

          <p>
            Compare the position of each value with
            the node above it. Look carefully.
          </p>

        </div>


        {/* TREE */}

        <div className="bst-validation-container">

          <div className="bst-validation-status">
            {example.label}
          </div>


          <div
            className="bst-validation-tree"
            role="img"
            aria-label={
              example.valid
                ? "A valid Binary Search Tree"
                : "An invalid Binary Search Tree"
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


            {example.nodes.map((node) => (

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

            ))}

          </div>


          {/* EXPLANATION */}

          <div className="bst-validation-explanation">

            {example.valid ? (

              <>
                <span className="bst-valid-label">
                  VALID
                </span>

                <p>
                  Every smaller value is placed in the
                  left subtree and every larger value is
                  placed in the right subtree.
                </p>
              </>

            ) : (

              <>
                <span className="bst-invalid-label">
                  INVALID
                </span>

                <p>
                  The value <strong>15</strong> is placed
                  on the left side of <strong>10</strong>.
                  Because 15 is greater than 10, it should
                  belong on the right.
                </p>
              </>

            )}

          </div>

        </div>


        {/* EXAMPLE CONTROLS */}

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
              onClick={() => setActiveExample(index)}
            >
              {item.label}
            </button>

          ))}

        </div>

      </div>


      {/* =================================
          NEXT CONCEPT
      ================================= */}

      <div className="bst-next">

        <span className="section-label">
          NEXT
        </span>

        <h3>
          Now, let's insert a value.
        </h3>

        <p>
          Once you understand the ordering rule,
          you can use it to determine exactly where
          a new value belongs.
        </p>

      </div>

    </section>
  );
}

export default BinarySearchTreeSection;