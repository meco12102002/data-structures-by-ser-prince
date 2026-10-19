import test from "node:test";
import assert from "node:assert/strict";
import { collisionGuide } from "../src/utils/collisionGuide.js";
import {
  hashIndex,
  emptyTable,
  chainOperation,
  loadFactor,
  rehash,
  openOperation,
  probeIndices,
  TOMBSTONE,
  setOperation,
  mapOperation,
  collisionTrace,
} from "../src/utils/hashing.js";

test("modulo normalizes negatives and rejects invalid inputs", () => {
  assert.equal(hashIndex(27, 10), 7);
  assert.equal(hashIndex(-12, 5), 3);
  for (const value of ["", "abc", 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1])
    assert.throws(() => hashIndex(value, 5));
  assert.throws(() => hashIndex(1, 0));
});

test("chaining preserves collisions, updates unique keys, and deletes safely", () => {
  let table = emptyTable(5);
  for (const key of [12, 27, 32])
    table = chainOperation(table, "put", key, `v${key}`).table;
  assert.deepEqual(
    table[2].map((entry) => entry.key),
    [12, 27, 32],
  );
  table = chainOperation(table, "put", 27, "updated").table;
  assert.equal(loadFactor(table), 0.6);
  assert.equal(chainOperation(table, "get", 27).value, "updated");
  table = chainOperation(table, "remove", 12).table;
  assert.equal(chainOperation(table, "get", 32).value, "v32");
  assert.equal(chainOperation(table, "get", 12).found, false);
  assert.equal(chainOperation(emptyTable(5), "get", 12).found, false);
});

test("rehashing preserves all entries and every intermediate snapshot", () => {
  let table = emptyTable(5);
  for (const key of [-12, 12, 27, 32, 41])
    table = chainOperation(table, "put", key, String(key)).table;
  const result = rehash(table, 11);
  assert.equal(result.steps[0].table.flat().length, 0);
  assert.equal(result.steps[1].table.flat().length, 1);
  for (const step of result.steps) {
    assert.equal(step.table.flat().length + step.oldTable.flat().length, 5);
  }
  for (const entry of table.flat())
    assert.equal(
      chainOperation(result.table, "get", entry.key).value,
      entry.value,
    );
});

test("open addressing updates duplicates after tombstones and retains search paths", () => {
  for (const method of ["linear", "quadratic", "double"]) {
    let table = Array(7).fill(null);
    for (const key of [12, 19, 26])
      table = openOperation(table, method, "put", key, String(key)).table;
    table = openOperation(table, method, "remove", 12).table;
    assert.equal(table[5], TOMBSTONE);
    assert.equal(openOperation(table, method, "get", 26).found, true);
    table = openOperation(table, method, "put", 19, "updated").table;
    assert.equal(table.filter((entry) => entry?.key === 19).length, 1);
    assert.equal(openOperation(table, method, "get", 19).found, true);
    assert.equal(openOperation(table, method, "get", 999).found, false);
  }
});

test("probing formulas are exact and attempts always terminate", () => {
  assert.deepEqual(probeIndices(12, 5, "linear"), [2, 3, 4, 0, 1]);
  assert.deepEqual(probeIndices(12, 5, "quadratic"), [2, 3, 1, 1, 3]);
  assert.deepEqual(probeIndices(12, 5, "double"), [2, 3, 4, 0, 1]);
  for (const method of ["linear", "quadratic", "double"]) {
    const full = Array.from({ length: 5 }, (_, key) => ({ key, value: key }));
    const result = openOperation(full, method, "put", 90, "full");
    assert.equal(result.inserted, false);
    assert.ok(result.probes <= 5);
  }
  const limited = collisionTrace([0, 5, 10, 15], 5, "quadratic");
  assert.equal(limited.inserted, 3);
  assert.match(limited.steps.at(-1).message, /cannot reach/);
});

test("set uniqueness and map replacement retain their contracts", () => {
  assert.deepEqual(setOperation(["Apple"], "add", "Apple").items, ["Apple"]);
  assert.deepEqual(setOperation(["Apple"], "remove", "missing").items, [
    "Apple",
  ]);
  const entries = [
    { key: "banana", value: "20" },
    { key: "apple", value: "10" },
  ];
  const updated = mapOperation(entries, "put", "banana", "99").entries;
  assert.deepEqual(
    updated.map((entry) => entry.key),
    ["banana", "apple"],
  );
  assert.equal(updated[0].value, "99");
  assert.equal(entries[0].value, "20");
  assert.equal(mapOperation(updated, "remove", "banana").entries.length, 1);
});

test("mixed probing operations agree with a reference map and stay bounded", () => {
  let seed = 2503;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed;
  };
  for (const method of ["linear", "quadratic", "double"]) {
    for (const size of [5, 7, 11]) {
      let table = Array(size).fill(null);
      const expected = new Map();
      for (let turn = 0; turn < 160; turn++) {
        const key = (random() % 31) - 15;
        const operation = ["put", "remove", "get"][random() % 3];
        const value = `value-${turn}`;
        const result = openOperation(table, method, operation, key, value);
        assert.ok(result.probes <= size);
        if (operation === "put" && result.inserted) expected.set(key, value);
        if (operation === "remove") expected.delete(key);
        table = result.table;
        const actual = table.filter((entry) => entry && entry !== TOMBSTONE);
        assert.equal(actual.length, expected.size);
        assert.equal(
          new Set(actual.map((entry) => entry.key)).size,
          actual.length,
        );
        for (const [storedKey, storedValue] of expected) {
          const lookup = openOperation(table, method, "get", storedKey);
          assert.equal(lookup.found, true, `${method}: lost ${storedKey}`);
          assert.equal(lookup.value, storedValue);
        }
      }
    }
  }
});

test("guided chaining explains a collision before changing the bucket", () => {
  const guide = collisionGuide([12, 27, 32], 5, "chaining");
  const conflict = guide.steps.find(
    (step) => step.incomingKey === 27 && step.phase === "collision",
  );
  assert.equal(conflict.home, 2);
  assert.deepEqual(
    conflict.table[2].map((entry) => entry.key),
    [12],
  );
  assert.match(conflict.message, /same bucket/);
  const stored = guide.steps.find(
    (step) => step.incomingKey === 27 && step.phase === "stored",
  );
  assert.deepEqual(
    stored.table[2].map((entry) => entry.key),
    [12, 27],
  );
  assert.deepEqual(
    conflict.table[2].map((entry) => entry.key),
    [12],
  );
  assert.equal(guide.steps.at(-1).stored, 3);
});

test("guided linear probing shows each occupied bucket before the empty one", () => {
  const guide = collisionGuide([12, 27, 32], 5, "linear");
  const steps = guide.steps.filter(
    (step) =>
      step.incomingKey === 32 && ["collision", "empty"].includes(step.phase),
  );
  assert.deepEqual(
    steps.map((step) => step.index),
    [2, 3, 4],
  );
  assert.deepEqual(
    steps.map((step) => step.phase),
    ["collision", "collision", "empty"],
  );
  assert.deepEqual(steps.at(-1).path, [2, 3, 4]);
  assert.deepEqual(
    guide.table.map((entry) => entry?.key ?? null),
    [null, null, 12, 27, 32],
  );
});

test("guided methods match core algorithms for negatives and exhausted/full tables", () => {
  for (const method of ["chaining", "linear", "quadratic", "double"]) {
    for (const keys of [
      [-12, 12, 27, 32],
      [0, 5, 10, 15, 20, 25],
    ]) {
      const guide = collisionGuide(keys, 5, method);
      const core = collisionTrace(keys, 5, method);
      assert.deepEqual(guide.table, core.table);
      assert.equal(guide.inserted, core.inserted);
      assert.ok(guide.steps.every((step) => step.path.length <= 5));
    }
  }
  const exhausted = collisionGuide([0, 5, 10, 15], 5, "quadratic");
  assert.equal(exhausted.steps.at(-1).phase, "blocked");
  assert.match(exhausted.steps.at(-1).message, /cannot reach/);
  const full = collisionGuide([0, 5, 10, 15, 20, 25], 5, "linear");
  assert.match(full.steps.at(-1).message, /Table full/);
});
