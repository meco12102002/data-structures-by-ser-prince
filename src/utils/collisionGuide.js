import {
  chainOperation,
  emptyTable,
  hashIndex,
  openOperation,
} from "./hashing.js";

// A teaching trace derived from the same insertion algorithms as the lab.
// Each frame is a snapshot: computing, checking a bucket, or storing one key.
export function collisionGuide(keys, size, method) {
  let table = method === "chaining" ? emptyTable(size) : Array(size).fill(null);
  let stored = 0;
  const steps = [
    {
      table,
      index: null,
      phase: "ready",
      path: [],
      stored: 0,
      message:
        "Start with empty buckets. Press Next step to follow the first key.",
    },
  ];
  for (const [keyPosition, incomingKey] of keys.entries()) {
    const home = hashIndex(incomingKey, size);
    const common = { incomingKey, keyPosition, home, stored };
    steps.push({
      ...common,
      table,
      index: home,
      phase: "calculate",
      path: [],
      message: `Key ${incomingKey} wants bucket ${home}: ${incomingKey} mod ${size} gives ${home}${incomingKey < 0 ? " after normalizing the remainder" : ""}. Now check that bucket.`,
    });
    const result =
      method === "chaining"
        ? chainOperation(table, "put", incomingKey, String(incomingKey))
        : openOperation(table, method, "put", incomingKey, String(incomingKey));
    if (method === "chaining") {
      const occupants = table[home].map((entry) => entry.key);
      steps.push({
        ...common,
        table,
        index: home,
        phase: occupants.length ? "collision" : "empty",
        path: [home],
        collision: occupants.length > 0,
        message: occupants.length
          ? `Bucket ${home} already has ${occupants.join(" → ")}. Keep those keys. Add ${incomingKey} to the same bucket’s list.`
          : `Bucket ${home} is empty. Put ${incomingKey} here.`,
      });
    } else {
      const checks = result.steps.slice(0, -1);
      for (const [attempt, check] of checks.entries()) {
        const next = checks[attempt + 1];
        const occupant = table[check.index];
        steps.push({
          ...common,
          ...check,
          phase: check.collision ? "collision" : "empty",
          path: checks.slice(0, attempt + 1).map((frame) => frame.index),
          message: check.collision
            ? `Bucket ${check.index} already has ${occupant.key}. ${next ? `Leave it there and try bucket ${next.index} next.` : "No more checks are allowed in this attempt."}`
            : `Bucket ${check.index} is empty. Put ${incomingKey} here.`,
        });
      }
    }
    const success = method === "chaining" || result.inserted;
    if (success) stored++;
    const final = result.steps.at(-1);
    const path = [...steps.at(-1).path];
    table = result.table;
    steps.push({
      ...common,
      table,
      index: final.index,
      key: incomingKey,
      path,
      stored,
      phase: success ? "stored" : "blocked",
      message: !success
        ? final.message
        : method === "chaining"
          ? `${incomingKey} is stored in bucket ${home}. Its list is now ${table[home].map((entry) => entry.key).join(" → ")}. No key was replaced.`
          : `${incomingKey} is stored in bucket ${final.index}. ${final.index === home ? "Its original bucket was available." : `Its original bucket was ${home}; the search rule found this empty bucket instead.`}`,
    });
  }
  return { steps, table, inserted: stored };
}
