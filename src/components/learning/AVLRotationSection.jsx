import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const stages = {
  imbalance: "imbalance",
  identify: "identify",
  rotation: "rotation",
  balanced: "balanced",
};

function AVLRotationSection() {
  const [stage, setStage] = useState(stages.imbalance);

  const nextStage = () => {
    if (stage === stages.imbalance) {
      setStage(stages.identify);
    } else if (stage === stages.identify) {
      setStage(stages.rotation);
    } else if (stage === stages.rotation) {
      setStage(stages.balanced);
    }
  };

  const reset = () => {
    setStage(stages.imbalance);
  };

  return (
    <section className="avl-rotation-section">

      {/* HEADER */}
      <div className="avl-section-header">
        <div>
          <span className="section-label">04 / ROTATIONS</span>

          <h2>Fixing an Imbalanced Tree</h2>

          <p>
            AVL trees use rotations to restore balance when a node becomes
            too heavy on one side.
          </p>
        </div>
      </div>

      {/* CURRENT STEP */}
      <div className="avl-rotation-step">
        <span className="section-label">
          STEP {stage === stages.imbalance ? "1" : stage === stages.identify ? "2" : stage === stages.rotation ? "3" : "4"}
        </span>

        <h3>
          {stage === stages.imbalance && "Find the imbalance"}
          {stage === stages.identify && "Identify the heavy path"}
          {stage === stages.rotation && "Choose the rotation"}
          {stage === stages.balanced && "Balance restored"}
        </h3>

        <p>
          {stage === stages.imbalance &&
            "The tree has become too tall on the left side."}

          {stage === stages.identify &&
            "Follow the path where the extra height was added."}

          {stage === stages.rotation &&
            "The tree is left-heavy twice: Left → Left."}

          {stage === stages.balanced &&
            "The right rotation moves the middle node up and restores balance."}
        </p>
      </div>

      {/* MAIN VISUALIZATION */}
      <div className="avl-rotation-workspace">

        {/* TREE */}
        <div className="avl-rotation-visual">

          <div className="avl-rotation-visual-label">
            {stage === stages.balanced
              ? "BALANCED TREE"
              : "IMBALANCED TREE"}
          </div>

          <div className="avl-animation-tree">

            {/* CONNECTIONS */}
            <svg
              className="avl-animation-lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {stage !== stages.balanced ? (
                <>
                  <motion.line
                    x1="50"
                    y1="25"
                    x2="35"
                    y2="55"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  <motion.line
                    x1="35"
                    y1="55"
                    x2="20"
                    y2="85"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  />
                </>
              ) : (
                <>
                  <motion.line
                    x1="50"
                    y1="30"
                    x2="30"
                    y2="70"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  <motion.line
                    x1="50"
                    y1="30"
                    x2="70"
                    y2="70"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  />
                </>
              )}
            </svg>

            {/* NODE 30 */}
            <motion.div
              className={`avl-animation-node node-30 ${
                stage === stages.rotation ? "rotation-source" : ""
              }`}
              animate={
                stage === stages.balanced
                  ? {
                      left: "50%",
                      top: "30%",
                    }
                  : {
                      left: "50%",
                      top: "20%",
                    }
              }
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              30
            </motion.div>

            {/* NODE 20 */}
            <motion.div
              className={`avl-animation-node node-20 ${
                stage === stages.identify ? "path-highlight" : ""
              }`}
              animate={
                stage === stages.balanced
                  ? {
                      left: "50%",
                      top: "30%",
                    }
                  : {
                      left: "35%",
                      top: "55%",
                    }
              }
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              20
            </motion.div>

            {/* NODE 10 */}
            <motion.div
              className="avl-animation-node node-10"
              animate={
                stage === stages.balanced
                  ? {
                      left: "30%",
                      top: "70%",
                    }
                  : {
                      left: "20%",
                      top: "85%",
                    }
              }
              transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              10
            </motion.div>

          </div>

        </div>

        {/* INFORMATION PANEL */}
        <div className="avl-rotation-info">

          {/* BALANCE FACTOR */}
          <div className="avl-balance-card">
            <span>Balance Factor</span>

            <strong
              className={
                stage === stages.balanced
                  ? "balance-good"
                  : "balance-danger"
              }
            >
              {stage === stages.balanced ? "0" : "+2"}
            </strong>

            <p>
              {stage === stages.balanced
                ? "The tree is balanced."
                : "The left subtree is 2 levels taller."}
            </p>
          </div>

          {/* IDENTIFICATION */}
          <AnimatePresence mode="wait">
            {stage === stages.identify && (
              <motion.div
                className="avl-path-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span>HEAVY PATH</span>

                <strong>
                  LEFT → LEFT
                </strong>

                <p>
                  The new node was inserted into the left subtree
                  of the left child.
                </p>
              </motion.div>
            )}

            {stage === stages.rotation && (
              <motion.div
                className="avl-rotation-answer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <span>ROTATION NEEDED</span>

                <strong>
                  RIGHT ROTATION
                </strong>

                <p>
                  This is an <strong>LL case</strong>.
                </p>
              </motion.div>
            )}

            {stage === stages.balanced && (
              <motion.div
                className="avl-balanced-answer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>BALANCE RESTORED</span>

                <strong>
                  20 IS NOW THE ROOT
                </strong>

                <p>
                  The right rotation moved 20 above 30,
                  restoring balance to the tree.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTION */}
          <div className="avl-rotation-actions">

            {stage !== stages.balanced ? (
              <button
                className="avl-rotation-button"
                onClick={nextStage}
              >
                {stage === stages.imbalance &&
                  "IDENTIFY IMBALANCE"}

                {stage === stages.identify &&
                  "SHOW ROTATION"}

                {stage === stages.rotation &&
                  "APPLY RIGHT ROTATION"}

                <span>→</span>
              </button>
            ) : (
              <button
                className="avl-rotation-button secondary"
                onClick={reset}
              >
                ↻ REPLAY ROTATION
              </button>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}

export default AVLRotationSection;