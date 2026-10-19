// These small, deterministic models teach the algorithms, not Java's internals.
export function integer(value, label = "Key") {
  if (String(value).trim() === "" || !Number.isSafeInteger(Number(value))) {
    throw new Error(`${label} must be a safe whole number.`);
  }
  return Number(value);
}

export function hashIndex(key, size) {
  integer(size, "Bucket count");
  if (size < 1 || size > 101) throw new Error("Use between 1 and 101 buckets.");
  const number = integer(key);
  return ((number % size) + size) % size;
}

export function emptyTable(size) {
  hashIndex(0, size);
  return Array.from({ length: size }, () => []);
}

export function tableEntries(table) {
  return table.flat();
}

export function loadFactor(table) {
  return tableEntries(table).length / table.length;
}

export function collisionCount(table) {
  return table.reduce(
    (total, bucket) => total + Math.max(0, bucket.length - 1),
    0,
  );
}

export function chainOperation(table, operation, key, value = "") {
  key = integer(key);
  const index = hashIndex(key, table.length);
  const result = table.map((bucket) => bucket.map((entry) => ({ ...entry })));
  const steps = [
    {
      table,
      index: null,
      message: `Use key ${key} to locate a bucket.`,
      comparisons: 0,
    },
    {
      table,
      index,
      message: `h(${key}) = ${key} mod ${table.length} → bucket ${index}.`,
      collision:
        operation === "put" &&
        table[index].some((entry) => entry.key !== key) &&
        !table[index].some((entry) => entry.key === key),
      comparisons: 0,
    },
  ];
  const bucket = result[index];
  let position = -1;
  for (let i = 0; i < bucket.length; i++) {
    steps.push({
      table,
      index,
      key: bucket[i].key,
      comparisons: i + 1,
      message: `Compare ${key} with stored key ${bucket[i].key}${bucket[i].key === key ? ": match." : ": keep looking."}`,
    });
    if (bucket[i].key === key) {
      position = i;
      break;
    }
  }
  const found = position !== -1;
  let message;
  if (operation === "put") {
    if (found) bucket[position] = { key, value };
    else bucket.push({ key, value });
    message = found
      ? `Updated ${key} → ${value}. The key stays unique.`
      : `Stored ${key} → ${value} in bucket ${index}.`;
  } else if (operation === "remove") {
    if (found) bucket.splice(position, 1);
    message = found
      ? `Removed key ${key}; other entries remain retrievable.`
      : `Key ${key} is absent; nothing to remove.`;
  } else if (operation === "containsKey")
    message = `containsKey(${key}) → ${found}.`;
  else if (operation === "get")
    message = found
      ? `get(${key}) → ${bucket[position].value}.`
      : `Key ${key} is absent → null.`;
  else throw new Error("Unknown table operation.");
  steps.push({
    table: result,
    index,
    key,
    comparisons: steps.at(-1).comparisons,
    message,
  });
  return {
    table: result,
    steps,
    found,
    value: found ? table[index][position]?.value : undefined,
  };
}

export function rehash(table, size) {
  const result = emptyTable(size);
  let remaining = table.map((bucket) => bucket.map((entry) => ({ ...entry })));
  const steps = [
    {
      table: result.map((bucket) => [...bucket]),
      oldTable: remaining,
      message: `Create ${size} empty buckets. Every entry needs a new index.`,
      index: null,
    },
  ];
  for (const entry of tableEntries(table)) {
    const index = hashIndex(entry.key, size);
    result[index].push({ ...entry });
    remaining = remaining.map((bucket) =>
      bucket.filter((item) => item.key !== entry.key),
    );
    steps.push({
      table: result.map((bucket) => bucket.map((item) => ({ ...item }))),
      oldTable: remaining,
      index,
      key: entry.key,
      message: `Move ${entry.key} → bucket ${index}: ${entry.key} mod ${size} = ${index}.`,
    });
  }
  return { table: result, steps };
}

export const TOMBSTONE = "DELETED";

export function probeIndices(key, size, method) {
  hashIndex(key, size);
  if (!["linear", "quadratic", "double"].includes(method))
    throw new Error("Unknown probing method.");
  const home = hashIndex(key, size);
  // Double hashing uses prime table sizes in the UI: step and size are coprime.
  const step = size === 1 ? 1 : 1 + hashIndex(key, size - 1);
  return Array.from({ length: size }, (_, i) => {
    const offset =
      method === "quadratic" ? i * i : method === "double" ? i * step : i;
    return (home + offset) % size;
  });
}

export function openOperation(table, method, operation, key, value = "") {
  key = integer(key);
  const result = table.map((entry) =>
    entry && typeof entry === "object" ? { ...entry } : entry,
  );
  const indices = probeIndices(key, table.length, method);
  const steps = [];
  let firstDeleted = -1;
  let destination = -1;
  let found = false;
  for (const index of indices) {
    const entry = result[index];
    steps.push({
      table: [...result],
      index,
      key,
      message: `Probe ${steps.length + 1}: slot ${index} is ${entry === TOMBSTONE ? "a deletion marker; continue searching" : entry ? `occupied by ${entry.key}` : "empty"}.`,
      collision: entry !== null && entry !== TOMBSTONE && entry.key !== key,
    });
    if (entry === TOMBSTONE && firstDeleted === -1) firstDeleted = index;
    if (entry && entry !== TOMBSTONE && entry.key === key) {
      destination = index;
      found = true;
      break;
    }
    if (entry === null) {
      destination = firstDeleted === -1 ? index : firstDeleted;
      break;
    }
  }
  if (!found && destination === -1) destination = firstDeleted;
  let message;
  if (operation === "put") {
    if (destination !== -1) {
      result[destination] = { key, value };
      message = `${found ? "Updated" : "Inserted"} key ${key} at slot ${destination}.`;
    } else
      message = result.every((entry) => entry && entry !== TOMBSTONE)
        ? "Table full. Insertion stopped safely; resize before retrying."
        : "Probe sequence exhausted. Empty slots exist, but this sequence cannot reach them. Resize or choose another method.";
  } else if (operation === "remove") {
    if (found) result[destination] = TOMBSTONE;
    message = found
      ? `Deleted ${key}. A marker preserves the search path for later keys.`
      : `Key ${key} is absent.`;
  } else if (operation === "get" || operation === "containsKey") {
    message = found
      ? `Found ${key} → ${result[destination].value}.`
      : `Key ${key} is absent.`;
  } else throw new Error("Unknown table operation.");
  steps.push({
    table: result,
    index: destination === -1 ? null : destination,
    key,
    message,
  });
  return {
    table: result,
    steps,
    found,
    inserted: operation === "put" && destination !== -1,
    value: found ? table[destination].value : undefined,
    probes: steps.length - 1,
  };
}

export function collisionTrace(keys, size, method) {
  let table = method === "chaining" ? emptyTable(size) : Array(size).fill(null);
  const steps = [
    {
      table,
      index: null,
      message: "Start with an empty table.",
      probes: 0,
      inserted: 0,
    },
  ];
  let probes = 0;
  let inserted = 0;
  for (const key of keys) {
    const result =
      method === "chaining"
        ? chainOperation(table, "put", key, String(key))
        : openOperation(table, method, "put", key, String(key));
    const nextProbes =
      method === "chaining"
        ? result.steps.at(-1).comparisons + 1
        : result.probes;
    for (const step of result.steps)
      steps.push({
        ...step,
        probes:
          probes +
          (method === "chaining"
            ? step.comparisons
            : Math.min(result.probes, result.steps.indexOf(step) + 1)),
        inserted,
      });
    probes += nextProbes;
    inserted += method === "chaining" || result.inserted ? 1 : 0;
    steps[steps.length - 1] = { ...steps.at(-1), probes, inserted };
    table = result.table;
  }
  return { table, steps, probes, inserted };
}

export function setOperation(items, operation, value) {
  if (operation === "clear")
    return { items: [], message: "All elements removed." };
  if (!String(value).trim()) throw new Error("Enter an element first.");
  const found = items.includes(value);
  if (operation === "add")
    return {
      items: found ? [...items] : [...items, value],
      message: found
        ? `${value} already exists. Duplicate rejected; size stays ${items.length}.`
        : `${value} added. Every element remains unique.`,
    };
  if (operation === "remove")
    return {
      items: items.filter((item) => item !== value),
      message: found
        ? `${value} removed.`
        : `${value} is absent; nothing changed.`,
    };
  if (operation === "contains")
    return { items: [...items], message: `contains(${value}) → ${found}.` };
  throw new Error("Unknown set operation.");
}

export function mapOperation(entries, operation, key, value) {
  if (!String(key).trim()) throw new Error("Enter a key first.");
  const found = entries.some((entry) => entry.key === key);
  if (operation === "put") {
    if (!String(value).trim()) throw new Error("Enter a value first.");
    return {
      entries: found
        ? entries.map((entry) => (entry.key === key ? { key, value } : entry))
        : [...entries, { key, value }],
      message: found
        ? `Updated ${key} → ${value}. Size and insertion position stay the same.`
        : `Added ${key} → ${value}. Size grows by one.`,
    };
  }
  if (operation === "remove")
    return {
      entries: entries.filter((entry) => entry.key !== key),
      message: found ? `Removed ${key}.` : `${key} is absent.`,
    };
  if (operation === "containsKey")
    return {
      entries: [...entries],
      message: `containsKey(${key}) → ${found}.`,
    };
  if (operation === "get")
    return {
      entries: [...entries],
      message: found
        ? `get(${key}) → ${entries.find((entry) => entry.key === key).value}.`
        : `get(${key}) → null (no mapping).`,
    };
  throw new Error("Unknown map operation.");
}
