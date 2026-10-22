import {
  collisionCount,
  emptyTable,
  hashIndex,
  integer,
  loadFactor,
  tableEntries,
} from "./hashing.js";

export const handoutRecords = [
  { key: "name", value: "Kimmy", hash: 2 },
  { key: "age", value: 32, hash: 4 },
  { key: "city", value: "Tacloban", hash: 3 },
];

export function recordLookupTrace(key) {
  const record = handoutRecords.find((item) => item.key === key);
  if (!record) throw new Error("Choose name, age, or city.");
  const table = emptyTable(5);
  for (const item of handoutRecords)
    table[item.hash % 5].push({ key: item.key, value: item.value });
  return [
    `Use the key "${key}" to request its value.`,
    `In the handout’s teaching example, hash("${key}") = ${record.hash}.`,
    `Convert that hash to an index: ${record.hash} % 5 = ${record.hash % 5}.`,
    `Go to bucket ${record.hash % 5} and compare the stored key with "${key}".`,
    `The key matches. Retrieve ${JSON.stringify(record.value)}; the record stays stored.`,
  ].map((message, stage) => ({
    stage,
    record,
    table,
    index: stage >= 3 ? record.hash % 5 : null,
    message,
  }));
}

export function parseDesignKeys(input) {
  const keys = input.split(",").map((value) => integer(value));
  if (keys.length > 20)
    throw new Error("Use at most 20 keys in this comparison.");
  if (new Set(keys).size !== keys.length)
    throw new Error("Use distinct keys to compare allocation.");
  return keys;
}

export function allocateKeys(keys, size, mode = "modulo") {
  if (!["modulo", "constant"].includes(mode))
    throw new Error("Choose a supported allocation rule.");
  const table = emptyTable(size);
  for (const value of keys) {
    const key = integer(value);
    const index =
      mode === "constant" ? hashIndex(2, size) : hashIndex(key, size);
    if (!table[index].some((entry) => entry.key === key))
      table[index].push({ key, value: String(key) });
  }
  return table;
}

export function allocationStats(table) {
  const occupied = table.filter((bucket) => bucket.length).length;
  return {
    entries: tableEntries(table).length,
    buckets: table.length,
    occupied,
    unused: table.length - occupied,
    collisions: collisionCount(table),
    load: loadFactor(table),
  };
}

export function reorderEntries(entries, key, direction) {
  const result = entries.map((entry) => ({ ...entry }));
  const from = result.findIndex((entry) => entry.key === key);
  const to = from + direction;
  if (from < 0 || ![-1, 1].includes(direction) || to < 0 || to >= result.length)
    return result;
  [result[from], result[to]] = [result[to], result[from]];
  return result;
}

export function repeatedSubtraction(key, size) {
  key = integer(key);
  if (key < 0 || key > 100)
    throw new Error(
      "Use a key from 0 to 100 for this small computation example.",
    );
  hashIndex(key, size);
  const values = [key];
  while (values.at(-1) >= size) values.push(values.at(-1) - size);
  return values;
}

// Java Integer hashCode, spread, and power-of-two bucket selection for this demo.
export function javaIntegerBucket(key, capacity) {
  integer(key);
  if (key < -2147483648 || key > 2147483647) throw new Error("Use a Java int.");
  if (![16, 32].includes(capacity))
    throw new Error("This example uses 16 or 32 buckets.");
  return (key ^ (key >>> 16)) & (capacity - 1);
}

export function javaResizeTrace() {
  const keys = Array.from({ length: 13 }, (_, i) => 1 + i * 17);
  let table = emptyTable(16);
  const copy = (source) =>
    source.map((bucket) => bucket.map((entry) => ({ ...entry })));
  const frames = [
    {
      table: copy(table),
      index: null,
      count: 0,
      capacity: 16,
      threshold: 12,
      kind: "ready",
      message:
        "Initial capacity target: 16 buckets; threshold: 16 × 0.75 = 12 entries. The drawing shows the target table; Java normally allocates its bucket array on the first insertion.",
    },
  ];
  for (const [i, key] of keys.entries()) {
    const index = javaIntegerBucket(key, 16);
    table[index].push({ key, value: `Record ${i + 1}` });
    frames.push({
      table: copy(table),
      key,
      index,
      count: i + 1,
      capacity: 16,
      threshold: 12,
      kind: i === 12 ? "trigger" : "insert",
      message:
        i === 12
          ? "The 13th distinct mapping makes 13 > 12. Resize happens inside put(); this paused state illustrates the decision, before put() returns."
          : `${i + 1} distinct entries, 16 buckets. ${i === 11 ? "12 equals the threshold, so this well-distributed example has not resized yet." : "The entry count has not exceeded 12."}`,
    });
  }
  let remaining = copy(table);
  const grown = emptyTable(32);
  frames.push({
    table: copy(grown),
    oldTable: remaining,
    index: null,
    count: 13,
    capacity: 32,
    threshold: 24,
    kind: "resize",
    message:
      "Create 32 buckets. Keep all 13 entries while transferring them; the new threshold is 32 × 0.75 = 24.",
  });
  for (const entry of tableEntries(table)) {
    const oldIndex = javaIntegerBucket(entry.key, 16);
    const index = javaIntegerBucket(entry.key, 32);
    grown[index].push(entry);
    remaining = remaining.map((bucket) =>
      bucket.filter((item) => item.key !== entry.key),
    );
    frames.push({
      table: copy(grown),
      oldTable: remaining,
      key: entry.key,
      index,
      count: 13,
      capacity: 32,
      threshold: 24,
      kind: "move",
      message: `Key ${entry.key}: bucket ${oldIndex} → bucket ${index}. ${oldIndex === index ? "This entry keeps its index." : "The larger capacity changes its destination."} Total entries remain 13.`,
    });
  }
  frames.push({
    table: copy(grown),
    index: null,
    count: 13,
    capacity: 32,
    threshold: 24,
    kind: "done",
    message:
      "Resize complete: 13 entries / 32 buckets ≈ 0.406. A bucket is a location; an entry is a key-value mapping. They are different counts.",
  });
  return frames;
}
