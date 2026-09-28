import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import SEO from "../components/SEO";
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

function HeapLesson() {
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

        <HeapIntroSection />
        <HeapShapeSection />
        <HeapTypeSection />
        <HeapArraySection />
        <HeapPlaygroundSection />
        <HeapifySection />
        <OperationCards />
        <PriorityQueueSection />
        <JavaPriorityQueueSection />
        <HeapPracticeSection />
        <HeapValidationSection />
        <ArrayIndexExercise />
        <HeapApplications />

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
      <h2>A heap is a complete binary tree with priority rules.</h2>
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
  const heap = shape === "valid" ? [50, 30, 20, 15, 10, 8] : [50, 30, 20, 15, null, 8];

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">02 / SHAPE PROPERTY</span>
      <h2>Heap nodes fill level by level, left to right.</h2>
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

      <div className="heap-shape-grid">
        {heap.map((value, index) => (
          <div
            key={`${index}-${value}`}
            className={value === null ? "missing" : ""}
          >
            {value ?? "SKIPPED"}
          </div>
        ))}
      </div>

      <div className="heap-callout">
        {shape === "valid"
          ? "This is complete: every level is filled from left to right."
          : "This skips a spot before adding a later node, so it is not a complete binary tree."}
      </div>
    </section>
  );
}

function HeapTypeSection() {
  const [type, setType] = useState("max");
  const [answer, setAnswer] = useState(null);
  const heap = type === "max" ? DEFAULT_MAX_HEAP : DEFAULT_MIN_HEAP;
  const checkHeap = [50, 30, 60, 15, 10, 8, 5];

  return (
    <section className="lesson-section heap-section">
      <span className="section-label">03 / MAX-HEAP VS MIN-HEAP</span>
      <h2>The root changes depending on the priority rule.</h2>

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
        <p>Is this a valid Max-Heap?</p>
        <HeapTree heap={checkHeap} activeIndices={answer ? [0, 2] : []} />
        <div className="heap-inline-actions">
          <button type="button" onClick={() => setAnswer("yes")}>YES</button>
          <button type="button" onClick={() => setAnswer("no")}>NO</button>
        </div>
        {answer && (
          <p className={answer === "no" ? "correct" : "wrong"}>
            {answer === "no"
              ? "Correct. 60 is a child of 50, and 60 > 50, so the Max-Heap property is broken."
              : "Not quite. A Max-Heap parent must be greater than or equal to its children."}
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
      <h2>A heap tree can be stored in an array.</h2>
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
      <h2>Change the heap and watch the structure update.</h2>

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
      <h2>Heapify restores the heap-order property.</h2>
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
      <h2>Every operation protects shape first, then heap order.</h2>
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
      <h2>A priority queue processes priority, not insertion order.</h2>
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
      <h2>Java's PriorityQueue returns values by priority order.</h2>
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
      <h2>Try the insert logic yourself.</h2>
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
      <h2>Decide what kind of heap you are seeing.</h2>
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
      <h2>Use the index formulas.</h2>
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
      <h2>Heaps are useful when priority matters.</h2>
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
