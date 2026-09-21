function AVLSection() {
  return (
    <section className="avl-section">
      <div className="avl-section-header">
        <div>
          <span className="section-label">03 / AVL TREES</span>

          <h2>Keeping a BST balanced.</h2>

          <p>
            An Adelson-Velskii Landis (AVL) tree is a
            self-balancing BST in which each node maintains
            extra information called a balance factor.
          </p>
        </div>

        <div className="avl-definition">
          <span>BALANCE FACTOR</span>
          <strong>-1, 0, +1</strong>
        </div>
      </div>

      <div className="avl-concept">
        <div className="avl-concept-copy">
          <span className="avl-label">01 / BALANCE FACTOR</span>

          <h3>How do we know if a tree is balanced?</h3>

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
            <span>NODE 30</span>

            <p>
              Left subtree height = <strong>1</strong>
            </p>

            <p>
              Right subtree height = <strong>1</strong>
            </p>

            <div className="avl-calculation-result">
              <span>Balance Factor</span>

              <strong>1 - 1 = 0</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="avl-balance-rules">
        <div>
          <strong>+1</strong>
          <span>Left subtree is taller by 1</span>
        </div>

        <div>
          <strong>0</strong>
          <span>Left and right subtrees are of equal height</span>
        </div>

        <div>
          <strong>-1</strong>
          <span>Right subtree is taller by 1</span>
        </div>
      </div>

      <div className="avl-next">
        <span>AVL PROPERTY</span>

        <p>
          If the balance factor goes beyond -1 or +1,
          the tree self-balances using rotations.
        </p>
      </div>

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


  <div className="avl-rotation-demo">

    <div className="avl-rotation-tabs">

      <button className="avl-rotation-tab active">
        LL
      </button>

      <button className="avl-rotation-tab">
        RR
      </button>

      <button className="avl-rotation-tab">
        LR
      </button>

      <button className="avl-rotation-tab">
        RL
      </button>

    </div>


    <div className="avl-rotation-content">

      <div className="avl-rotation-info">

        <span className="avl-label">
          LEFT-LEFT (LL) ROTATION
        </span>

        <h4>
          Insertion happens in the LEFT subtree
          of the LEFT child.
        </h4>

        <div className="avl-rotation-rule">

          <span>
            IMBALANCE
          </span>

          <p>
            Balance Factor of 30 = +2
          </p>

          <p>
            Left child 20 is also left-heavy.
          </p>

        </div>

        <div className="avl-rotation-action">

          <span>
            ROTATION
          </span>

          <strong>
            RIGHT ROTATION
          </strong>

        </div>

      </div>


      <div className="avl-rotation-visual">

        <div className="avl-rotation-stage">

          <div className="avl-rotation-tree">

            <svg
              className="avl-tree-lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line
                x1="50"
                y1="25"
                x2="35"
                y2="65"
              />

              <line
                x1="35"
                y1="65"
                x2="20"
                y2="90"
              />
            </svg>

            <div className="avl-node rotation-node-root">
              30
            </div>

            <div className="avl-node rotation-node-middle">
              20
            </div>

            <div className="avl-node rotation-node-bottom">
              10
            </div>

          </div>

        </div>

        <div className="avl-rotation-result">

          <span>
            AFTER RIGHT ROTATION
          </span>

          <div className="avl-result-tree">

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

            <div className="avl-node result-node-root">
              20
            </div>

            <div className="avl-node result-node-left">
              10
            </div>

            <div className="avl-node result-node-right">
              30
            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>
    </section>
  );
}

export default AVLSection;