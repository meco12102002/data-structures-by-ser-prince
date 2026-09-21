import { Link } from "react-router-dom";

import BinaryTree from "../components/visualizations/BinaryTree";
import TraversalSection from "../components/learning/TraversalSection";

function BinaryTreeLesson() {
  return (
    <main className="binary-tree-lesson">

      {/* =================================
          LESSON NAVIGATION
      ================================= */}

      <div className="lesson-navigation">
        <Link to="/learn" className="lesson-back">
          <span>←</span>
          BACK TO LESSONS
        </Link>
      </div>


      {/* =================================
          LESSON INTRO
      ================================= */}

      <section className="lesson-hero">

        <span className="section-label">
          LESSON 01 / BINARY TREES
        </span>

        <h1>
          Understand
          <br />
          <span>Binary Trees.</span>
        </h1>

        <p>
          Learn how binary trees organize data,
          understand their parts, and explore how
          we traverse them.
        </p>

      </section>


      {/* =================================
          01 — WHAT IS A BINARY TREE?
      ================================= */}

      <section className="lesson-section">

        <span className="section-label">
          01 / INTRODUCTION
        </span>

        <h2>
          What is a Binary Tree?
        </h2>

        <p>
          A binary tree is a data structure where
          each node can have at most two children:
          a left child and a right child.
        </p>

        <BinaryTree />

      </section>


      {/* =================================
          02 — TRAVERSAL INTRODUCTION
      ================================= */}

      <section className="lesson-section traversal-introduction">

        <span className="section-label">
          02 / TRAVERSAL
        </span>

        <h2>
          How do we read a tree?
        </h2>

        <p>
          Traversal is the process of visiting each
          node in a tree according to a specific rule.
          Different rules produce different visiting
          orders.
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
          03 — PREORDER
      ================================= */}

      <TraversalSection
        number="03"
        type="PREORDER"
        rule="ROOT → LEFT → RIGHT"
        title="Visit the root first."
        description="In preorder traversal, we visit the current node first, then traverse its left subtree, followed by its right subtree."
      />


      {/* =================================
          04 — INORDER
      ================================= */}

      <TraversalSection
        number="04"
        type="INORDER"
        rule="LEFT → ROOT → RIGHT"
        title="Visit the root between the subtrees."
        description="In inorder traversal, we traverse the left subtree first, visit the current node, and then traverse the right subtree."
      />


      {/* =================================
          05 — POSTORDER
      ================================= */}

      <TraversalSection
        number="05"
        type="POSTORDER"
        rule="LEFT → RIGHT → ROOT"
        title="Visit the root last."
        description="In postorder traversal, we traverse the left subtree first, then the right subtree, and visit the current node last."
      />


      {/* =================================
          06 — LEVEL ORDER
      ================================= */}

      <TraversalSection
        number="06"
        type="LEVEL ORDER"
        rule="TOP → BOTTOM, LEFT → RIGHT"
        title="Read the tree level by level."
        description="In level order traversal, we visit nodes one level at a time, starting at the root and moving from left to right."
      />

    </main>
  );
}

export default BinaryTreeLesson;