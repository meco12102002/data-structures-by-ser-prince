export const DEFAULT_MAX_HEAP = [50, 30, 20, 15, 10, 8, 5];
export const DEFAULT_MIN_HEAP = [5, 10, 15, 30, 20, 50, 40];

export function getParentIndex(index) {
  return Math.floor((index - 1) / 2);
}

export function getLeftChildIndex(index) {
  return index * 2 + 1;
}

export function getRightChildIndex(index) {
  return index * 2 + 2;
}

export function compareHeapValues(a, b, type) {
  return type === "max" ? a > b : a < b;
}

export function isValidHeap(heap, type = "max") {
  for (let index = 0; index < heap.length; index += 1) {
    const left = getLeftChildIndex(index);
    const right = getRightChildIndex(index);

    if (
      left < heap.length &&
      compareHeapValues(heap[left], heap[index], type)
    ) {
      return {
        valid: false,
        parent: index,
        child: left,
      };
    }

    if (
      right < heap.length &&
      compareHeapValues(heap[right], heap[index], type)
    ) {
      return {
        valid: false,
        parent: index,
        child: right,
      };
    }
  }

  return {
    valid: true,
    parent: null,
    child: null,
  };
}

export function heapifyUp(heap, startIndex, type = "max") {
  const nextHeap = [...heap];
  const steps = [
    {
      heap: [...nextHeap],
      action: "insert",
      activeIndices: [startIndex],
      message:
        "Place the new value in the next open spot to keep the tree complete.",
    },
  ];

  let childIndex = startIndex;

  while (childIndex > 0) {
    const parentIndex = getParentIndex(childIndex);
    const childValue = nextHeap[childIndex];
    const parentValue = nextHeap[parentIndex];
    const shouldSwap = compareHeapValues(
      childValue,
      parentValue,
      type
    );

    steps.push({
      heap: [...nextHeap],
      action: "compare",
      activeIndices: [childIndex, parentIndex],
      message: `Compare ${childValue} with parent ${parentValue}.`,
    });

    if (!shouldSwap) {
      steps.push({
        heap: [...nextHeap],
        action: "done",
        activeIndices: [childIndex, parentIndex],
        message: "Heap order is restored.",
      });
      break;
    }

    [nextHeap[childIndex], nextHeap[parentIndex]] = [
      nextHeap[parentIndex],
      nextHeap[childIndex],
    ];

    steps.push({
      heap: [...nextHeap],
      action: "swap",
      activeIndices: [childIndex, parentIndex],
      message: `${childValue} has higher priority, so swap it with ${parentValue}.`,
    });

    childIndex = parentIndex;
  }

  if (childIndex === 0) {
    steps.push({
      heap: [...nextHeap],
      action: "done",
      activeIndices: [childIndex],
      message: "The new value reached the root. Heap order is restored.",
    });
  }

  return {
    heap: nextHeap,
    steps,
  };
}

export function insertHeap(heap, value, type = "max") {
  return heapifyUp([...heap, value], heap.length, type);
}

export function heapifyDown(heap, startIndex = 0, type = "max") {
  const nextHeap = [...heap];
  const steps = [];
  let parentIndex = startIndex;

  while (true) {
    const left = getLeftChildIndex(parentIndex);
    const right = getRightChildIndex(parentIndex);
    let candidateIndex = parentIndex;

    if (
      left < nextHeap.length &&
      compareHeapValues(nextHeap[left], nextHeap[candidateIndex], type)
    ) {
      candidateIndex = left;
    }

    if (
      right < nextHeap.length &&
      compareHeapValues(nextHeap[right], nextHeap[candidateIndex], type)
    ) {
      candidateIndex = right;
    }

    const childIndices = [left, right].filter(
      (index) => index < nextHeap.length
    );

    steps.push({
      heap: [...nextHeap],
      action: "compare",
      activeIndices: [parentIndex, ...childIndices],
      message:
        childIndices.length > 0
          ? `Compare ${nextHeap[parentIndex]} with its children.`
          : "No children remain to compare.",
    });

    if (candidateIndex === parentIndex) {
      steps.push({
        heap: [...nextHeap],
        action: "done",
        activeIndices: [parentIndex],
        message: "Heap order is restored.",
      });
      break;
    }

    const parentValue = nextHeap[parentIndex];
    const candidateValue = nextHeap[candidateIndex];

    [nextHeap[parentIndex], nextHeap[candidateIndex]] = [
      nextHeap[candidateIndex],
      nextHeap[parentIndex],
    ];

    steps.push({
      heap: [...nextHeap],
      action: "swap",
      activeIndices: [parentIndex, candidateIndex],
      message: `Swap ${parentValue} with higher-priority child ${candidateValue}.`,
    });

    parentIndex = candidateIndex;
  }

  return {
    heap: nextHeap,
    steps,
  };
}

export function extractRoot(heap, type = "max") {
  if (heap.length === 0) {
    return {
      root: null,
      heap: [],
      steps: [
        {
          heap: [],
          action: "empty",
          activeIndices: [],
          message: "The heap is empty.",
        },
      ],
    };
  }

  if (heap.length === 1) {
    return {
      root: heap[0],
      heap: [],
      steps: [
        {
          heap: [...heap],
          action: "remove",
          activeIndices: [0],
          message: `Remove root ${heap[0]}. The heap is now empty.`,
        },
      ],
    };
  }

  const root = heap[0];
  const last = heap[heap.length - 1];
  const movedHeap = [last, ...heap.slice(1, -1)];
  const down = heapifyDown(movedHeap, 0, type);

  return {
    root,
    heap: down.heap,
    steps: [
      {
        heap: [...heap],
        action: "remove",
        activeIndices: [0],
        message: `Remove root ${root}.`,
      },
      {
        heap: [...movedHeap],
        action: "move",
        activeIndices: [0],
        message: `Move final element ${last} to the root, then down-heapify.`,
      },
      ...down.steps,
    ],
  };
}

export function replaceRoot(heap, value, type = "max") {
  if (heap.length === 0) {
    return insertHeap(heap, value, type);
  }

  const replaced = [value, ...heap.slice(1)];
  return heapifyDown(replaced, 0, type);
}

export function buildHeap(values, type = "max") {
  return values.reduce(
    (heap, value) => insertHeap(heap, value, type).heap,
    []
  );
}

export function getHeapNodeLayout(heap) {
  if (heap.length === 0) {
    return [];
  }

  return heap.map((value, index) => {
    const level = Math.floor(Math.log2(index + 1));
    const levelStart = 2 ** level - 1;
    const indexInLevel = index - levelStart;
    const nodesInLevel = 2 ** level;

    return {
      value,
      index,
      displayIndex: index + 1,
      x: ((indexInLevel + 1) * 100) / (nodesInLevel + 1),
      y: 13 + level * 24,
    };
  });
}

export function getHeapConnections(heap) {
  return heap
    .map((_, index) => {
      const left = getLeftChildIndex(index);
      const right = getRightChildIndex(index);
      return [left, right]
        .filter((childIndex) => childIndex < heap.length)
        .map((childIndex) => [index, childIndex]);
    })
    .flat();
}
