import { useState } from "react";
import { motion } from "framer-motion";

const ROTATION_INFO = {
  LL: {
    label: "LEFT-LEFT (LL)",
    short: "LL",
    description:
      "A new node was inserted into the left subtree of the left child.",
    balance: "+2",
    balanceText:
      "The left subtree is 2 levels taller than the right subtree.",
    path: "LEFT → LEFT",
    needed: "RIGHT ROTATION",
    demoTitle: "Right Rotation",

    before: {
      nodes: [
        { value: 30, x: 50, y: 23 },
        { value: 20, x: 35, y: 56 },
        { value: 10, x: 20, y: 88 },
      ],
      lines: [
        [50, 23, 35, 56],
        [35, 56, 20, 88],
      ],
    },

    after: {
      nodes: [
        { value: 20, x: 50, y: 28 },
        { value: 10, x: 30, y: 70 },
        { value: 30, x: 70, y: 70 },
      ],
      lines: [
        [50, 28, 30, 70],
        [50, 28, 70, 70],
      ],
    },
  },

  RR: {
    label: "RIGHT-RIGHT (RR)",
    short: "RR",
    description:
      "A new node was inserted into the right subtree of the right child.",
    balance: "-2",
    balanceText:
      "The right subtree is 2 levels taller than the left subtree.",
    path: "RIGHT → RIGHT",
    needed: "LEFT ROTATION",
    demoTitle: "Left Rotation",

    before: {
      nodes: [
        { value: 10, x: 50, y: 23 },
        { value: 20, x: 65, y: 56 },
        { value: 30, x: 80, y: 88 },
      ],
      lines: [
        [50, 23, 65, 56],
        [65, 56, 80, 88],
      ],
    },

    after: {
      nodes: [
        { value: 20, x: 50, y: 28 },
        { value: 10, x: 30, y: 70 },
        { value: 30, x: 70, y: 70 },
      ],
      lines: [
        [50, 28, 30, 70],
        [50, 28, 70, 70],
      ],
    },
  },

  LR: {
    label: "LEFT-RIGHT (LR)",
    short: "LR",
    description:
      "A new node was inserted into the right subtree of the left child.",
    balance: "+2",
    balanceText:
      "The left subtree is 2 levels taller than the right subtree.",
    path: "LEFT → RIGHT",
    needed: "LEFT → RIGHT",
    demoTitle: "Double Rotation",

    before: {
      nodes: [
        { value: 30, x: 50, y: 23 },
        { value: 10, x: 35, y: 56 },
        { value: 20, x: 50, y: 88 },
      ],
      lines: [
        [50, 23, 35, 56],
        [35, 56, 50, 88],
      ],
    },

    middle: {
      nodes: [
        { value: 30, x: 50, y: 23 },
        { value: 20, x: 35, y: 56 },
        { value: 10, x: 20, y: 88 },
      ],
      lines: [
        [50, 23, 35, 56],
        [35, 56, 20, 88],
      ],
    },

    after: {
      nodes: [
        { value: 20, x: 50, y: 28 },
        { value: 10, x: 30, y: 70 },
        { value: 30, x: 70, y: 70 },
      ],
      lines: [
        [50, 28, 30, 70],
        [50, 28, 70, 70],
      ],
    },
  },

  RL: {
    label: "RIGHT-LEFT (RL)",
    short: "RL",
    description:
      "A new node was inserted into the left subtree of the right child.",
    balance: "-2",
    balanceText:
      "The right subtree is 2 levels taller than the left subtree.",
    path: "RIGHT → LEFT",
    needed: "RIGHT → LEFT",
    demoTitle: "Double Rotation",

    before: {
      nodes: [
        { value: 10, x: 50, y: 23 },
        { value: 30, x: 65, y: 56 },
        { value: 20, x: 50, y: 88 },
      ],
      lines: [
        [50, 23, 65, 56],
        [65, 56, 50, 88],
      ],
    },

    middle: {
      nodes: [
        { value: 10, x: 50, y: 23 },
        { value: 20, x: 65, y: 56 },
        { value: 30, x: 80, y: 88 },
      ],
      lines: [
        [50, 23, 65, 56],
        [65, 56, 80, 88],
      ],
    },

    after: {
      nodes: [
        { value: 20, x: 50, y: 28 },
        { value: 10, x: 30, y: 70 },
        { value: 30, x: 70, y: 70 },
      ],
      lines: [
        [50, 28, 30, 70],
        [50, 28, 70, 70],
      ],
    },
  },
};

function AVLSection() {
  const [activeRotation, setActiveRotation] = useState("LL");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const rotation = ROTATION_INFO[activeRotation];

  const playRotation = () => {
    setIsPlaying(true);
    setIsComplete(false);
    setAnimationStep(0);

    if (
      activeRotation === "LR" ||
      activeRotation === "RL"
    ) {
      setTimeout(() => {
        setAnimationStep(1);
      }, 900);

      setTimeout(() => {
        setAnimationStep(2);
        setIsPlaying(false);
        setIsComplete(true);
      }, 1800);
    } else {
      setTimeout(() => {
        setAnimationStep(2);
        setIsPlaying(false);
        setIsComplete(true);
      }, 1400);
    }
  };

  const resetRotation = () => {
    setIsPlaying(false);
    setIsComplete(false);
    setAnimationStep(0);
  };

  const changeRotation = (nextRotation) => {
    setActiveRotation(nextRotation);
    setIsPlaying(false);
    setIsComplete(false);
    setAnimationStep(0);
  };

  const getStageData = () => {
    if (animationStep === 2 || isComplete) {
      return rotation.after;
    }

    if (
      animationStep === 1 &&
      (activeRotation === "LR" ||
        activeRotation === "RL")
    ) {
      return rotation.middle;
    }

    return rotation.before;
  };

  const stage = getStageData();

  return (
    <section className="avl-section">

      {/* =====================================================
          AVL INTRO
      ===================================================== */}

      <div className="avl-section-header">

        <div>

          <span className="section-label">
            03 / AVL TREES
          </span>

          <h2>
            Keeping a BST balanced.
          </h2>

          <p>
            An Adelson-Velskii Landis (AVL) tree is a
            self-balancing BST in which each node maintains
            extra information called a balance factor.
          </p>

        </div>

        <div className="avl-definition">

          <span>
            BALANCE FACTOR
          </span>

          <strong>
            -1, 0, +1
          </strong>

        </div>

      </div>


      {/* =====================================================
          BALANCE FACTOR
      ===================================================== */}

      <div className="avl-concept">

        <div className="avl-concept-copy">

          <span className="avl-label">
            01 / BALANCE FACTOR
          </span>

          <h3>
            How do we know if a tree is balanced?
          </h3>

          <p>
            In an AVL tree, the balance factor of a node is
            the difference between the height of the left
            subtree and the height of the right subtree.
          </p>

          <div className="avl-formula">
            Balance Factor = Height (Left Subtree) -
            Height (Right Subtree)
          </div>

        </div>


        <div className="avl-balance-example">

          <div className="avl-tree-diagram">

            <svg
              className="avl-tree-lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >

              <line
                x1="50"
                y1="30"
                x2="30"
                y2="68"
              />

              <line
                x1="50"
                y1="30"
                x2="70"
                y2="68"
              />

            </svg>


            <div className="avl-node avl-node-root">
              30
            </div>

            <div className="avl-node avl-node-left">
              20
            </div>

            <div className="avl-node avl-node-right">
              40
            </div>

          </div>


          <div className="avl-calculation">

            <span>
              NODE 30
            </span>

            <p>
              Left subtree height = <strong>1</strong>
            </p>

            <p>
              Right subtree height = <strong>1</strong>
            </p>


            <div className="avl-calculation-result">

              <span>
                Balance Factor
              </span>

              <strong>
                1 - 1 = 0
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          BALANCE RULES
      ===================================================== */}

      <div className="avl-balance-rules">

        <div>

          <strong>
            +1
          </strong>

          <span>
            Left subtree is taller by 1
          </span>

        </div>


        <div>

          <strong>
            0
          </strong>

          <span>
            Left and right subtrees are of equal height
          </span>

        </div>


        <div>

          <strong>
            -1
          </strong>

          <span>
            Right subtree is taller by 1
          </span>

        </div>

      </div>


      {/* =====================================================
          AVL PROPERTY
      ===================================================== */}

      <div className="avl-next">

        <span>
          AVL PROPERTY
        </span>

        <p>
          If the balance factor goes beyond -1 or +1,
          the tree self-balances using rotations.
        </p>

      </div>


      {/* =====================================================
          ROTATIONS
      ===================================================== */}

      <section className="avl-rotation-section">

        <div className="avl-rotation-header">

          <span className="avl-label">
            02 / ROTATIONS
          </span>

          <h3>
            Restoring balance.
          </h3>

          <p>
            When an insertion or deletion causes a node's
            balance factor to go beyond -1 or +1, rotations
            are applied to restore balance.
          </p>

        </div>


        {/* =================================================
            ROTATION TABS
        ================================================= */}

        <div className="avl-rotation-tabs">

          {["LL", "RR", "LR", "RL"].map(
            (type) => (

              <button
                key={type}
                type="button"
                className={`avl-rotation-tab ${
                  activeRotation === type
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  changeRotation(type)
                }
              >
                {type}
              </button>

            )
          )}

        </div>


        {/* =================================================
            ROTATION WORKSPACE
        ================================================= */}

        <div className="avl-rotation-workspace">


          {/* =================================================
              LEFT — IMBALANCE
          ================================================= */}

          <div className="avl-imbalance-panel">

            <span className="avl-label">
              {rotation.label}
            </span>


            <h4>
              The tree became unbalanced.
            </h4>


            <p className="avl-imbalance-description">
              {rotation.description}
            </p>


            {/* TREE */}

            <div className="avl-imbalance-tree">

              <svg
                className="avl-imbalance-lines"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >

                {rotation.before.lines.map(
                  (
                    [x1, y1, x2, y2],
                    index
                  ) => (

                    <line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                    />

                  )
                )}

              </svg>


              {rotation.before.nodes.map(
                (node, index) => (

                  <div
                    key={node.value}
                    className={`avl-imbalance-node ${
                      index === 0
                        ? "root"
                        : index === 1
                        ? "middle"
                        : "bottom"
                    }`}
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


            {/* BALANCE FACTOR */}

            <div className="avl-imbalance-factor">

              <span>
                BALANCE FACTOR
              </span>

              <strong>
                {rotation.balance}
              </strong>

              <p>
                {rotation.balanceText}
              </p>

            </div>


            {/* HEAVY PATH */}

            <div className="avl-heavy-path">

              <span>
                HEAVY PATH
              </span>

              <strong>
                {rotation.path}
              </strong>

            </div>


            {/* ROTATION NEEDED */}

            <div className="avl-needed-rotation">

              <span>
                ROTATION NEEDED
              </span>

              <strong>
                {rotation.needed}
              </strong>

            </div>

          </div>


          {/* =================================================
              RIGHT — ROTATION ANIMATION
          ================================================= */}

          <div className="avl-animation-panel">

            <div className="avl-animation-header">

              <div>

                <span className="avl-label">
                  ROTATION DEMO
                </span>

                <h4>
                  {rotation.demoTitle}
                </h4>

              </div>


              <span className="avl-animation-status">

                {isComplete
                  ? "BALANCED"
                  : isPlaying
                  ? "ROTATING..."
                  : "READY"}

              </span>

            </div>


            {/* =================================================
                ANIMATION TREE
            ================================================= */}

            <div className="avl-animation-stage">

              <svg
                className="avl-animation-lines"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >

                {stage.lines.map(
                  (
                    [x1, y1, x2, y2],
                    index
                  ) => (

                    <motion.line
                      key={`${activeRotation}-${animationStep}-line-${index}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                    />

                  )
                )}

              </svg>


              {stage.nodes.map(
                (node) => (

                  <motion.div
                    key={`${activeRotation}-${node.value}`}
                    className="avl-animation-node"
                    animate={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                    }}
                    transition={{
                      duration:
                        activeRotation === "LR" ||
                        activeRotation === "RL"
                          ? 0.8
                          : 1.1,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                  >
                    {node.value}
                  </motion.div>

                )
              )}

            </div>


            {/* =================================================
                ANIMATION EXPLANATION
            ================================================= */}

            <div className="avl-animation-explanation">


              {/* BEFORE */}

              {!isPlaying && !isComplete && (

                <>
                  <span>
                    BEFORE
                  </span>

                  <p>
                    Watch how the nodes move during the{" "}
                    {activeRotation === "LL"
                      ? "right"
                      : activeRotation === "RR"
                      ? "left"
                      : "double"}{" "}
                    rotation.
                  </p>
                </>

              )}


              {/* DOUBLE ROTATION */}

              {isPlaying &&
                (
                  activeRotation === "LR" ||
                  activeRotation === "RL"
                ) && (

                  <>
                    <span>
                      ROTATION{" "}
                      {animationStep === 0
                        ? "1"
                        : "2"}
                    </span>

                    <p>

                      {activeRotation === "LR"

                        ? animationStep === 0
                          ? "First, rotate 10 to the left."
                          : "Now, rotate 30 to the right."

                        : animationStep === 0
                        ? "First, rotate 30 to the right."
                        : "Now, rotate 10 to the left."}

                    </p>
                  </>

                )}


              {/* SINGLE ROTATION */}

              {isPlaying &&
                activeRotation !== "LR" &&
                activeRotation !== "RL" && (

                  <>
                    <span>
                      ROTATING
                    </span>

                    <p>
                      20 moves up and becomes the
                      new root.
                    </p>
                  </>

                )}


              {/* COMPLETE */}

              {isComplete && (

                <>
                  <span>

                    AFTER{" "}

                    {activeRotation === "LL"
                      ? "RIGHT"
                      : activeRotation === "RR"
                      ? "LEFT"
                      : "DOUBLE"}{" "}

                    ROTATION

                  </span>

                  <p>
                    The tree is balanced again.
                  </p>
                </>

              )}

            </div>


            {/* =================================================
                PLAY BUTTON
            ================================================= */}

            <button
              type="button"
              className="avl-play-button"
              onClick={
                isComplete
                  ? resetRotation
                  : playRotation
              }
            >

              <span className="avl-play-icon">

                {isComplete
                  ? "↻"
                  : "▶"}

              </span>


              {isComplete
                ? "REPLAY ROTATION"
                : "PLAY ROTATION"}

            </button>

          </div>

        </div>

      </section>

    </section>
  );
}

export default AVLSection;