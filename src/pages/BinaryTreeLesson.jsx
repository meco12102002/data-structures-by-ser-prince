import { Link } from "react-router-dom";
import { useState } from "react";

import SEO from "../components/SEO";
import AVLSection from "../components/learning/AVLSection";
import GeneratedTraversalPractice from "../components/activities/GeneratedTraversalPractice";
import BinarySearchTreeSection from "../components/learning/BinarySearchTreeSection";
import LessonSummary from "../components/learning/LessonSummary";
import TraversalSection from "../components/learning/TraversalSection";
import BinaryTree from "../components/visualizations/BinaryTree";
import {
  binaryTreeSummaryItems,
  binaryTreeTraversals,
} from "../data/binaryTreeLesson";

const binaryTreeLessonSections = [
  {
    title: "Binary Tree Basics",
    Component: BinaryTreeBasicsSection,
  },
  {
    title: "Binary Search Trees",
    Component: BinarySearchTreeSection,
  },
  {
    title: "AVL Trees",
    Component: AVLSection,
  },
  {
    title: "Tree Traversal",
    Component: TraversalIntroductionSection,
  },
  ...binaryTreeTraversals.map((traversal) => ({
    title: `${traversal.type} Traversal`,
    Component: () => (
      <TraversalSection {...traversal} />
    ),
  })),
  {
    title: "Generated Traversal Practice",
    Component: GeneratedTraversalPractice,
  },
  {
    title: "Lesson Summary",
    Component: () => (
      <LessonSummary items={binaryTreeSummaryItems} />
    ),
  },
];

function BinaryTreeLesson() {
  const [viewMode, setViewMode] = useState("default");
  const [activeSlide, setActiveSlide] = useState(0);
  const isSlideMode = viewMode === "slides";
  const ActiveSection =
    binaryTreeLessonSections[activeSlide].Component;

  return (
    <>
      <SEO
        title="Binary Trees Explained: Structure, BST Rules, AVL Trees & Traversal"
        description="Learn binary trees through interactive visualizations. Understand binary tree structure, Binary Search Tree rules, AVL Trees, balance factors, rotations, and tree traversal algorithms."
        path="/learn/binary-trees"
      />

      <main className="binary-tree-lesson">
        <div className="lesson-navigation">
          <Link
            to="/learn"
            className="lesson-back"
          >
            <span aria-hidden="true">
              {"<-"}
            </span>
            BACK TO LESSONS
          </Link>
        </div>

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
            explore Binary Search Tree rules, AVL Trees,
            and discover how tree traversal algorithms
            visit each node.
          </p>
        </header>

        <div className="lesson-view-switcher">
          <div>
            <span>LESSON VIEW</span>
            <strong>
              {isSlideMode
                ? `Slide ${activeSlide + 1} of ${binaryTreeLessonSections.length}`
                : "Default full lesson"}
            </strong>
          </div>

          <div className="lesson-view-toggle">
            <button
              type="button"
              className={!isSlideMode ? "active" : ""}
              onClick={() => setViewMode("default")}
            >
              DEFAULT
            </button>

            <button
              type="button"
              className={isSlideMode ? "active" : ""}
              onClick={() => setViewMode("slides")}
            >
              SLIDES
            </button>
          </div>
        </div>

        {isSlideMode ? (
          <div className="lesson-slide-shell">
            <div className="lesson-slide-topbar">
              <button
                type="button"
                onClick={() =>
                  setActiveSlide((current) =>
                    Math.max(current - 1, 0)
                  )
                }
                disabled={activeSlide === 0}
              >
                PREVIOUS
              </button>

              <select
                value={activeSlide}
                onChange={(event) =>
                  setActiveSlide(Number(event.target.value))
                }
                aria-label="Choose binary tree lesson slide"
              >
                {binaryTreeLessonSections.map((section, index) => (
                  <option value={index} key={section.title}>
                    {index + 1}. {section.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() =>
                  setActiveSlide((current) =>
                    Math.min(
                      current + 1,
                      binaryTreeLessonSections.length - 1
                    )
                  )
                }
                disabled={
                  activeSlide === binaryTreeLessonSections.length - 1
                }
              >
                NEXT
              </button>
            </div>

            <div className="lesson-slide-progress">
              <span
                style={{
                  width: `${
                    ((activeSlide + 1) / binaryTreeLessonSections.length) *
                    100
                  }%`,
                }}
              />
            </div>

            <ActiveSection />
          </div>
        ) : (
          binaryTreeLessonSections.map(({ title, Component }) => (
            <Component key={title} />
          ))
        )}

        <div className="lesson-footer-navigation">
          <Link
            to="/learn"
            className="lesson-back"
          >
            <span aria-hidden="true">
              {"<-"}
            </span>
            BACK TO LESSONS
          </Link>
        </div>
      </main>
    </>
  );
}

function BinaryTreeBasicsSection() {
  return (
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
  );
}

function TraversalIntroductionSection() {
  return (
    <section
      className="lesson-section traversal-introduction"
      aria-labelledby="tree-traversal"
    >
      <span className="section-label">
        04 / TREE TRAVERSAL
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
  );
}

export default BinaryTreeLesson;
