import { useEffect, useState } from "react";

import {
  getHeapConnections,
  getHeapNodeLayout,
  getLeftChildIndex,
  getParentIndex,
  getRightChildIndex,
} from "../../../utils/heap";

export function HeapTypeToggle({ type, onChange }) {
  return (
    <div className="heap-toggle" role="group" aria-label="Heap type">
      <button
        type="button"
        className={type === "max" ? "active" : ""}
        onClick={() => onChange("max")}
      >
        MAX-HEAP
      </button>

      <button
        type="button"
        className={type === "min" ? "active" : ""}
        onClick={() => onChange("min")}
      >
        MIN-HEAP
      </button>
    </div>
  );
}

export function HeapTree({
  heap,
  activeIndices = [],
  selectedIndex = null,
  onSelect,
  label = "Heap tree",
}) {
  const nodes = getHeapNodeLayout(heap);
  const connections = getHeapConnections(heap);

  return (
    <div className="heap-tree" role="img" aria-label={label}>
      <svg
        className="heap-tree-lines"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {connections.map(([parent, child]) => {
          const parentNode = nodes[parent];
          const childNode = nodes[child];
          const active =
            activeIndices.includes(parent) &&
            activeIndices.includes(child);

          return (
            <line
              key={`${parent}-${child}`}
              x1={parentNode.x}
              y1={parentNode.y}
              x2={childNode.x}
              y2={childNode.y}
              className={active ? "active" : ""}
            />
          );
        })}
      </svg>

      {nodes.map((node) => {
        const active = activeIndices.includes(node.index);
        const selected = selectedIndex === node.index;

        return (
          <button
            type="button"
            key={`${node.index}-${node.value}`}
            className={[
              "heap-node",
              active ? "active" : "",
              selected ? "selected" : "",
            ].join(" ")}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
            onClick={() => onSelect?.(node.index)}
            aria-label={`Value ${node.value}, array position ${node.displayIndex}`}
          >
            <span>{node.value}</span>
            <small>#{node.displayIndex}</small>
          </button>
        );
      })}
    </div>
  );
}

export function HeapArrayView({
  heap,
  selectedIndex = null,
  activeIndices = [],
  onSelect,
}) {
  return (
    <div className="heap-array" aria-label="Heap array representation">
      <div
        className="heap-array-row"
        style={{ "--heap-cells": heap.length }}
      >
        <span className="heap-array-label">INDEX</span>
        {heap.map((value, index) => (
          <button
            type="button"
            key={`index-${value}-${index}`}
            className={[
              "heap-array-cell",
              selectedIndex === index ? "selected" : "",
              activeIndices.includes(index) ? "active" : "",
            ].join(" ")}
            onClick={() => onSelect?.(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div
        className="heap-array-row"
        style={{ "--heap-cells": heap.length }}
      >
        <span className="heap-array-label">VALUE</span>
        {heap.map((value, index) => (
          <button
            type="button"
            key={`value-${value}-${index}`}
            className={[
              "heap-array-cell value",
              selectedIndex === index ? "selected" : "",
              activeIndices.includes(index) ? "active" : "",
            ].join(" ")}
            onClick={() => onSelect?.(index)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HeapIndexDetails({ heap, selectedIndex }) {
  if (selectedIndex === null || selectedIndex >= heap.length) {
    return (
      <div className="heap-index-details">
        Select a node or array cell to inspect parent and child positions.
      </div>
    );
  }

  const displayIndex = selectedIndex + 1;
  const parent = selectedIndex > 0 ? getParentIndex(selectedIndex) : null;
  const left = getLeftChildIndex(selectedIndex);
  const right = getRightChildIndex(selectedIndex);

  return (
    <div className="heap-index-details">
      <span>Selected value {heap[selectedIndex]}</span>
      <p>Handout index k = {displayIndex}</p>
      {parent !== null && <p>Parent: k / 2 = {parent + 1}</p>}
      {left < heap.length && <p>Left child: k * 2 = {left + 1}</p>}
      {right < heap.length && <p>Right child: k * 2 + 1 = {right + 1}</p>}
    </div>
  );
}

export function HeapStepControls({
  steps,
  currentStep,
  setCurrentStep,
  isPlaying,
  setIsPlaying,
}) {
  useEffect(() => {
    if (!isPlaying || steps.length === 0) {
      return;
    }

    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    }, 850);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, setCurrentStep, setIsPlaying, steps.length]);

  return (
    <div className="heap-step-controls">
      <button
        type="button"
        onClick={() => {
          setIsPlaying(false);
          setCurrentStep((step) => Math.max(step - 1, 0));
        }}
        disabled={currentStep <= 0}
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
          setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
        }}
        disabled={currentStep >= steps.length - 1}
      >
        NEXT
      </button>

      <button
        type="button"
        onClick={() => {
          setIsPlaying(false);
          setCurrentStep(0);
        }}
      >
        RESET
      </button>
    </div>
  );
}

export function useHeapSteps(initialSteps) {
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function replaceSteps(nextSteps) {
    setSteps(nextSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }

  return {
    steps,
    currentStep,
    current: steps[currentStep],
    isPlaying,
    setCurrentStep,
    setIsPlaying,
    replaceSteps,
  };
}
