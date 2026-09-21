import { Link } from "react-router-dom";

import SEO from "../components/SEO";
import BinaryTree from "../components/visualizations/BinaryTree";
import BinarySearchTreeSection from "../components/learning/BinarySearchTreeSection";
import TraversalSection from "../components/learning/TraversalSection";

function BinaryTreeLesson() {
  return (
    <>
      {/* =================================
          SEO
      ================================= */}

      <SEO
        title="Binary Trees Explained: Structure, BST Rules & Traversal"
        description="Learn binary trees through interactive visualizations. Understand binary tree structure, nodes, parents, children, leaves, Binary Search Tree rules, and tree traversal algorithms."
        path="/learn/binary-trees"
      />

      <main className="binary-tree-lesson">

        {/* =================================
            LESSON NAVIGATION
        ================================= */}

        <div className="lesson-navigation">

          <Link
            to="/learn"
            className="lesson-back"
          >
            <span aria-hidden="true">
              ←
            </span>

            BACK TO LESSONS
          </Link>

        </div>


        {/* =================================
            LESSON INTRODUCTION
        ================================= */}

        <header className="lesson-hero">

          <span className="section-label">
            LESSON 01 / BINARY TREES
          </span>

          <h1>
            Binary Trees:
            <br />
            <span>Structure & Traversal</span>
          </h1>

          <p>
            Learn how binary trees organize data,
            understand their structure and relationships,
            explore Binary Search Tree rules, and
            discover how tree traversal algorithms
            visit each node.
          </p>

        </header>


        {/* =================================
            01 — WHAT IS A BINARY TREE?
        ================================= */}

        <section
          className="lesson-section"
          aria-labelledby="what-is-a-binary-tree"
        >

          <span className="section-label">
            01 / BINARY TREE BASICS
          </span>

          <h2 id="what-is-a-binary-tree">
            What Is a Binary Tree?
          </h2>

          <p>
            A binary tree is a hierarchical data
            structure made up of nodes. Each node can
            have at most two children: a left child and
            a right child.
          </p>

          <p>
            Unlike a linear structure such as an array,
            data in a tree is organized through
            relationships between nodes.
          </p>

          <BinaryTree />

        </section>


        {/* =================================
            02 — BINARY SEARCH TREES
        ================================= */}

        <BinarySearchTreeSection />


        {/* =================================
            03 — TREE TRAVERSAL INTRODUCTION
        ================================= */}

        <section
          className="lesson-section traversal-introduction"
          aria-labelledby="tree-traversal"
        >

          <span className="section-label">
            03 / TREE TRAVERSAL
          </span>

          <h2 id="tree-traversal">
            What Is Tree Traversal?
          </h2>

          <p>
            Tree traversal is the process of visiting
            every node in a tree according to a specific
            order or rule.
          </p>

          <p>
            Different traversal algorithms visit the
            same tree in different sequences. Learning
            these patterns helps you understand how
            algorithms process hierarchical data.
          </p>


          <div className="traversal-definition">

            <span className="traversal-definition-label">
              THE IDEA
            </span>

            <p>
              The important part is not simply memorizing
              the resulting sequence. You need to understand
              how the algorithm moves through the tree.
            </p>

          </div>

        </section>


        {/* =================================
            04 — PREORDER TRAVERSAL
        ================================= */}

        <TraversalSection
          number="04"
          type="PREORDER"
          rule="ROOT → LEFT → RIGHT"
          title="Preorder Traversal: Visit the Root First"
          description="In preorder traversal, we visit the current node first, then traverse its left subtree, followed by its right subtree."
        />


        {/* =================================
            05 — INORDER TRAVERSAL
        ================================= */}

        <TraversalSection
          number="05"
          type="INORDER"
          rule="LEFT → ROOT → RIGHT"
          title="Inorder Traversal: Visit the Root Between Subtrees"
          description="In inorder traversal, we traverse the left subtree first, visit the current node, and then traverse the right subtree."
        />


        {/* =================================
            06 — POSTORDER TRAVERSAL
        ================================= */}

        <TraversalSection
          number="06"
          type="POSTORDER"
          rule="LEFT → RIGHT → ROOT"
          title="Postorder Traversal: Visit the Root Last"
          description="In postorder traversal, we traverse the left subtree first, then the right subtree, and visit the current node last."
        />


        {/* =================================
            07 — LEVEL ORDER TRAVERSAL
        ================================= */}

        <TraversalSection
          number="07"
          type="LEVEL ORDER"
          rule="TOP → BOTTOM, LEFT → RIGHT"
          title="Level Order Traversal: Visit Each Level"
          description="In level order traversal, we visit nodes one level at a time, starting at the root and moving from left to right."
        />


        {/* =================================
            LESSON SUMMARY
        ================================= */}

        <section
          className="lesson-section binary-tree-summary"
          aria-labelledby="binary-tree-summary"
        >

          <span className="section-label">
            LESSON SUMMARY
          </span>

          <h2 id="binary-tree-summary">
            What You Should Understand
          </h2>

          <div className="lesson-summary-grid">

            <article className="lesson-summary-item">

              <span>
                01
              </span>

              <h3>
                Binary Tree Structure
              </h3>

              <p>
                A binary tree organizes data through
                nodes and relationships, with each node
                having at most two children.
              </p>

            </article>


            <article className="lesson-summary-item">

              <span>
                02
              </span>

              <h3>
                Binary Search Tree Rules
              </h3>

              <p>
                A Binary Search Tree organizes values
                so smaller values go to the left and
                larger values go to the right.
              </p>

            </article>


            <article className="lesson-summary-item">

              <span>
                03
              </span>

              <h3>
                Tree Traversal
              </h3>

              <p>
                Traversal defines the order in which
                nodes are visited when processing a tree.
              </p>

            </article>


            <article className="lesson-summary-item">

              <span>
                04
              </span>

              <h3>
                Traversal Algorithms
              </h3>

              <p>
                Preorder, inorder, postorder, and level
                order traversal each follow a different
                strategy for visiting nodes.
              </p>

            </article>

          </div>

        </section>


        {/* =================================
            BACK TO LESSONS
        ================================= */}

        <div className="lesson-footer-navigation">

          <Link
            to="/learn"
            className="lesson-back"
          >
            <span aria-hidden="true">
              ←
            </span>

            BACK TO LESSONS
          </Link>

        </div>

      </main>
    </>
  );
}

export default BinaryTreeLesson;