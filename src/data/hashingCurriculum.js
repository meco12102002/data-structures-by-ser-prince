// Source definitions from IT2503 — 05 Handout 1. Simple explanations live in
// hashingLesson.js; clarifications are displayed separately from these excerpts.
export const handoutConcepts = [
  [
    {
      term: "Hashing",
      definition:
        "Hashing is the process of converting a given key into another value using a hash function.",
    },
  ],
  [
    {
      term: "Hash Function",
      definition:
        "A hash function generates an integer (hash value) from the key.",
    },
    {
      term: "Hash / Hash Code / Hash Value",
      definition:
        'A mathematical function that takes an input (or "key") of arbitrary size and produces a fixed-size numerical output, called a hash, hash code, or hash value.',
    },
  ],
  [
    {
      term: "Hash Table",
      definition:
        "A hash table, or a hash map, maps keys to values using a hash function. It achieves fast operations (insertion, search, and deletion) by calculating an index for each key, ensuring efficient storage and retrieval of the value.",
    },
    {
      term: "Storage in Buckets / Retrieval",
      definition:
        "The index determines the bucket where the key-value pair will be stored. Buckets are simply array slots. The same hash function is used to locate the bucket using the key, and the value is retrieved from that bucket.",
    },
  ],
  [
    {
      term: "Collision",
      definition:
        "Collisions happen when two (2) different keys are processed by the hash function and produce the same index (bucket) in the table.",
    },
  ],
  [
    {
      term: "Chaining",
      definition:
        "This stores multiple key-value pairs in the same bucket using a secondary data structure, most commonly a linked list, but sometimes a balanced tree.",
    },
    {
      term: "Open Addressing",
      definition:
        "In this technique, the values are all stored in the hash table itself. When a collision occurs, the algorithm searches for the next available slot using a probing sequence.",
    },
  ],
  [
    {
      term: "Table Design",
      definition:
        "The term table design refers to how this internal table is structured, sized, and organized so that keys are distributed as evenly as possible, collisions are minimized and efficiently resolved, and memory is used efficiently while maintaining average-case performance for lookup, insertion, and deletion.",
    },
    {
      term: "Load Factor",
      definition:
        "The load factor measures how “full” a hash table is. It is computed by getting the quotient between the number of stored elements over the number of buckets.",
    },
  ],
  [
    {
      term: "Set Data Structure",
      definition:
        "A Set Data Structure is a data structure that stores a collection of unique elements. It is used to store and manipulate a group of objects, where each object is unique. It does not allow duplicates; if done so, the set ignores it.",
    },
  ],
  [
    {
      term: "Unordered Set",
      definition:
        "An unordered associative container implemented using a hash table where keys are hashed into indices of a hash table, so that the insertion is always randomized.",
    },
    {
      term: "Ordered Set",
      definition:
        "The most common set data structure. It is generally implemented using balanced BSTs, and it supports lookups, insertions, and deletion operations.",
    },
    {
      term: "Hash-based / Tree-based Set",
      definition:
        "The set is represented as a hash table where each element in the set is stored in a bucket based on its hash code. A tree-based set is represented as a binary search tree where each node in the tree represents an element in the set.",
    },
  ],
  [
    {
      term: "Map Data Structure",
      definition:
        "A Map Data Structure is a fundamental data structure that stores information as key–value pairs, where each key is unique and maps to exactly one value.",
    },
  ],
  [
    {
      term: "Hash Map",
      definition:
        "A data structure that maps keys to array indices using a hash function to convert each key into a numeric index, allowing values to be stored and retrieved in constant time.",
    },
    {
      term: "Tree Map",
      definition:
        "A map that uses a binary search tree as its implementation. The keys in a tree map are stored in sorted order, which allows for efficient searching, insertion, and deletion operations.",
    },
    {
      term: "Linked Hash Map",
      definition:
        "A linked hash map combines hashing with a linked list to preserve insertion order, making iteration predictable.",
    },
  ],
  [
    {
      term: "HashMap and the Map interface",
      definition:
        "HashMap, a hash table-based implementation of the Map interface.",
    },
  ],
];

export const sectionJavaConnections = [
  {
    lines: ['map.put("name", "Kimmy");', 'map.get("name");'],
    text: "put stores a mapping; get retrieves it. The record lookup above uses the handout’s illustrative hash values, not Java’s internal String hashing.",
  },
  {
    lines: ["int index = Math.floorMod(27, 10); // 7"],
    text: "This Java integer calculation matches the simplified division model, including normalized negative remainders. A real HashMap performs additional hash processing.",
  },
  {
    lines: [
      'hashTable.put("apple", 10);',
      'hashTable.get("apple");',
      'hashTable.containsKey("cherry");',
      'hashTable.remove("grape");',
    ],
    text: "The complete HashTableExample on handout pages 2–3 includes insertion, retrieval, checking, deletion, and output.",
  },
  {
    lines: ['map.put(12, "A");', 'map.put(27, "B");', 'map.put(32, "C");'],
    text: "The five-bucket modulo example makes all three keys share bucket 2. Java HashMap handles collisions internally but does not use this exact five-bucket model.",
  },
  {
    lines: ['map.put(12, "A");', "map.get(32);"],
    text: "The Java API stays the same while a data structure’s collision strategy determines the internal search. The four strategy animations are conceptual models, not selectable Java HashMap modes.",
  },
  {
    lines: ["HashMap<Integer, String> map = new HashMap<>(16, 0.75f);"],
    text: "Capacity is measured in buckets; size is measured in mappings. The Java resizing activity illustrates the 12-entry threshold and growth during the 13th distinct put().",
  },
  {
    lines: [
      'fruits.add("Apple");',
      'fruits.add("Banana");',
      'fruits.add("Apple"); // duplicate ignored',
    ],
    text: "The handout’s HashSetExample ends with two unique fruits. Both possible output orders are retained in the full walkthrough.",
  },
  {
    lines: [
      "HashSet<Integer> seen = new HashSet<>();",
      "TreeSet<Integer> sorted = new TreeSet<>();",
    ],
    text: "Both enforce uniqueness. HashSet makes no iteration-order promise; TreeSet maintains natural sorted order by default.",
  },
  {
    lines: [
      'map.put("name", "Kimmy");',
      'map.put("course", "BSIT");',
      'map.containsKey("course");',
      'map.remove("course");',
    ],
    text: "These operations come from the handout’s Map-interface example. Using an existing key with put updates its value.",
  },
  {
    lines: [
      "Map<String, Integer> a = new HashMap<>();",
      "Map<String, Integer> b = new TreeMap<>();",
      "Map<String, Integer> c = new LinkedHashMap<>();",
    ],
    text: "The same Map operations support different ordering guarantees. Rebuild the example with a different insertion order to compare them.",
  },
];
