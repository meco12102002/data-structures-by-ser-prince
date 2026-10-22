export const hashingSections = [
  {
    title: "Why Do We Need Hashing?",
    tag: "THE PROBLEM",
    problem:
      "How can we find a student record without checking every record one by one?",
    explanation:
      "Sequential search checks records until a key matches. Hashing processes the key to calculate where to look, then checks entries in that bucket. Notice that a crowded bucket can still need several comparisons.",
    terms: [
      [
        "Hashing",
        "The process of converting a given key into another value using a hash function. That value helps locate stored data.",
      ],
      [
        "Hash table / hash map",
        "A structure that stores key-value pairs using hashing.",
      ],
      ["Key", "The identifier used to locate a record, such as a student ID."],
      ["Value", "The data associated with a key, such as a student name."],
      ["Lookup", "Retrieving the value associated with a key."],
    ],
    application:
      "Like the handout’s library analogy, a hash function points you to a shelf instead of making you inspect every shelf. A school directory similarly retrieves a record by ID. Hash-table operations typically average O(1) under good distribution; heavy collisions can make them slower.",
    next: "Now follow a key through the calculation that selects its bucket.",
    question: {
      prompt: "Does a hash lookup always compare exactly one record?",
      options: [
        "Yes, always one",
        "No, collisions can require more comparisons",
      ],
      answer: 1,
      explanation:
        "Several keys may share a bucket, so finding the matching key can require more work.",
    },
  },
  {
    title: "Hash Functions and Buckets",
    tag: "CALCULATE A LOCATION",
    problem: "If key 27 arrives and there are 10 buckets, where should it go?",
    explanation:
      "For this integer model, h(k) = k mod m. Here k is the key, m is the bucket count, and mod gives the remainder. With nonnegative keys the remainder is a valid array index from 0 to m − 1. Negative remainders are normalized into that range.",
    clarification:
      'Handout p. 2: the line k = 2 beside h(27) is a typo; this calculation uses k = 27. The handout also illustrates hash("name") → 2, hash("age") → 4, and hash("city") → 3. These are teaching examples, not Java hashCode results. A raw hash code and its final bucket index are different stages; index = hash(key) % array_size reduces the code to a location.',
    terms: [
      [
        "Hash function",
        "A rule that accepts a key and produces a fixed-size numerical hash value. It is deterministic: the same key and unchanged rule give the same result.",
      ],
      [
        "Hash value / hash code",
        "The value produced by hashing. A raw hash code may still need to be converted into a bucket index.",
      ],
      [
        "Bucket / array index",
        "A storage location and its zero-based position in the table.",
      ],
      [
        "Modulo",
        "The remainder operation used in this simplified bucket calculation.",
      ],
    ],
    application:
      "A cache uses keys to choose storage locations. Real Java HashMap uses hash processing and capacity rules more sophisticated than this modulo model.",
    next: "Use this calculation to store, find, update, and remove actual pairs.",
    question: {
      prompt: "For key 32 and 5 buckets, choose the calculated index.",
      options: ["0", "2", "5"],
      answer: 1,
      explanation: "32 = 6 × 5 + 2, so 32 mod 5 = 2.",
    },
  },
  {
    title: "How Hash Tables Work",
    tag: "STORE & RETRIEVE",
    problem:
      "Can you change the name for an existing student ID without creating a second ID?",
    explanation:
      "Insertion calculates a bucket and checks for an existing key. An existing key gets a replacement value; a new key creates an entry. Retrieval, membership checking, and deletion follow the same bucket calculation and compare keys within the bucket.",
    terms: [
      [
        "Key-value pair",
        'One unique key associated with one value. The handout uses "name" → "Kimmy", "age" → 32, and "city" → "Tacloban". Different keys may share the same value.',
      ],
      [
        "Insertion / put",
        "Store a new mapping or update a mapping with the same key.",
      ],
      ["Retrieval / get", "Find the value for a key."],
      ["Membership checking", "Determine whether a key is present."],
      ["Deletion / remove", "Remove the mapping associated with a key."],
    ],
    application:
      "An inventory maps a product code to its current quantity. Updating a quantity preserves the unique product code.",
    next: "Different keys can calculate the same bucket. Discover this situation next.",
    question: {
      prompt: 'A table stores 12 → Ana. What does put(12, "Kim") do?',
      options: [
        "Creates two entries for key 12",
        "Replaces Ana with Kim",
        "Always rejects the operation",
      ],
      answer: 1,
      explanation:
        "Map keys are unique. Inserting with an existing key replaces its associated value.",
    },
  },
  {
    title: "Collisions: What Happens When Keys Meet?",
    tag: "DISCOVER THE CONFLICT",
    problem:
      "12 is already in bucket 2. Where will 27 and 32 go in a five-bucket table?",
    explanation:
      "12 mod 5, 27 mod 5, and 32 mod 5 all equal 2. These are different keys that share a destination. Neither record should be lost: the table must retain enough information to retrieve each one.",
    terms: [
      ["Collision", "Two different keys produce the same bucket index."],
      [
        "Collision handling",
        "A strategy that keeps colliding entries stored and retrievable.",
      ],
    ],
    application:
      "Many usernames may map to the same bucket. A collision is a normal storage situation, and does not mean those usernames are equal.",
    next: "Compare ways to handle the same collisions without discarding data.",
    question: {
      prompt: "Which pair collides when m = 5?",
      options: ["12 and 27", "12 and 13", "27 and 28"],
      answer: 0,
      explanation:
        "12 mod 5 = 2 and 27 mod 5 = 2. Equal bucket indexes cause a collision.",
    },
  },
  {
    title: "Collision Handling Techniques",
    tag: "COMPARE THE STRATEGIES",
    problem:
      "12 is in bucket 2. Key 27 also wants bucket 2. Should we keep them together or find another bucket?",
    explanation:
      "There are two basic choices. Chaining keeps colliding keys together in a list at the same bucket. Open addressing keeps one key per bucket and looks for another empty bucket. Linear probing checks the next bucket; quadratic probing and double hashing use different rules for choosing which bucket to check next.",
    terms: [
      [
        "Chaining",
        "A bucket holds a secondary collection, commonly a linked list and sometimes a balanced tree. This lab uses a list and traverses it during lookup.",
      ],
      [
        "Open addressing",
        "Colliding entries probe for another slot inside the table, with at most one entry per slot. Keep spare slots for efficient searches and insertions; a full table cannot accept another new key.",
      ],
      ["Linear probing", "pᵢ(k) = (h(k) + i) mod m, starting at i = 0."],
      [
        "Quadratic probing",
        "pᵢ(k) = (h(k) + i²) mod m; this simple variant may not reach every slot.",
      ],
      [
        "Double hashing",
        "pᵢ(k) = (h₁(k) + i × h₂(k)) mod m. Here h₂(k) = 1 + normalizedMod(k, m − 1).",
      ],
      [
        "Tombstone",
        "A deletion marker that preserves subsequent probe searches.",
      ],
    ],
    application:
      "Hash-based caches and dictionaries choose collision strategies to balance space and access cost. No method is always fastest. A long chain increases comparisons; probing may need many slot inspections.",
    next: "Explore how bucket count and distribution affect crowding.",
    question: {
      prompt:
        "Linear probing: m = 5, key 27, slots 2 and 3 occupied. Which slot is checked next?",
      options: ["0", "4", "2 again"],
      answer: 1,
      explanation:
        "The probe sequence is 2, 3, 4, 0, 1. After 2 and 3, check slot 4.",
    },
  },
  {
    title: "Table Design, Load Factor, and Rehashing",
    tag: "MAKE ROOM TO GROW",
    problem: "What changes if the same records are spread over more buckets?",
    explanation:
      "Load factor α = stored entries / buckets. Increasing capacity requires recalculating every entry’s index because m changes. A high load factor often increases contention; a low load factor indicates spare capacity and does not by itself require growth. Chaining can have α above 1; open addressing cannot store more entries than slots.",
    clarification:
      "Handout p. 4 says a low load factor means the table needs to grow. A mostly empty table already has spare capacity, so a low load factor alone does not call for growth. The lab grows only after the chosen threshold is exceeded. Prime sizes can help division-based schemes, but cannot guarantee uniform distribution for every dataset.",
    terms: [
      [
        "Initial size / table size selection",
        "Choose a starting capacity by balancing expected entries, memory, and collision strategy.",
      ],
      [
        "Prime numbers",
        "Prime table sizes can help some modulo and probing schemes. They are a design choice, not a universal requirement; Java HashMap uses different capacity rules.",
      ],
      [
        "Deterministic hashing",
        "The same key and unchanged function produce the same hash.",
      ],
      [
        "Hash function selection",
        "Choose a deterministic function that distributes keys uniformly and is fast to compute, so hashing itself does not dominate access time.",
      ],
      [
        "Uniform distribution",
        "Spread keys across buckets rather than crowding a few.",
      ],
      [
        "Clustering",
        "Keys gather in a few locations or adjacent occupied probe slots, increasing work.",
      ],
      [
        "Bucket structure",
        "Choose a collection for chaining or one entry per slot for open addressing.",
      ],
      [
        "Rehashing",
        "Recompute indexes and move all entries into a resized table.",
      ],
      [
        "Memory efficiency",
        "More buckets offer spare capacity but consume additional space.",
      ],
    ],
    application:
      "A growing registration system can resize its index when a chosen threshold is exceeded. Thresholds are policies; 0.75 is this lab’s starting setting.",
    next: "Use hashing to answer another question: have we already seen this element?",
    question: {
      prompt: "A table has 6 entries and 8 buckets. What is its load factor?",
      options: ["0.75", "1.33", "2"],
      answer: 0,
      explanation:
        "α = 6 / 8 = 0.75. It describes occupancy, not a guarantee about collision count.",
    },
  },
  {
    title: "Set Data Structures",
    tag: "KEEP ONLY UNIQUE ELEMENTS",
    problem:
      "A student registers twice. Should their ID appear twice in the registered-student collection?",
    explanation:
      "A Set is a collection of unique elements. Adding an element that already exists leaves its size unchanged. Use add, remove, contains, and clear to maintain or inspect membership. A List is more appropriate when duplicates or positional access matter.",
    terms: [
      [
        "Set data structure",
        "A data structure that stores and manipulates a collection of unique elements. Duplicate insertions are ignored.",
      ],
      [
        "Unique elements / duplicate handling",
        "A duplicate addition does not create another copy.",
      ],
      ["Membership", "Whether an element belongs to a collection."],
    ],
    application:
      "Track unique student IDs, registered usernames, or course codes without keeping duplicates. Different spellings and capitalization are distinct in these examples.",
    next: "Uniqueness does not decide ordering. Compare two Set implementations.",
    question: {
      prompt: "Add Apple, Banana, Apple, Grape to a Set. What is its size?",
      options: ["2", "3", "4"],
      answer: 1,
      explanation:
        "Only Apple, Banana, and Grape remain. The repeated Apple does not increase size.",
    },
  },
  {
    title: "HashSet vs TreeSet",
    tag: "UNIQUENESS & ORDER",
    problem:
      "Insert 50, 10, 30, 10. Can you require that iteration visits the numbers in sorted order?",
    explanation:
      "Both collections reject duplicates. HashSet is hash-based and makes no guarantee about iteration order. TreeSet is tree-based and maintains natural sorted order by default. The simplified tree here illustrates ordering, not Java’s balancing internals.",
    clarification:
      "Handout p. 5 describes unordered insertion as randomized. For Java HashSet, the precise rule is that iteration order is unspecified; it is not a promise of random shuffling on each run. The handout calls an ordered set the most common type; that description is not a universal usage guarantee. Hash-based operations average O(1) with good distribution and can degrade to O(n) in a general hash-table worst case.",
    terms: [
      [
        "Unordered set",
        "A set whose implementation does not promise an iteration order, such as HashSet.",
      ],
      [
        "Ordered set",
        "A set with defined iteration order; TreeSet uses sorted order.",
      ],
      [
        "Hash-based set / HashSet",
        "Uses hashing for membership operations; typically average O(1) with good distribution.",
      ],
      [
        "Tree-based set / TreeSet",
        "Uses an ordered tree; basic operations are O(log n).",
      ],
    ],
    application:
      "Use HashSet to track seen IDs when order does not matter. Use TreeSet when you need unique scores listed in sorted order.",
    next: "Sometimes an ID must lead to a record, rather than just a yes/no answer.",
    question: {
      prompt:
        "What iteration order does TreeSet<Integer> use by default for 50, 10, 30?",
      options: ["50, 10, 30", "10, 30, 50", "No guaranteed order"],
      answer: 1,
      explanation:
        "Integer natural order is ascending. HashSet does not provide this sorting guarantee.",
    },
  },
  {
    title: "Map Data Structures",
    tag: "CONNECT KEYS TO VALUES",
    problem:
      "Knowing that a student ID exists is useful. How can that ID also retrieve the student’s name?",
    explanation:
      "A Map stores key-value mappings with unique keys. Values may repeat. A new key grows the map; an existing key updates its value. Maps have dynamic size, although their storage and resizing behavior depend on the implementation.",
    terms: [
      [
        "Map data structure",
        "A data structure storing information as key-value pairs, where each key is unique and maps to exactly one value.",
      ],
      [
        "Uniqueness of keys",
        "At most one mapping per key; updating replaces its value.",
      ],
      [
        "Fast access",
        "HashMap usually provides average O(1) basic access under good distribution; TreeMap provides O(log n).",
      ],
      ["Dynamic size", "Mappings can be added or removed as the program runs."],
    ],
    application:
      "A student directory maps student numbers to records. A Set stores just the unique IDs; a Map stores the association needed to retrieve details.",
    next: "Compare maps that offer different iteration-order guarantees.",
    question: {
      prompt: 'Can two different map keys share the value "Ana Reyes"?',
      options: ["Yes", "No, values must also be unique"],
      answer: 0,
      explanation:
        "Only keys must be unique. Two distinct IDs can map to the same name.",
    },
  },
  {
    title: "HashMap, TreeMap, and LinkedHashMap",
    tag: "CHOOSE YOUR ORDER",
    clarification:
      "The handout’s constant-time statement for a Hash Map describes average-case access with suitable hash distribution. It is not a guarantee for every operation. TreeMap provides logarithmic basic operations; HashMap and HashSet do not guarantee iteration order.",
    problem:
      "Should a product-price directory display in sorted key order or in the order products were added?",
    explanation:
      "All three implementations store unique keys. HashMap does not guarantee iteration order. TreeMap sorts keys by natural order by default. LinkedHashMap preserves insertion order by default; replacing an existing value does not move its key. A remove followed by a new insertion places the key at the end.",
    terms: [
      ["HashMap", "Hash-based map without an iteration-order guarantee."],
      ["TreeMap", "Tree-based map whose keys are sorted by default."],
      [
        "LinkedHashMap",
        "Combines hashing with a linked list that tracks insertion order by default, making iteration predictable.",
      ],
    ],
    application:
      "Use TreeMap for an alphabetized directory, LinkedHashMap for an arrival log, and HashMap for keyed access when iteration order is unimportant.",
    next: "Connect these visible operations to complete Java examples.",
    question: {
      prompt: "Which map preserves insertion order by default?",
      options: ["HashMap", "TreeMap", "LinkedHashMap"],
      answer: 2,
      explanation:
        "LinkedHashMap records insertion order. TreeMap sorts keys, while HashMap promises no iteration order.",
    },
  },
  {
    title: "Java Code Walkthroughs",
    tag: "CONNECT THE CODE",
    problem: "Which line changes the collection, and which line only reads it?",
    explanation:
      "Step through complete, predefined Java examples. Each active statement updates a matching visual state and explanatory console. This is an educational execution trace; the website does not compile or run Java. get reads a value, containsKey checks membership, and remove deletes a mapping.",
    terms: [
      [
        "put / add",
        "Insert or update a map mapping; add a unique element to a set.",
      ],
      [
        "get / contains / containsKey",
        "Read a mapping or test membership without changing the collection.",
      ],
      [
        "remove / clear",
        "Delete a specified element or mapping; clear removes all contents.",
      ],
    ],
    application:
      "Use these traces to predict program behavior before running a similar program in your Java IDE. The console never invents a guaranteed HashMap or HashSet order.",
    next: "Try five practice levels, from recognizing a key to choosing a structure.",
    question: {
      prompt: "Which Java statement checks whether a map contains a key?",
      options: [
        'map.containsKey("name")',
        'map.add("name")',
        'map.contains("name")',
      ],
      answer: 0,
      explanation:
        "Map uses containsKey(key). Set uses contains(element); add belongs to Set, not Map.",
    },
  },
  {
    title: "Interactive Practice Lab",
    tag: "PREDICT · TRY · EXPLAIN",
    problem:
      "Can you calculate a bucket, predict a collision response, and choose the right collection?",
    explanation:
      "Work through five levels. Read the feedback after each attempt, return to a simulator if needed, and retry. Progress belongs to this browser session; no account is required.",
    terms: [
      [
        "Recognition → application",
        "Identify the parts, calculate results, predict operations, read code, and justify a collection choice.",
      ],
    ],
    application:
      "Design choices become easier when you connect the needed behavior—unique elements, keyed access, sorting, or insertion order—to a specific structure.",
    next: "Finish by checking your understanding and reviewing the comparison table.",
  },
  {
    title: "Final Knowledge Check and Summary",
    tag: "PUT IT TOGETHER",
    problem:
      "Can you explain how records remain retrievable even when their keys collide?",
    explanation:
      "Hashing helps select a storage location. Collision handling preserves distinct entries. Sets enforce unique elements; Maps associate unique keys with values. Choose the implementation according to its ordering and access guarantees.",
    terms: [
      [
        "The complete chain",
        "Concept → simple explanation → visualization → interaction → Java connection → understanding check.",
      ],
    ],
    application:
      "Apply these ideas to student directories, duplicate detection, inventory, caching, and sorted or arrival-ordered listings.",
    next: "Revisit any section to test a new input or explain a trace to a classmate.",
  },
];

// References to the supplied nine-page IT2503 handout; labs and practice add
// instructional examples without claiming that they appear verbatim there.
export const handoutPagesBySection = [
  "1",
  "1–2",
  "2–3",
  "4–5",
  "3–5",
  "3–5",
  "5–7",
  "5–7",
  "7",
  "7–9",
  "2–3, 6–9",
  "1–9",
  "1–9",
];

export const hashingRealLifeExamples = [
  {
    title: "Student and product directories",
    type: "HASH TABLES · LOOKUP",
    text: "A student ID can lead to a student record; a product code can lead to its price. Hashing helps choose where to look instead of scanning every record.",
  },
  {
    title: "Application caches",
    type: "HASH TABLES · REUSE RESULTS",
    text: "An app can use a page URL or search query as a cache key to find a saved result quickly, avoiding repeated work.",
  },
  {
    title: "Password verification",
    type: "CRYPTOGRAPHIC HASHING · VERIFY",
    text: "A login system can store a salted password hash and verify a submitted password against it. Password storage uses a dedicated slow algorithm, such as Argon2id, rather than this lesson’s modulo function or plain SHA-256.",
  },
  {
    title: "Checking downloaded files",
    type: "CRYPTOGRAPHIC HASHING · INTEGRITY",
    text: "Compute a downloaded file’s digest, such as SHA-256, and compare it with an expected digest from a trusted source to check whether the file matches.",
  },
];

export const hashingEncryptionComparison = [
  [
    "Purpose",
    "Produce a digest for verification or integrity checks.",
    "Keep data confidential while allowing authorized recovery.",
  ],
  [
    "Direction",
    "One-way: there is no decryption operation for a digest.",
    "Reversible: decrypt ciphertext using the appropriate key.",
  ],
  [
    "Example",
    "Verify a password or compare a file’s digest.",
    "Protect a message or backup that must be read again.",
  ],
];

export const hashingEncryptionQuestions = [
  {
    prompt:
      "A private message must be readable by its intended recipient. Which operation allows that?",
    options: ["Cryptographic hashing", "Encryption"],
    answer: 1,
    explanation:
      "Encryption allows an authorized recipient to decrypt and read the original message. A hash digest has no decryption operation.",
  },
  {
    prompt:
      "A login system only needs to verify a password, without recovering the original. Which approach fits?",
    options: ["Salted password hashing", "Reversible password encryption"],
    answer: 0,
    explanation:
      "Use a dedicated password-hashing algorithm and a salt to verify the submitted password. There is no need to decrypt a stored password.",
  },
];

export const practiceLevels = [
  {
    title: "1 · Recognition",
    questions: [
      {
        prompt: "In 2026001 → Ana Reyes, which part is the key?",
        options: ["2026001", "Ana Reyes", "The arrow"],
        answer: 0,
        explanation:
          "The ID is the lookup key; Ana Reyes is its associated value.",
      },
      {
        prompt: "What is a bucket?",
        options: [
          "A storage location in a hash table",
          "Always the original key",
          "A duplicate value",
        ],
        answer: 0,
        explanation:
          "A bucket is an indexed storage location. Chaining can store multiple entries there.",
      },
      {
        prompt: "12 and 27 both map to bucket 2. What happened?",
        options: ["A collision", "A duplicate key", "A deletion"],
        answer: 0,
        explanation:
          "Different keys with the same bucket index produce a collision.",
      },
    ],
  },
  {
    title: "2 · Calculation",
    questions: [
      {
        prompt: "Calculate 27 mod 10.",
        options: ["2", "7", "10"],
        answer: 1,
        explanation: "27 = 2 × 10 + 7. The remainder is 7.",
      },
      {
        prompt: "Where does −12 go with 5 buckets in our normalized model?",
        options: ["−2", "2", "3"],
        answer: 2,
        explanation:
          "Normalize JavaScript’s negative remainder: ((−12 % 5) + 5) % 5 = 3.",
      },
      {
        prompt: "8 entries / 10 buckets gives which load factor?",
        options: ["0.8", "1.25", "2"],
        answer: 0,
        explanation: "Load factor is entries divided by buckets: 8 / 10 = 0.8.",
      },
    ],
  },
  {
    title: "3 · Prediction",
    questions: [
      {
        prompt:
          "Linear probing starts at occupied slot 4 in a size-5 table. Check next?",
        options: ["5", "0", "3"],
        answer: 1,
        explanation: "(4 + 1) mod 5 = 0. Probing wraps around the array.",
      },
      {
        prompt: "Add an existing element to a Set. What happens?",
        options: [
          "Size increases",
          "Size stays the same",
          "The Set is cleared",
        ],
        answer: 1,
        explanation:
          "The element is already present, so no duplicate is stored.",
      },
      {
        prompt: 'put("name", "Kim") follows put("name", "Ana"). What remains?',
        options: ["Two name keys", "name → Kim", "name → Ana"],
        answer: 1,
        explanation: "The existing mapping is updated. Map keys remain unique.",
      },
    ],
  },
  {
    title: "4 · Code understanding",
    questions: [
      {
        prompt:
          'map.put("apple", 10); map.remove("apple"); map.containsKey("apple") returns…',
        options: ["true", "false", "10"],
        answer: 1,
        explanation:
          "remove deletes the mapping, so containsKey returns false.",
      },
      {
        prompt:
          "TreeSet<Integer>: add(50), add(10), add(30), add(10). Printed contents?",
        options: ["[50, 10, 30, 10]", "[10, 30, 50]", "[50, 10, 30]"],
        answer: 1,
        explanation:
          "TreeSet removes duplicates and iterates integers in ascending natural order.",
      },
      {
        prompt: 'map.put("name", "Kimmy"); map.get("name") returns…',
        options: ["name", "Kimmy", "true"],
        answer: 1,
        explanation: "get retrieves the value associated with the key: Kimmy.",
      },
    ],
  },
  {
    title: "5 · Application",
    questions: [
      {
        prompt: "Store unique student IDs when order is irrelevant. Choose:",
        options: [
          "HashSet",
          "A List of duplicates",
          "LinkedHashMap of unrelated values",
        ],
        answer: 0,
        explanation:
          "HashSet stores unique elements with hash-based membership checks.",
      },
      {
        prompt: "Retrieve student details using student numbers. Choose:",
        options: [
          "HashMap",
          "HashSet of names only",
          "A sorted list of grades",
        ],
        answer: 0,
        explanation:
          "A Map associates each student-number key with the corresponding details.",
      },
      {
        prompt: "Keep directory keys sorted. Choose:",
        options: ["HashMap", "TreeMap", "HashSet"],
        answer: 1,
        explanation: "TreeMap maintains sorted keys by default.",
      },
      {
        prompt: "Keep product mappings in arrival order. Choose:",
        options: ["TreeSet", "LinkedHashMap", "TreeMap"],
        answer: 1,
        explanation: "LinkedHashMap preserves insertion order by default.",
      },
    ],
  },
];

export const finalQuestions = [
  {
    prompt: "Which statement describes hashing accurately?",
    options: [
      "Every lookup takes exactly one operation",
      "A key is transformed to help find a storage location",
      "Different keys never share buckets",
    ],
    answer: 1,
    explanation:
      "Hashing uses a key to help choose where data is stored or found. Collisions can require additional comparisons.",
  },
  {
    prompt: "After resizing from 5 to 11 buckets, what must happen?",
    options: [
      "Keep every old index",
      "Recalculate each key’s bucket",
      "Delete all colliding entries",
    ],
    answer: 1,
    explanation:
      "The modulo divisor changes, so all entries must be rehashed into the new table.",
  },
  {
    prompt: "Why keep a deletion marker during open addressing?",
    options: [
      "To allow duplicate keys",
      "To keep later colliding entries reachable",
      "To sort the table",
    ],
    answer: 1,
    explanation:
      "A search must continue beyond deleted slots rather than treat them as never-used empty locations.",
  },
  {
    prompt: "Which structure gives unique elements in sorted order by default?",
    options: ["HashSet", "TreeSet", "LinkedHashMap"],
    answer: 1,
    explanation: "TreeSet combines uniqueness with natural sorted order.",
  },
  {
    prompt: "Which statement about load factor is correct?",
    options: [
      "A low factor always triggers growth",
      "It equals entries divided by buckets",
      "It equals the exact collision count",
    ],
    answer: 1,
    explanation:
      "Load factor measures entries per bucket. Distribution also affects collisions, and low occupancy alone does not require growth.",
  },
];

export const summaryRows = [
  [
    "Hashing",
    "Transforms keys to help locate data",
    "Average O(1) hash-table access under good distribution",
  ],
  [
    "Hash table",
    "Stores key-value pairs using hashing",
    "Compare keys when buckets collide",
  ],
  [
    "Collision",
    "Different keys, same bucket index",
    "Handled with chaining or probing",
  ],
  [
    "Chaining",
    "Multiple entries in one bucket",
    "Search may traverse the chain",
  ],
  [
    "Open addressing",
    "One entry per slot; probe elsewhere",
    "Linear, quadratic, or double hashing",
  ],
  ["Set", "Stores unique elements", "Duplicate additions do not increase size"],
  [
    "Map",
    "Associates unique keys with values",
    "An existing key receives a replacement value",
  ],
  ["HashSet", "Unique elements", "No guaranteed iteration order"],
  ["TreeSet", "Unique elements", "Sorted by default"],
  [
    "HashMap",
    "Unique keys paired with values",
    "No guaranteed iteration order",
  ],
  ["TreeMap", "Unique keys paired with values", "Sorted keys by default"],
  [
    "LinkedHashMap",
    "Unique keys paired with values",
    "Insertion order by default",
  ],
];
