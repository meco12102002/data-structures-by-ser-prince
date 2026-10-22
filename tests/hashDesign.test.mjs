import test from "node:test";
import assert from "node:assert/strict";
import {
  allocateKeys,
  allocationStats,
  javaIntegerBucket,
  javaResizeTrace,
  parseDesignKeys,
  recordLookupTrace,
  reorderEntries,
  repeatedSubtraction,
} from "../src/utils/hashDesign.js";

test("handout record traces distinguish raw hash, index, bucket, and value", () => {
  for (const [key, value, hash] of [
    ["name", "Kimmy", 2],
    ["age", 32, 4],
    ["city", "Tacloban", 3],
  ]) {
    const frames = recordLookupTrace(key);
    assert.equal(frames.length, 5);
    assert.equal(frames[1].record.hash, hash);
    assert.equal(frames[2].index, null);
    assert.equal(frames[3].index, hash);
    assert.equal(frames[4].record.value, value);
    assert.equal(frames[4].table.flat().length, 3);
  }
  assert.throws(() => recordLookupTrace("unknown"));
});

test("allocation demonstrates small, larger, wasteful, and patterned capacities", () => {
  const keys = [12, 27, 32];
  assert.equal(allocationStats(allocateKeys(keys, 5)).collisions, 2);
  assert.equal(allocationStats(allocateKeys(keys, 11)).collisions, 0);
  assert.equal(allocationStats(allocateKeys(keys, 47)).unused, 44);
  const patterned = [10, 20, 30, 40];
  assert.equal(allocationStats(allocateKeys(patterned, 10)).collisions, 3);
  assert.equal(allocationStats(allocateKeys(patterned, 11)).collisions, 0);
  assert.equal(allocationStats(allocateKeys([12, 23], 11)).collisions, 1);
  assert.equal(
    allocationStats(allocateKeys([10, 11, 12, 13, 14], 5, "constant"))
      .collisions,
    4,
  );
  assert.equal(allocateKeys([-12], 5)[3][0].key, -12);
  for (const input of ["", "12, x", "12, 12", "1.5"])
    assert.throws(() => parseDesignKeys(input));
});

test("computation illustration gives the same remainder and bounds work", () => {
  assert.deepEqual(repeatedSubtraction(13, 5), [13, 8, 3]);
  assert.equal(repeatedSubtraction(100, 5).length, 21);
  assert.deepEqual(repeatedSubtraction(0, 5), [0]);
  assert.throws(() => repeatedSubtraction(-1, 5));
  assert.throws(() => repeatedSubtraction(101, 5));
});

test("Java resize trace preserves 13 mappings through every migration snapshot", () => {
  const frames = javaResizeTrace();
  assert.equal(frames[12].capacity, 16);
  assert.equal(frames[12].count, 12);
  assert.equal(frames[12].threshold, 12);
  assert.equal(frames[13].kind, "trigger");
  assert.equal(frames[13].count, 13);
  for (const frame of frames) {
    assert.equal(
      frame.table.flat().length + (frame.oldTable?.flat().length || 0),
      frame.count,
    );
  }
  const last = frames.at(-1);
  assert.equal(last.capacity, 32);
  assert.equal(last.threshold, 24);
  assert.equal(last.count, 13);
  assert.equal(new Set(last.table.flat().map((entry) => entry.key)).size, 13);
  for (const [index, bucket] of last.table.entries())
    for (const entry of bucket)
      assert.equal(javaIntegerBucket(entry.key, 32), index);
  assert.ok(
    frames.some(
      (frame) =>
        frame.kind === "move" &&
        javaIntegerBucket(frame.key, 16) !== javaIntegerBucket(frame.key, 32),
    ),
  );
});

test("changing insertion order preserves mappings and does not mutate the source", () => {
  const entries = [
    { key: "banana", value: "20" },
    { key: "apple", value: "10" },
    { key: "grape", value: "30" },
  ];
  const moved = reorderEntries(entries, "banana", 1);
  assert.deepEqual(
    moved.map((entry) => entry.key),
    ["apple", "banana", "grape"],
  );
  assert.equal(moved.find((entry) => entry.key === "banana").value, "20");
  assert.deepEqual(
    entries.map((entry) => entry.key),
    ["banana", "apple", "grape"],
  );
  assert.deepEqual(reorderEntries(entries, "banana", -1), entries);
});
