import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

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
        Following the handout's 1-based indexing:
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

      <div className="heap-playground-controls">
        <HeapTypeToggle type={type} onChange={changeType} />
        <label>
          VALUE
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            inputMode="numeric"
          />
        </label>
        <button type="button" onClick={() => {
          const nextValue = readValue();
          if (nextValue === null) return;
          const result = insertHeap(heap, nextValue, type);
          setHeap(result.heap);
          setMessage(`Inserted ${nextValue}, then up-heapified.`);
        }}>INSERT</button>
        <button type="button" onClick={() => {
          const result = extractRoot(heap, type);
          setHeap(result.heap);
          setMessage(result.root === null ? "The heap is empty." : `Extracted root ${result.root}, then down-heapified.`);
        }}>EXTRACT ROOT</button>
        <button type="button" onClick={() => setMessage(heap.length ? `Peek returns ${heap[0]} without removing it.` : "The heap is empty.")}>PEEK</button>
        <button type="button" onClick={() => {
          const nextValue = readValue();
          if (nextValue === null) return;
          const result = replaceRoot(heap, nextValue, type);
          setHeap(result.heap);
          setMessage(`Replaced the root with ${nextValue}, then restored heap order.`);
        }}>REPLACE</button>
        <button type="button" onClick={() => reset()}>RESET</button>
        <button type="button" onClick={() => {
          const source = type === "max" ? [18, 45, 7, 32, 60, 12] : [18, 45, 7, 32, 60, 12];
          setHeap(buildHeap(source, type));
          setMessage("Random-style heap generated from a fresh value set.");
        }}>RANDOM HEAP</button>
      </div>

      <div className="heap-two-column">
        <HeapTree heap={heap} />
        <div>
          <HeapArrayView heap={heap} />
          <div className="heap-callout">{message}</div>
        </div>
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
      <span className="section-label">08 / PRIORITY QUEUES</span>
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
  return (
    <section className="lesson-section heap-section">
      <span className="section-label">09 / JAVA PRIORITYQUEUE</span>
      <div className="heap-section-heading">
        <h2>Java's PriorityQueue returns values by priority order.</h2>
        <InfoPopover title="Why does poll change the order?">
          Java's PriorityQueue stores values by priority internally, so polling
          returns the smallest value by default, not the first inserted value.
        </InfoPopover>
      </div>
      <div className="heap-code-grid">
        <pre>{`PriorityQueue<Integer> minHeap = new PriorityQueue<>();

minHeap.add(30);
minHeap.add(10);
minHeap.add(20);

minHeap.poll(); // 10
minHeap.poll(); // 20
minHeap.poll(); // 30`}</pre>
        <pre>{`PriorityQueue<Integer> maxHeap =
    new PriorityQueue<>(Collections.reverseOrder());

maxHeap.add(30);
maxHeap.add(10);
maxHeap.add(20);

maxHeap.poll(); // 30
maxHeap.poll(); // 20
maxHeap.poll(); // 10`}</pre>
      </div>
    </section>
  );
}

function HeapPracticeSection() {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const prompts = [
    {
      question: "Where is 40 inserted first?",
      options: ["Next open position after 20", "Root", "Left of 15"],
      answer: "Next open position after 20",
    },
    {
      question: "Which node does 40 compare with first?",
      options: ["20", "50", "15"],
      answer: "20",
    },
    {
      question: "What happens next?",
      options: ["Swap 40 and 20", "Swap 40 and 50", "Stop"],
      answer: "Swap 40 and 20",
    },
  ];
  const prompt = prompts[step];

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">10 / PREDICT THE NEXT STEP</span>
      <div className="heap-section-heading">
        <h2>Try the insert logic yourself.</h2>
        <InfoPopover title="Why predict steps?">
          Predicting forces you to separate the two rules: fill the next open
          spot first, then compare with parents until the heap is valid.
        </InfoPopover>
      </div>
      <HeapTree heap={[50, 30, 20, 15, 10]} activeIndices={step === 0 ? [] : [2]} />
      <div className="heap-check-card">
        <span>INSERT 40</span>
        <p>{prompt.question}</p>
        <div className="heap-inline-actions">
          {prompt.options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => {
                if (option === prompt.answer) {
                  setFeedback("Correct. Keep going.");
                  setStep((current) => Math.min(current + 1, prompts.length - 1));
                } else {
                  setFeedback("Not yet. Think about shape first, then heap order.");
                }
              }}
            >
              {option}
            </button>
          ))}
        </div>
        {feedback && <p>{feedback}</p>}
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
      <span className="section-label">11 / HEAP VALIDATION</span>
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
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const heap = DEFAULT_MAX_HEAP;
  const expected = (selectedIndex + 1) * 2 + 1;

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">12 / ARRAY INDEX EXERCISE</span>
      <div className="heap-section-heading">
        <h2>Use the index formulas.</h2>
        <InfoPopover title="Why do formulas work?">
          Complete trees fill predictably from left to right, so each level maps
          neatly into array positions.
        </InfoPopover>
      </div>
      <div className="heap-two-column">
        <HeapTree heap={heap} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
        <div>
          <HeapArrayView heap={heap} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
          <HeapIndexDetails heap={heap} selectedIndex={selectedIndex} />
          <div className="heap-check-card">
            <p>If node {heap[selectedIndex]} is at handout index {selectedIndex + 1}, what index contains its right child?</p>
            <input value={answer} onChange={(event) => setAnswer(event.target.value)} />
            <button type="button" onClick={() => {
              setFeedback(Number(answer) === expected ? "Correct." : `Not yet. k * 2 + 1 = ${expected}.`);
            }}>CHECK</button>
            {feedback && <p>{feedback}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeapApplications() {
  return (
    <section className="lesson-section heap-section">
      <span className="section-label">13 / REAL-WORLD APPLICATIONS</span>
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
