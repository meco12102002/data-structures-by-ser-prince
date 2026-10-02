import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import SEO from "../components/SEO";
import InfoPopover from "../components/learning/InfoPopover";
import {
  HeapArrayView,
  HeapIndexDetails,
  HeapStepControls,
  HeapTree,
  HeapTypeToggle,
  useHeapSteps,
} from "../components/learning/heaps/HeapVisuals";
import {
  DEFAULT_MAX_HEAP,
  DEFAULT_MIN_HEAP,
  buildHeap,
  extractRoot,
  insertHeap,
  isValidHeap,
  replaceRoot,
} from "../utils/heap";

const operationCards = [
  {
    title: "Insert / Push",
    text: "Add the new value at the next open position, then up-heapify.",
    note: "Heapify needed: up-heapify",
  },
  {
    title: "Extract Root / Pop",
    text: "Remove the root, move the last value to the root, then down-heapify.",
    note: "Heapify needed: down-heapify",
  },
  {
    title: "Peek / Get Root",
    text: "Read the root value without changing the heap.",
    note: "Heapify needed: no",
  },
  {
    title: "Replace",
    text: "Replace the root with a new value, then restore heap order.",
    note: "Heapify needed: down-heapify",
  },
  {
    title: "removeMax",
    text: "A Max-Heap removal operation that returns the maximum root value.",
    note: "Same core idea as Extract Root for a Max-Heap",
  },
];

const terminologyCards = [
  {
    term: "Heap Data Structure",
    definition:
      "A complete binary tree that follows a heap-order property.",
  },
  {
    term: "Complete Binary Tree / Shape Property",
    definition:
      "Nodes fill level by level from left to right with no skipped spots.",
  },
  {
    term: "Heap Order Property",
    definition:
      "Parents must stay ordered against their children: greater for Max-Heap, smaller for Min-Heap.",
  },
  {
    term: "Max-Heap",
    definition:
      "A heap where the parent is greater than or equal to its children; the maximum value is at the root.",
  },
  {
    term: "Min-Heap",
    definition:
      "A heap where the parent is less than or equal to its children; the minimum value is at the root.",
  },
  {
    term: "Heapify",
    definition:
      "The process of restoring heap order after an insert, extract, replace, or remove operation.",
  },
  {
    term: "Up-Heapify / Bubble-Up",
    definition:
      "After insertion, compare the new value with its parent and swap upward when the heap order is violated.",
  },
  {
    term: "Down-Heapify / Bubble-Down",
    definition:
      "After removing or replacing the root, compare downward and swap with the higher-priority child.",
  },
  {
    term: "Priority Queue",
    definition:
      "A queue where removal is based on priority rather than insertion order.",
  },
  {
    term: "Array Implementation",
    definition:
      "Using a 1-based array: root at array[1], left child at 2k, right child at 2k + 1, parent at k / 2.",
  },
  {
    term: "Insert / Push",
    definition:
      "Place the value in the next open spot, then up-heapify.",
  },
  {
    term: "Extract Root / Pop / removeMax",
    definition:
      "Remove the root, move the final element to the root, then down-heapify.",
  },
  {
    term: "Peek / Get Root",
    definition:
      "Read the root without removing it or changing the heap.",
  },
  {
    term: "Replace",
    definition:
      "Replace the root with a new value, then down-heapify to restore heap order.",
  },
  {
    term: "Java PriorityQueue",
    definition:
      "Java's built-in priority queue is a Min-Heap by default; reverse order can make it behave like a Max-Heap.",
  },
];

const validationExamples = [
  {
    label: "A",
    heap: [50, 30, 20, 15, 10, 8, 5],
    answer: "max",
  },
  {
    label: "B",
    heap: [5, 10, 15, 30, 20, 50, 40],
    answer: "min",
  },
  {
    label: "C",
    heap: [50, 30, 60, 15, 10, 8, 5],
    answer: "invalid",
  },
];

const heapTypeExamples = [
  {
    heap: [50, 30, 20, 15, 10, 8, 5],
    answer: "max",
    explanation:
      "Every parent is greater than or equal to its children, so this is a valid Max-Heap.",
  },
  {
    heap: [5, 10, 15, 30, 20, 50, 40],
    answer: "min",
    explanation:
      "Every parent is less than or equal to its children, so this is a valid Min-Heap.",
  },
  {
    heap: [50, 30, 60, 15, 10, 8, 5],
    answer: "invalid",
    violation: [0, 2],
    explanation:
      "60 is a child of 50, and 60 > 50. That breaks the Max-Heap rule. It is also not a Min-Heap because 50 > 30.",
  },
  {
    heap: [8, 12, 10, 20, 25, 15, 30],
    answer: "min",
    explanation:
      "Each parent is smaller than its children, so the smallest value stays at the root.",
  },
  {
    heap: [42, 35, 28, 18, 30, 12, 20],
    answer: "max",
    explanation:
      "42 stays at the root, and every parent is greater than or equal to its children.",
  },
  {
    heap: [10, 20, 15, 8, 25, 30, 40],
    answer: "invalid",
    violation: [1, 3],
    explanation:
      "8 is below 20, which breaks the Min-Heap rule. The root 10 also cannot make this a Max-Heap.",
  },
];

const priorityJobs = [
  {
    name: "Department Chair",
    priority: 1,
  },
  {
    name: "Professor",
    priority: 2,
  },
  {
    name: "Graduate Student",
    priority: 3,
  },
  {
    name: "Undergraduate",
    priority: 4,
  },
];

const heapLessonSections = [
  {
    title: "Heap Data Structure",
    Component: HeapIntroSection,
  },
  {
    title: "Shape Property",
    Component: HeapShapeSection,
  },
  {
    title: "Max vs Min Heap",
    Component: HeapTypeSection,
  },
  {
    title: "Array Representation",
    Component: HeapArraySection,
  },
  {
    title: "Heap Explorer",
    Component: HeapPlaygroundSection,
  },
  {
    title: "Heapify",
    Component: HeapifySection,
  },
  {
    title: "Operations",
    Component: OperationCards,
  },
  {
    title: "Key Terms",
    Component: HeapTermsSection,
  },
  {
    title: "Priority Queues",
    Component: PriorityQueueSection,
  },
  {
    title: "Java PriorityQueue",
    Component: JavaPriorityQueueSection,
  },
  {
    title: "Predict Practice",
    Component: HeapPracticeSection,
  },
  {
    title: "Validation",
    Component: HeapValidationSection,
  },
  {
    title: "Array Indexes",
    Component: ArrayIndexExercise,
  },
  {
    title: "Applications",
    Component: HeapApplications,
  },
];

function HeapLesson() {
  const [viewMode, setViewMode] = useState("default");
  const [activeSlide, setActiveSlide] = useState(0);
  const ActiveSection = heapLessonSections[activeSlide].Component;
  const isSlideMode = viewMode === "slides";

  return (
    <>
      <SEO
        title="Heaps and Priority Queues | Interactive DSA Lesson"
        description="Learn heaps and priority queues with visual heap operations, array mapping, heapify animations, Java PriorityQueue examples, and interactive practice."
        path="/learn/heaps-and-priority-queues"
        type="article"
        keywords={[
          "heaps",
          "priority queues",
          "heapify",
          "max heap",
          "min heap",
          "Java PriorityQueue",
          "array heap representation",
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: "Heaps and Priority Queues",
          url: "https://data-structures-by-ser-prince.vercel.app/learn/heaps-and-priority-queues",
          description:
            "An interactive lesson about heaps, priority queues, heapify, array representation, and Java PriorityQueue behavior.",
          learningResourceType: "lesson",
          educationalLevel: "Beginner",
          teaches: [
            "Heap shape property",
            "Max-Heap and Min-Heap rules",
            "Heapify operations",
            "Priority queue behavior",
            "Java PriorityQueue",
          ],
        }}
      />

      <main className="heap-lesson">
        <div className="lesson-navigation">
          <Link to="/learn" className="lesson-back">
            <span aria-hidden="true">{"<-"}</span>
            BACK TO LESSONS
          </Link>
        </div>

        <header className="lesson-hero">
          <span className="section-label">
            LESSON 07 / HEAPS AND PRIORITY QUEUES
          </span>

          <h1>
            Heaps:
            <br />
            <span>Priority in action.</span>
          </h1>

          <p>
            Learn how heaps keep the highest or lowest
            priority value at the root while storing the
            tree compactly inside an array.
          </p>
        </header>

        <div className="heap-view-switcher">
          <div>
            <span>LESSON VIEW</span>
            <strong>
              {isSlideMode
                ? `Slide ${activeSlide + 1} of ${heapLessonSections.length}`
                : "Default full lesson"}
            </strong>
          </div>

          <div className="heap-toggle">
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
          <div className="heap-slide-shell">
            <div className="heap-slide-topbar">
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
                aria-label="Choose heap lesson slide"
              >
                {heapLessonSections.map((section, index) => (
                  <option value={index} key={section.title}>
                    {index + 1}. {section.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() =>
                  setActiveSlide((current) =>
                    Math.min(current + 1, heapLessonSections.length - 1)
                  )
                }
                disabled={activeSlide === heapLessonSections.length - 1}
              >
                NEXT
              </button>
            </div>

            <div className="heap-slide-progress">
              <span
                style={{
                  width: `${((activeSlide + 1) / heapLessonSections.length) * 100}%`,
                }}
              />
            </div>

            <ActiveSection />
          </div>
        ) : (
          heapLessonSections.map(({ title, Component }) => (
            <Component key={title} />
          ))
        )}

        <div className="lesson-footer-navigation">
          <Link to="/learn" className="lesson-back">
            <span aria-hidden="true">{"<-"}</span>
            BACK TO LESSONS
          </Link>
        </div>
      </main>
    </>
  );
}

function HeapIntroSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const heap = DEFAULT_MAX_HEAP;
  const selectedValue = heap[selectedIndex];
  const parentIndex =
    selectedIndex > 0 ? Math.floor((selectedIndex - 1) / 2) : null;
  const leftIndex = selectedIndex * 2 + 1;
  const rightIndex = selectedIndex * 2 + 2;
  const activeIndices = [
    selectedIndex,
    parentIndex,
    leftIndex < heap.length ? leftIndex : null,
    rightIndex < heap.length ? rightIndex : null,
  ].filter((index) => index !== null);

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">01 / HEAP DATA STRUCTURE</span>
      <div className="heap-section-heading">
        <h2>A heap is a complete binary tree with priority rules.</h2>
        <InfoPopover title="Why does the root matter?">
          The root is the fastest value to access. A Max-Heap keeps the
          largest value there, while a Min-Heap keeps the smallest value there.
        </InfoPopover>
      </div>
      <p>
        In a Max-Heap, every parent is greater than or
        equal to its children. That keeps the maximum
        value at the root.
      </p>

      <div className="heap-two-column">
        <HeapTree
          heap={heap}
          selectedIndex={selectedIndex}
          activeIndices={activeIndices}
          onSelect={setSelectedIndex}
          label="Clickable max heap"
        />

        <div className="heap-explanation-card">
          <span>SELECTED NODE</span>
          <strong>{selectedValue}</strong>
          {selectedIndex === 0 ? (
            <p>{selectedValue} is the root and contains the maximum value.</p>
          ) : (
            <p>
              {heap[parentIndex]} is the parent of {selectedValue}.
            </p>
          )}
          {leftIndex < heap.length && (
            <p>Left child: {heap[leftIndex]}</p>
          )}
          {rightIndex < heap.length && (
            <p>Right child: {heap[rightIndex]}</p>
          )}
        </div>
      </div>
    </section>
  );
}

function HeapShapeSection() {
  const [shape, setShape] = useState("valid");
  const validHeap = [50, 30, 20, 15, 10, 8];
  const invalidNodes = [
    {
      value: 50,
      index: 0,
      x: 50,
      y: 13,
    },
    {
      value: 30,
      index: 1,
      x: 33,
      y: 39,
    },
    {
      value: 20,
      index: 2,
      x: 67,
      y: 39,
    },
    {
      value: 15,
      index: 3,
      x: 22,
      y: 67,
    },
    {
      value: null,
      index: 4,
      x: 44,
      y: 67,
      missing: true,
    },
    {
      value: 8,
      index: 5,
      x: 56,
      y: 67,
    },
  ];

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">02 / SHAPE PROPERTY</span>
      <div className="heap-section-heading">
        <h2>Heap nodes fill level by level, left to right.</h2>
        <InfoPopover title="Why insert at the next spot?">
          Heaps must stay complete. Inserting at the next open position keeps
          the tree compact and lets the array formulas keep working.
        </InfoPopover>
      </div>
      <p>
        A new heap value is inserted into the next open
        position so the tree stays complete.
      </p>

      <div className="heap-toggle">
        <button
          type="button"
          className={shape === "valid" ? "active" : ""}
          onClick={() => setShape("valid")}
        >
          VALID HEAP SHAPE
        </button>
        <button
          type="button"
          className={shape === "invalid" ? "active" : ""}
          onClick={() => setShape("invalid")}
        >
          INVALID SHAPE
        </button>
      </div>

      {shape === "valid" ? (
        <HeapTree
          heap={validHeap}
          label="Valid complete heap shape"
        />
      ) : (
        <IncompleteHeapTree nodes={invalidNodes} />
      )}

      <div className="heap-callout">
        {shape === "valid"
          ? "This is complete: every level is filled from left to right."
          : "This skips a spot before adding a later node, so it is not a complete binary tree."}
      </div>
    </section>
  );
}

function IncompleteHeapTree({ nodes }) {
  const connections = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
  ];

  return (
    <div
      className="heap-tree incomplete-heap-tree"
      role="img"
      aria-label="Invalid complete binary tree shape with a skipped left-to-right position"
    >
      <svg
        className="heap-tree-lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {connections.map(([parentIndex, childIndex]) => {
          const parent = nodes.find((node) => node.index === parentIndex);
          const child = nodes.find((node) => node.index === childIndex);

          return (
            <line
              key={`${parentIndex}-${childIndex}`}
              x1={parent.x}
              y1={parent.y}
              x2={child.x}
              y2={child.y}
              className={child.missing ? "missing" : ""}
            />
          );
        })}
      </svg>

      {nodes.map((node) => (
        <div
          key={node.index}
          className={[
            "heap-node",
            node.missing ? "missing-slot" : "",
          ].join(" ")}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
          }}
        >
          <span>{node.missing ? "SKIP" : node.value}</span>
          <small>#{node.index + 1}</small>
        </div>
      ))}
    </div>
  );
}

function HeapTypeSection() {
  const [type, setType] = useState("max");
  const [answer, setAnswer] = useState(null);
  const [exampleIndex, setExampleIndex] = useState(0);
  const heap = type === "max" ? DEFAULT_MAX_HEAP : DEFAULT_MIN_HEAP;
  const example = heapTypeExamples[exampleIndex];
  const feedbackIsCorrect = answer === example.answer;

  function generateExample() {
    setExampleIndex(
      (current) => (current + 1) % heapTypeExamples.length
    );
    setAnswer(null);
  }

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">03 / MAX-HEAP VS MIN-HEAP</span>
      <div className="heap-section-heading">
        <h2>The root changes depending on the priority rule.</h2>
        <InfoPopover title="Why two heap types?">
          Use a Max-Heap when the biggest value has priority. Use a Min-Heap
          when the smallest value has priority, like shortest distance or
          earliest event time.
        </InfoPopover>
      </div>

      <HeapTypeToggle type={type} onChange={setType} />

      <div className="heap-two-column">
        <HeapTree heap={heap} activeIndices={[0]} />
        <div className="heap-explanation-card">
          <span>{type === "max" ? "MAX-HEAP" : "MIN-HEAP"}</span>
          <strong>{heap[0]}</strong>
          <p>
            {type === "max"
              ? "Parent >= children, so the largest value stays at the root."
              : "Parent <= children, so the smallest value stays at the root."}
          </p>
        </div>
      </div>

      <div className="heap-check-card">
        <span>CHECK THE HEAP</span>
        <p>What kind of heap is this example?</p>
        <HeapTree
          heap={example.heap}
          activeIndices={answer && example.violation ? example.violation : []}
        />
        <div className="heap-inline-actions">
          <button type="button" onClick={() => setAnswer("max")}>
            VALID MAX-HEAP
          </button>
          <button type="button" onClick={() => setAnswer("min")}>
            VALID MIN-HEAP
          </button>
          <button type="button" onClick={() => setAnswer("invalid")}>
            NOT A HEAP
          </button>
          <button type="button" onClick={generateExample}>
            GENERATE EXAMPLE
          </button>
        </div>
        {answer && (
          <p className={feedbackIsCorrect ? "correct" : "wrong"}>
            {feedbackIsCorrect ? "Correct. " : "Not quite. "}
            {example.explanation}
          </p>
        )}
      </div>
    </section>
  );
}

function HeapArraySection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const heap = DEFAULT_MAX_HEAP;

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">04 / ARRAY IMPLEMENTATION</span>
      <div className="heap-section-heading">
        <h2>A heap tree can be stored in an array.</h2>
        <InfoPopover title="Why use an array?">
          Because a complete tree has no gaps, each node's parent and children
          can be found with simple index math instead of storing pointers.
        </InfoPopover>
      </div>
      <p>
        Following 1-based indexing:
        root = array[1], left child = array[k * 2],
        right child = array[k * 2 + 1], parent = array[k / 2].
      </p>

      <div className="heap-two-column">
        <HeapTree
          heap={heap}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
        <div>
          <HeapArrayView
            heap={heap}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
          <HeapIndexDetails heap={heap} selectedIndex={selectedIndex} />
        </div>
      </div>
    </section>
  );
}

function HeapPlaygroundSection() {
  const [type, setType] = useState("max");
  const [heap, setHeap] = useState(DEFAULT_MAX_HEAP);
  const [value, setValue] = useState("40");
  const [message, setMessage] = useState("Try inserting, peeking, replacing, or extracting the root.");

  function reset(nextType = type) {
    setHeap(nextType === "max" ? DEFAULT_MAX_HEAP : DEFAULT_MIN_HEAP);
    setMessage("Heap reset.");
  }

  function changeType(nextType) {
    setType(nextType);
    reset(nextType);
  }

  function readValue() {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">05 / INTERACTIVE HEAP EXPLORER</span>
      <div className="heap-section-heading">
        <h2>Change the heap and watch the structure update.</h2>
        <InfoPopover title="Why does the tree keep changing?">
          Every operation first keeps the shape complete, then swaps values
          until the heap-order property becomes true again.
        </InfoPopover>
      </div>

      <div className="heap-playground-layout">
        <div className="heap-playground-guide">
          <article>
            <span>1 / CHOOSE THE RULE</span>
            <p>
              Max-Heap keeps the largest value at the root.
              Min-Heap keeps the smallest value at the root.
            </p>
            <HeapTypeToggle type={type} onChange={changeType} />
          </article>

          <article>
            <span>2 / SET A VALUE</span>
            <p>
              This value is used by Insert and Replace.
            </p>
            <label>
              VALUE TO USE
              <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                inputMode="numeric"
              />
            </label>
          </article>

          <article>
            <span>3 / TRY AN OPERATION</span>
            <p>
              Pick one action. The live preview on the right updates immediately.
            </p>
            <div className="heap-operation-grid">
              <button type="button" onClick={() => {
                const nextValue = readValue();
                if (nextValue === null) {
                  setMessage("Enter a number before inserting.");
                  return;
                }
                const result = insertHeap(heap, nextValue, type);
                setHeap(result.heap);
                setMessage(`Insert: ${nextValue} is placed at the next open spot, then up-heapify restores heap order.`);
              }}>
                <strong>INSERT</strong>
                <small>Add the value, then bubble it up if needed.</small>
              </button>

              <button type="button" onClick={() => {
                const result = extractRoot(heap, type);
                setHeap(result.heap);
                setMessage(result.root === null ? "Extract Root: the heap is empty." : `Extract Root: removed ${result.root}, moved the last value to the root, then down-heapified.`);
              }}>
                <strong>EXTRACT ROOT</strong>
                <small>Remove the root, then restore the heap.</small>
              </button>

              <button type="button" onClick={() => setMessage(heap.length ? `Peek: the root is ${heap[0]}. Nothing is removed.` : "Peek: the heap is empty.")}>
                <strong>PEEK</strong>
                <small>Look at the root without changing anything.</small>
              </button>

              <button type="button" onClick={() => {
                const nextValue = readValue();
                if (nextValue === null) {
                  setMessage("Enter a number before replacing the root.");
                  return;
                }
                const result = replaceRoot(heap, nextValue, type);
                setHeap(result.heap);
                setMessage(`Replace: root became ${nextValue}, then down-heapify restored heap order.`);
              }}>
                <strong>REPLACE</strong>
                <small>Swap in the value at the root, then fix downward.</small>
              </button>
            </div>
          </article>

          <article>
            <span>4 / START OVER</span>
            <p>
              Reset returns to the original example. Generate creates a fresh heap.
            </p>
            <div className="heap-playground-secondary-actions">
              <button type="button" onClick={() => reset()}>RESET</button>
              <button type="button" onClick={() => {
                const source = [18, 45, 7, 32, 60, 12];
                setHeap(buildHeap(source, type));
                setMessage("Generate Heap: built a new heap from 18, 45, 7, 32, 60, 12.");
              }}>GENERATE HEAP</button>
            </div>
          </article>
        </div>

        <aside className="heap-playground-output" aria-live="polite">
          <div className="heap-playground-output-header">
            <span>LIVE OUTPUT</span>
            <strong>{type === "max" ? "MAX-HEAP" : "MIN-HEAP"}</strong>
          </div>

          <HeapTree heap={heap} />
          <HeapArrayView heap={heap} />

          <div className="heap-callout">
            <strong>WHAT JUST HAPPENED?</strong>
            <p>{message}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function HeapifySection() {
  return (
    <section className="lesson-section heap-section">
      <span className="section-label">06 / HEAPIFY VISUALIZATIONS</span>
      <div className="heap-section-heading">
        <h2>Heapify restores the heap-order property.</h2>
        <InfoPopover title="Why heapify?">
          Insert and extract can temporarily put a value in the wrong place.
          Heapify moves that value upward or downward until every parent-child
          relationship follows the rule again.
        </InfoPopover>
      </div>
      <div className="heap-demo-grid">
        <HeapifyDemo mode="insert" />
        <HeapifyDemo mode="extract" />
      </div>
    </section>
  );
}

function HeapifyDemo({ mode }) {
  const result = useMemo(() => {
    if (mode === "insert") {
      return insertHeap([50, 30, 20, 15, 10, 8], 40, "max");
    }

    return extractRoot([50, 40, 20, 30, 10, 8, 15], "max");
  }, [mode]);

  const {
    steps,
    currentStep,
    current,
    isPlaying,
    setCurrentStep,
    setIsPlaying,
  } = useHeapSteps(result.steps);

  return (
    <article className="heap-demo-card">
      <span>{mode === "insert" ? "UP-HEAPIFY / BUBBLE-UP" : "DOWN-HEAPIFY / BUBBLE-DOWN"}</span>
      <h3>{mode === "insert" ? "Insert 40" : "Extract root 50"}</h3>
      <HeapTree
        heap={current.heap}
        activeIndices={current.activeIndices}
      />
      <HeapArrayView
        heap={current.heap}
        activeIndices={current.activeIndices}
      />
      <p>{current.message}</p>
      <HeapStepControls
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </article>
  );
}

function OperationCards() {
  return (
    <section className="lesson-section heap-section">
      <span className="section-label">07 / HEAP OPERATIONS</span>
      <div className="heap-section-heading">
        <h2>Every operation protects shape first, then heap order.</h2>
        <InfoPopover title="Why this order?">
          Shape decides where nodes are allowed to live. Heap order decides
          which values must move after that position is chosen.
        </InfoPopover>
      </div>
      <div className="heap-card-grid">
        {operationCards.map((card) => (
          <article className="heap-info-card" key={card.title}>
            <span>{card.title}</span>
            <p>{card.text}</p>
            <strong>{card.note}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

function HeapTermsSection() {
  return (
    <section className="lesson-section heap-section">
      <span className="section-label">08 / KEY TERMS</span>
      <div className="heap-section-heading">
        <h2>Important heap terms to remember.</h2>
        <InfoPopover title="Why a terms section?">
          These are the exact ideas that keep showing up in heap questions,
          code, and operation traces.
        </InfoPopover>
      </div>

      <div className="heap-card-grid heap-terms-grid">
        {terminologyCards.map((item) => (
          <article className="heap-info-card" key={item.term}>
            <span>{item.term}</span>
            <p>{item.definition}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PriorityQueueSection() {
  const [queue, setQueue] = useState(priorityJobs);
  const [processed, setProcessed] = useState(null);
  const heapValues = buildHeap(queue.map((job) => job.priority), "min");

  function processNext() {
    if (queue.length === 0) {
      setProcessed(null);
      return;
    }

    const next = [...queue].sort((a, b) => a.priority - b.priority)[0];
    setQueue(queue.filter((job) => job.name !== next.name));
    setProcessed(next);
  }

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">09 / PRIORITY QUEUES</span>
      <div className="heap-section-heading">
        <h2>A priority queue processes priority, not insertion order.</h2>
        <InfoPopover title="Why not first-in, first-out?">
          Some systems care about urgency more than arrival time. A heap lets
          the next highest-priority item be found quickly.
        </InfoPopover>
      </div>
      <div className="heap-two-column">
        <div className="heap-explanation-card">
          <span>PRINTER QUEUE</span>
          <div className="heap-inline-actions">
            {priorityJobs.map((job) => (
              <button
                type="button"
                key={job.name}
                onClick={() => {
                  if (queue.some((item) => item.name === job.name)) {
                    return;
                  }

                  setQueue([...queue, job]);
                  setProcessed(null);
                }}
              >
                ADD {job.name.toUpperCase()}
              </button>
            ))}
          </div>
          {queue.map((job) => (
            <p key={job.name}>{job.name}: priority {job.priority}</p>
          ))}
          <div className="heap-inline-actions">
            <button type="button" onClick={processNext}>PROCESS NEXT JOB</button>
            <button type="button" onClick={() => {
              setQueue(priorityJobs);
              setProcessed(null);
            }}>RESET</button>
          </div>
          {processed && <p className="correct">Processed: {processed.name}</p>}
        </div>
        <div>
          <HeapTree heap={heapValues} />
          <HeapArrayView heap={heapValues} />
        </div>
      </div>
    </section>
  );
}

function JavaPriorityQueueSection() {
  const [mode, setMode] = useState("min");
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const steps = getJavaPriorityQueueSteps(mode);
  const current = steps[step];
  const codeLines = getJavaPriorityQueueCode(mode);
  const speedDelay = {
    slow: 1400,
    normal: 900,
    fast: 450,
  }[speed];

  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [mode]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (step >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setStep((currentStep) =>
        Math.min(currentStep + 1, steps.length - 1)
      );
    }, speedDelay);

    return () => clearTimeout(timer);
  }, [isPlaying, speedDelay, step, steps.length]);

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">10 / JAVA PRIORITYQUEUE</span>
      <div className="heap-section-heading">
        <h2>Java's PriorityQueue returns values by priority order.</h2>
        <InfoPopover title="Why does poll change the order?">
          Java's PriorityQueue stores values by priority internally, so polling
          returns the smallest value by default, not the first inserted value.
        </InfoPopover>
      </div>
      <div className="java-pq-visualizer">
        <div className="java-pq-header">
          <div>
            <span>JAVA PRIORITYQUEUE RUN</span>
            <h3>
              {mode === "min"
                ? "Default PriorityQueue"
                : "PriorityQueue with Collections.reverseOrder()"}
            </h3>
          </div>

          <HeapTypeToggle
            type={mode}
            onChange={setMode}
          />
        </div>

        <div className="java-pq-runtime">
          <div className="java-pq-toolbar">
            <div className="java-pq-tabs" role="group" aria-label="Animation speed">
              {["slow", "normal", "fast"].map((option) => (
                <button
                  type="button"
                  key={option}
                  className={speed === option ? "active" : ""}
                  onClick={() => setSpeed(option)}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="java-pq-step-count">
              STEP {step + 1} / {steps.length}
            </div>
          </div>

          <div className="java-pq-workspace">
            <div className="java-pq-code-panel">
              <div className="java-pq-code-panel-header">
                <span>CODE</span>
                <strong>{current.code}</strong>
              </div>

              <pre>
                {codeLines.map((line, index) => (
                  <code
                    key={`${line}-${index}`}
                    className={current.line === index ? "active" : ""}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {line || " "}
                  </code>
                ))}
              </pre>
            </div>

            <div className="java-pq-run-panel">
              <HeapTree
                heap={current.heap}
                activeIndices={current.activeIndices}
                label="Java PriorityQueue heap state"
              />
              <HeapArrayView
                heap={current.heap}
                activeIndices={current.activeIndices}
              />

              <div className="heap-explanation-card">
                <span>WHAT HAPPENS</span>
                <p>{current.message}</p>

                <div className="java-pq-output">
                  <span>POLL OUTPUT</span>
                  <strong>{current.output || "none yet"}</strong>
                </div>

                <div className="heap-step-controls">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setStep((currentStep) =>
                        Math.max(currentStep - 1, 0)
                      );
                    }}
                    disabled={step === 0}
                  >
                    PREVIOUS
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? "PAUSE" : "PLAY"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setStep((currentStep) =>
                        Math.min(currentStep + 1, steps.length - 1)
                      );
                    }}
                    disabled={step === steps.length - 1}
                  >
                    NEXT
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setStep(0);
                    }}
                  >
                    RESET
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getJavaPriorityQueueCode(mode) {
  if (mode === "max") {
    return [
      "import java.util.Collections;",
      "import java.util.PriorityQueue;",
      "",
      "public class MaxHeapExample {",
      "    public static void main(String[] args) {",
      "        PriorityQueue<Integer> maxHeap =",
      "            new PriorityQueue<>(",
      "                Collections.reverseOrder()",
      "            );",
      "",
      "        maxHeap.add(30);",
      "        maxHeap.add(10);",
      "        maxHeap.add(20);",
      "",
      "        while (!maxHeap.isEmpty()) {",
      "            System.out.println(maxHeap.poll());",
      "        }",
      "    }",
      "}",
      "",
      "// Output: 30, 20, 10",
    ];
  }

  return [
    "import java.util.PriorityQueue;",
    "",
    "public class MinHeapExample {",
    "    public static void main(String[] args) {",
    "        PriorityQueue<Integer> minHeap =",
    "            new PriorityQueue<>();",
    "",
    "        minHeap.add(30);",
    "        minHeap.add(10);",
    "        minHeap.add(20);",
    "",
    "        while (!minHeap.isEmpty()) {",
    "            System.out.println(minHeap.poll());",
    "        }",
    "    }",
    "}",
    "",
    "// Output: 10, 20, 30",
  ];
}

function getJavaPriorityQueueSteps(mode) {
  if (mode === "max") {
    return [
      {
        code: "PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());",
        line: 5,
        heap: [],
        activeIndices: [],
        output: "",
        message:
          "Java will treat larger numbers as higher priority because reverseOrder() flips the default ordering.",
      },
      {
        code: "maxHeap.add(30);",
        line: 10,
        heap: [30],
        activeIndices: [0],
        output: "",
        message:
          "30 is inserted first, so it becomes the root.",
      },
      {
        code: "maxHeap.add(10);",
        line: 11,
        heap: [30, 10],
        activeIndices: [1, 0],
        output: "",
        message:
          "10 is added at the next open position. Since 10 is lower priority than 30, no swap is needed.",
      },
      {
        code: "maxHeap.add(20);",
        line: 12,
        heap: [30, 10, 20],
        activeIndices: [2, 0],
        output: "",
        message:
          "20 is added next. 30 remains the highest-priority root.",
      },
      {
        code: "maxHeap.poll();",
        line: 15,
        heap: [20, 10],
        activeIndices: [0],
        output: "30",
        message:
          "poll() removes and returns 30 because it is the maximum value.",
      },
      {
        code: "maxHeap.poll();",
        line: 15,
        heap: [10],
        activeIndices: [0],
        output: "30, 20",
        message:
          "After 30 is gone, 20 becomes the next highest-priority value.",
      },
      {
        code: "maxHeap.poll();",
        line: 15,
        heap: [],
        activeIndices: [],
        output: "30, 20, 10",
        message:
          "The final value is 10. Max-Heap polling returns values from largest to smallest.",
      },
    ];
  }

  return [
    {
      code: "PriorityQueue<Integer> minHeap = new PriorityQueue<>();",
      line: 4,
      heap: [],
      activeIndices: [],
      output: "",
      message:
        "Java PriorityQueue is a Min-Heap by default, so smaller numbers have higher priority.",
    },
    {
      code: "minHeap.add(30);",
      line: 7,
      heap: [30],
      activeIndices: [0],
      output: "",
      message:
        "30 is inserted first, so it becomes the root.",
    },
    {
      code: "minHeap.add(10);",
      line: 8,
      heap: [10, 30],
      activeIndices: [0, 1],
      output: "",
      message:
        "10 is smaller than 30, so it bubbles up and becomes the root.",
    },
    {
      code: "minHeap.add(20);",
      line: 9,
      heap: [10, 30, 20],
      activeIndices: [2, 0],
      output: "",
      message:
        "20 is added at the next open position. 10 stays at the root because it is still smallest.",
    },
    {
      code: "minHeap.poll();",
      line: 12,
      heap: [20, 30],
      activeIndices: [0],
      output: "10",
      message:
        "poll() removes and returns 10 because it is the minimum value.",
    },
    {
      code: "minHeap.poll();",
      line: 12,
      heap: [30],
      activeIndices: [0],
      output: "10, 20",
      message:
        "After 10 is gone, 20 is now the smallest and is returned next.",
    },
    {
      code: "minHeap.poll();",
      line: 12,
      heap: [],
      activeIndices: [],
      output: "10, 20, 30",
      message:
        "The final value is 30. Min-Heap polling returns values from smallest to largest.",
    },
  ];
}

function HeapPracticeSection() {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const prompts = [
    {
      question: "Where is 40 inserted first?",
      options: ["Next open position after 20", "Root", "Left of 15"],
      answer: "Next open position after 20",
      heap: [50, 30, 20, 15, 10, 8, 40],
      activeIndices: [6],
      feedback: "Correct. 40 goes to the next open spot first to preserve shape.",
    },
    {
      question: "Which node does 40 compare with first?",
      options: ["20", "50", "15"],
      answer: "20",
      heap: [50, 30, 20, 15, 10, 8, 40],
      activeIndices: [2, 6],
      feedback: "Correct. 20 is the parent of 40, so compare those two first.",
    },
    {
      question: "What happens next?",
      options: ["Swap 40 and 20", "Swap 40 and 50", "Stop"],
      answer: "Swap 40 and 20",
      heap: [50, 30, 40, 15, 10, 8, 20],
      activeIndices: [2, 6],
      feedback: "Correct. 40 is greater than 20, so they swap.",
    },
    {
      question: "After the swap, compare 40 with which node?",
      options: ["30", "50", "20"],
      answer: "50",
      heap: [50, 30, 40, 15, 10, 8, 20],
      activeIndices: [0, 2],
      feedback: "Correct. 40's new parent is 50.",
    },
    {
      question: "What should happen now?",
      options: ["Swap 40 and 50", "Stop", "Remove 20"],
      answer: "Stop",
      heap: [50, 30, 40, 15, 10, 8, 20],
      activeIndices: [0, 2],
      feedback: "Correct. 40 is less than 50, so the Max-Heap property is restored.",
    },
  ];
  const prompt = prompts[step];
  const isComplete =
    step === prompts.length - 1 &&
    feedback.startsWith("Correct");

  function handlePracticeAnswer(option) {
    if (option !== prompt.answer) {
      setFeedback("Not yet. Think about shape first, then heap order.");
      return;
    }

    setFeedback(prompt.feedback);

    if (step < prompts.length - 1) {
      setStep((current) => current + 1);
    }
  }

  function resetPractice() {
    setStep(0);
    setFeedback("");
  }

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">11 / PREDICT THE NEXT STEP</span>
      <div className="heap-section-heading">
        <h2>Try the insert logic yourself.</h2>
        <InfoPopover title="Why predict steps?">
          Predicting forces you to separate the two rules: fill the next open
          spot first, then compare with parents until the heap is valid.
        </InfoPopover>
      </div>
      <HeapTree
        heap={prompt.heap}
        activeIndices={prompt.activeIndices}
      />
      <div className="heap-check-card">
        <span>INSERT 40 / STEP {step + 1} OF {prompts.length}</span>
        <p>{prompt.question}</p>
        <div className="heap-inline-actions">
          {prompt.options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => handlePracticeAnswer(option)}
              disabled={isComplete}
            >
              {option}
            </button>
          ))}
        </div>
        {feedback && <p>{feedback}</p>}
        {isComplete && (
          <button
            type="button"
            className="heap-practice-reset"
            onClick={resetPractice}
          >
            TRY AGAIN
          </button>
        )}
      </div>
    </section>
  );
}

function HeapValidationSection() {
  const [selected, setSelected] = useState(validationExamples[0]);
  const [answer, setAnswer] = useState(null);
  const maxCheck = isValidHeap(selected.heap, "max");
  const minCheck = isValidHeap(selected.heap, "min");

  function explain() {
    if (selected.answer === "max") {
      return "This is a valid Max-Heap because every parent is greater than or equal to its children.";
    }

    if (selected.answer === "min") {
      return "This is a valid Min-Heap because every parent is less than or equal to its children.";
    }

    const issue = !maxCheck.valid ? maxCheck : minCheck;
    return `${selected.heap[issue.parent]} and ${selected.heap[issue.child]} break the heap-order rule for the selected heap type.`;
  }

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">12 / HEAP VALIDATION</span>
      <div className="heap-section-heading">
        <h2>Decide what kind of heap you are seeing.</h2>
        <InfoPopover title="Why validate parent-child pairs?">
          A heap is valid only if every parent follows the rule with each child.
          One bad relationship is enough to break the heap.
        </InfoPopover>
      </div>
      <div className="heap-inline-actions">
        {validationExamples.map((example) => (
          <button type="button" key={example.label} onClick={() => {
            setSelected(example);
            setAnswer(null);
          }}>EXAMPLE {example.label}</button>
        ))}
      </div>
      <HeapTree heap={selected.heap} />
      <div className="heap-inline-actions">
        <button type="button" onClick={() => setAnswer("max")}>VALID MAX-HEAP</button>
        <button type="button" onClick={() => setAnswer("min")}>VALID MIN-HEAP</button>
        <button type="button" onClick={() => setAnswer("invalid")}>NOT A HEAP</button>
      </div>
      {answer && (
        <div className="heap-callout">
          {answer === selected.answer ? "Correct. " : "Not quite. "}
          {explain()}
        </div>
      )}
    </section>
  );
}

function ArrayIndexExercise() {
  const examples = [
    {
      heap: DEFAULT_MAX_HEAP,
      targetIndex: 1,
    },
    {
      heap: [42, 35, 28, 18, 30, 12, 20],
      targetIndex: 2,
    },
    {
      heap: [60, 45, 50, 32, 18, 7, 12],
      targetIndex: 0,
    },
  ];
  const [exampleIndex, setExampleIndex] = useState(0);
  const [walkthroughStep, setWalkthroughStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [practiceHeapLimit, setPracticeHeapLimit] = useState(0);
  const [feedback, setFeedback] = useState("");
  const example = examples[exampleIndex];
  const heap = example.heap;
  const targetIndex = example.targetIndex;
  const rightChildIndex = (targetIndex + 1) * 2;
  const hasRightChild = rightChildIndex < heap.length;
  const walkthroughSteps = [
    {
      title: "Start with an empty tree.",
      message:
        "We will read the array from left to right and place each value into the next tree position.",
      heapLimit: 0,
      activeIndices: [],
      formula: "tree starts empty",
    },
    {
      title: "Place the root.",
      message:
        `array[1] is ${heap[0]}, so ${heap[0]} becomes the root of the tree.`,
      heapLimit: 1,
      activeIndices: [0],
      formula: "root = array[1]",
    },
    {
      title: "Fill the next level left to right.",
      message:
        `array[2] is ${heap[1]}, so it becomes the left child of the root.`,
      heapLimit: 2,
      activeIndices: [0, 1],
      formula: "left child of k = k * 2",
    },
    {
      title: "Place the right child.",
      message:
        `array[3] is ${heap[2]}, so it becomes the right child of the root.`,
      heapLimit: 3,
      activeIndices: [0, 2],
      formula: "right child of k = k * 2 + 1",
    },
    {
      title: "Continue filling left to right.",
      message:
        "The next array cells fill the next level from left to right.",
      heapLimit: heap.length,
      activeIndices: [3, 4, 5, 6].filter((index) => index < heap.length),
      formula: "complete tree = no skipped positions",
    },
    {
      title: "Choose a parent index.",
      message: `Now inspect value ${heap[targetIndex]} at index ${targetIndex + 1}.`,
      heapLimit: heap.length,
      activeIndices: [targetIndex],
      formula: `k = ${targetIndex + 1}`,
    },
    {
      title: "Find the left child.",
      message:
        targetIndex * 2 + 1 < heap.length
          ? `Left child index is k * 2 = ${(targetIndex + 1) * 2}.`
          : "This node has no left child in the array.",
      heapLimit: heap.length,
      activeIndices:
        targetIndex * 2 + 1 < heap.length
          ? [targetIndex, targetIndex * 2 + 1]
          : [targetIndex],
      formula: "left child = k * 2",
    },
    {
      title: "Find the right child.",
      message: hasRightChild
        ? `Right child index is k * 2 + 1 = ${rightChildIndex + 1}.`
        : "This node has no right child in the array.",
      heapLimit: heap.length,
      activeIndices: hasRightChild
        ? [targetIndex, rightChildIndex]
        : [targetIndex],
      formula: "right child = k * 2 + 1",
    },
    {
      title: "Find the parent.",
      message:
        targetIndex > 0
          ? `Parent index is k / 2 = ${Math.floor((targetIndex + 1) / 2)}.`
          : "The root has no parent.",
      heapLimit: heap.length,
      activeIndices:
        targetIndex > 0
          ? [targetIndex, Math.floor((targetIndex - 1) / 2)]
          : [targetIndex],
      formula: "parent = k / 2",
    },
  ];
  const currentWalkthrough = walkthroughSteps[walkthroughStep];
  const visibleHeapLimit = Math.max(
    currentWalkthrough.heapLimit,
    practiceHeapLimit
  );
  const visibleHeap = heap.slice(0, visibleHeapLimit);
  const visibleActiveIndices = currentWalkthrough.activeIndices.filter(
    (index) => index < visibleHeap.length
  );
  const displayActiveIndices =
    selectedAnswer !== null && selectedAnswer < visibleHeap.length
      ? Array.from(new Set([...visibleActiveIndices, selectedAnswer]))
      : visibleActiveIndices;
  const speedDelay = {
    slow: 1400,
    normal: 850,
    fast: 450,
  }[speed];

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (walkthroughStep >= walkthroughSteps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setWalkthroughStep((current) =>
        Math.min(current + 1, walkthroughSteps.length - 1)
      );
    }, speedDelay);

    return () => clearTimeout(timer);
  }, [isPlaying, speedDelay, walkthroughStep, walkthroughSteps.length]);

  function generateIndexExample() {
    setExampleIndex((current) => (current + 1) % examples.length);
    setWalkthroughStep(0);
    setIsPlaying(false);
    setSelectedAnswer(null);
    setPracticeHeapLimit(0);
    setFeedback("");
  }

  function chooseArrayCell(index) {
    setSelectedAnswer(index);

    if (index === practiceHeapLimit) {
      setPracticeHeapLimit(index + 1);
      setFeedback(
        index === 0
          ? `Nice. ${heap[index]} becomes the root because it is array[1].`
          : `Nice. ${heap[index]} is added to the next open tree spot from left to right.`
      );
      return;
    }

    if (index < practiceHeapLimit) {
      setFeedback(
        `${heap[index]} is already in the tree. Choose array[${practiceHeapLimit + 1}] next.`
      );
      return;
    }

    if (practiceHeapLimit === heap.length && index === rightChildIndex) {
      setFeedback(
        `Correct. ${heap[index]} is the right child because k * 2 + 1 = ${index + 1}.`
      );
      return;
    }

    setFeedback(
      `Not yet. Build the tree in order: array[${practiceHeapLimit + 1}] should be placed next.`
    );
  }

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">13 / ARRAY INDEX EXERCISE</span>
      <div className="heap-section-heading">
        <h2>Use the index formulas.</h2>
        <InfoPopover title="Why do formulas work?">
          Complete trees fill predictably from left to right, so each level maps
          neatly into array positions.
        </InfoPopover>
      </div>
      <div className="array-walkthrough-layout">
        <div className="array-walkthrough-stage">
          <div className="array-walkthrough-overlay">
            <span>{currentWalkthrough.title}</span>
            <strong>{currentWalkthrough.formula}</strong>
            <p>{currentWalkthrough.message}</p>
          </div>

          <HeapTree
            heap={visibleHeap}
            selectedIndex={
              targetIndex < visibleHeap.length ? targetIndex : null
            }
            activeIndices={displayActiveIndices}
          />

          <HeapArrayView
            heap={heap}
            selectedIndex={
              targetIndex < visibleHeap.length ? targetIndex : null
            }
            activeIndices={currentWalkthrough.activeIndices}
          />

          <HeapIndexDetails heap={heap} selectedIndex={targetIndex} />
        </div>

        <aside className="array-walkthrough-controls">
          <span>PLAY THE INDEX FORMULAS</span>
          <p>
            Watch how the array positions become parent and child
            relationships in the tree.
          </p>

          <div className="java-pq-tabs">
            {["slow", "normal", "fast"].map((option) => (
              <button
                type="button"
                key={option}
                className={speed === option ? "active" : ""}
                onClick={() => setSpeed(option)}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="heap-step-controls">
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setWalkthroughStep((current) => Math.max(current - 1, 0));
              }}
              disabled={walkthroughStep === 0}
            >
              PREVIOUS
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? "PAUSE" : "PLAY"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setWalkthroughStep((current) =>
                  Math.min(current + 1, walkthroughSteps.length - 1)
                );
              }}
              disabled={walkthroughStep === walkthroughSteps.length - 1}
            >
              NEXT
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setWalkthroughStep(0);
              }}
            >
              RESET
            </button>
          </div>

          <div className="heap-check-card array-index-practice">
            <span>TRY IT</span>
            <p>
              Start from an empty tree. Click array[1], then array[2],
              and keep going so the tree fills left to right.
            </p>

            <div className="array-choice-grid">
              {heap.map((value, index) => (
                <button
                  type="button"
                  key={`${value}-${index}`}
                  className={[
                    selectedAnswer === index ? "selected" : "",
                    index < practiceHeapLimit
                      ? "correct"
                      : "",
                  ].join(" ")}
                  onClick={() => chooseArrayCell(index)}
                >
                  <span>[{index + 1}]</span>
                  {value}
                </button>
              ))}
            </div>

            {feedback && <p>{feedback}</p>}

            <button
              type="button"
              className="heap-practice-reset"
              onClick={() => {
                setPracticeHeapLimit(0);
                setSelectedAnswer(null);
                setFeedback("");
                setWalkthroughStep(0);
                setIsPlaying(false);
              }}
            >
              RESET TRY IT
            </button>

            <button
              type="button"
              className="heap-practice-reset"
              onClick={generateIndexExample}
            >
              GENERATE EXAMPLE
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

function HeapApplications() {
  return (
    <section className="lesson-section heap-section">
      <span className="section-label">14 / REAL-WORLD APPLICATIONS</span>
      <div className="heap-section-heading">
        <h2>Heaps are useful when priority matters.</h2>
        <InfoPopover title="Why heaps in real systems?">
          They keep the next important item easy to retrieve without fully
          sorting every item after each update.
        </InfoPopover>
      </div>
      <div className="heap-card-grid">
        <article className="heap-info-card">
          <span>MAX-HEAP</span>
          <p>Heapsort, priority queues, and Top-K tracking use quick access to the largest value.</p>
        </article>
        <article className="heap-info-card">
          <span>MIN-HEAP</span>
          <p>Dijkstra's Algorithm, event simulation, and task schedulers use quick access to the smallest priority.</p>
        </article>
        <article className="heap-info-card">
          <span>EMERGENCY TASK QUEUE</span>
          <p>Critical task priority 1 is processed before normal priority 3 and low-priority 5.</p>
        </article>
      </div>
    </section>
  );
}

export default HeapLesson;
