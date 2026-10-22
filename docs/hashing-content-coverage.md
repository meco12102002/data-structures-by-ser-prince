# Handout 05 content coverage checklist

Audited against all nine pages of `05_Handout_1(34).pdf` (IT2503 — 05 Handout 1). The existing 13-section route `/learn/hashing-sets-and-maps` is retained. Section numbers below are the website's existing navigation numbers; this task's nine content areas are integrated into them rather than replacing navigation.

| Done | Handout pages | Original topic / subtopic                                                                      | Website section and demonstration                                                                          |
| ---- | ------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [x]  | 1             | Hashing: source definition and simple explanation                                              | 01 — original definition precedes record lookup                                                            |
| [x]  | 1             | Hash Table / Hash Map; insertion, search, deletion                                             | 03 — source definition, simulator, Java operations                                                         |
| [x]  | 1             | Arrays, linked lists, known index vs name lookup                                               | 01 — comparison table and retained sequential-search activity                                              |
| [x]  | 1             | Numbered-library-shelf analogy                                                                 | 01 — real-world application explanation                                                                    |
| [x]  | 1–2           | Key-Value Pair: name/Kimmy, age/32, city/Tacloban                                              | 01 — selectable, five-stage handout record lookup                                                          |
| [x]  | 1–2           | Hash Function; fixed-size Hash / Hash Code / Hash Value                                        | 02 — formal definitions, original formulas, live calculation                                               |
| [x]  | 2             | Illustrative string hashes 2, 4, 3                                                             | 01 — hash stage labeled as a teaching model, distinct from Java hashCode                                   |
| [x]  | 2             | index = hash(key) % array_size; h(k) = k mod m                                                 | 02 — formulas, variable definitions, immediate key/capacity updates, manual playback                       |
| [x]  | 2             | 27 mod 10 = 7; storage in buckets; retrieval                                                   | 01–03 — handout records, live numeric example, key comparisons                                             |
| [x]  | 2–3           | HashTableExample: apple/banana/grape, get, containsKey(cherry), else, remove, printed contents | 11 — complete original program and execution trace                                                         |
| [x]  | 3             | Table Design: even distribution, collision handling, memory, average-case access               | 06 — formal definition plus four focused activities                                                        |
| [x]  | 3             | Initial Size; Number of Buckets; too small vs too large                                        | 06 — Table size and allocation: 5, 11, 47 and selectable capacities; counts, calculations, empty positions |
| [x]  | 3             | Prime Numbers; division-based sizes; clustering                                                | 06 — same-key 10 vs 11 comparison, multiples-of-10 preset, collision counterexample                        |
| [x]  | 3             | Resizing and 0.75 threshold                                                                    | 06 — retained configurable conceptual rehashing and separate Java illustration                             |
| [x]  | 3             | Hash Function Selection: deterministic, uniform distribution, fast computation                 | 06 — repeated calls, poor/less-crowded bucket distribution, arithmetic-work comparison                     |
| [x]  | 3–5           | Bucket Structure: linked list or tree; chaining lookup cost                                    | 04–05 — chained key-value records and guided same-bucket insertion/search                                  |
| [x]  | 4–5           | Collision: distinct keys, same index; preserve retrieval                                       | 04 — prediction before the collision is stored                                                             |
| [x]  | 5             | Chaining process and [(12,A),(27,B),(32,C)] at bucket 2                                        | 04–05 — exact handout records and step-by-step chain traversal                                             |
| [x]  | 4–5           | Open Addressing; one entry per slot; spare capacity; deletion markers                          | 05 — alternative buckets, safe full-table handling, retained search/deletion activity                      |
| [x]  | 4–5           | Linear, Quadratic, Double Hashing                                                              | 05 — same input keys, exact formulas/sequences, jump size, bounded failed insertions                       |
| [x]  | 4             | Load Factor = stored entries / buckets; low vs high factor                                     | 06 — counts, source clarification, live ratios, threshold policy                                           |
| [x]  | 5             | Rehashing: new larger table, recompute indexes, reinsert all keys                              | 06 — old/new tables, animated transfers, retained mappings                                                 |
| [x]  | 5             | Set Data Structure; unique elements; ignored duplicates                                        | 07 — source definition and Apple/Banana/Apple interaction                                                  |
| [x]  | 5–6           | Unordered Set; average constant and general worst-case linear access                           | 08 — original terminology and separate ordering clarification                                              |
| [x]  | 6             | Ordered Set; balanced BSTs; lookup/insertion/deletion                                          | 08 — source excerpt and simplified ordered-tree visualization                                              |
| [x]  | 6–7           | Hash-based Set / HashSet, Tree-based Set / TreeSet                                             | 08 — synchronized unique members, order comparison, Java connection                                        |
| [x]  | 6             | HashSetExample and both valid print orders                                                     | 11 — original program; possible output orders explicitly labeled                                           |
| [x]  | 6–7           | TreeSetExample: 50,10,30 → [10,30,50]                                                          | 08 and 11 — sorted diagram and complete original Java trace                                                |
| [x]  | 7             | Map Data Structure: unique key maps to one value                                               | 09 — source definition, student-directory operations                                                       |
| [x]  | 7             | Key-Value Pairing, Fast Access, Dynamic Size, Uniqueness of Keys                               | 09 — terms, side-by-side Set/Map contents, growing/updating/deleting mappings                              |
| [x]  | 7–8           | HashMap and Map<K,V> syntax; name/Kimmy and course/BSIT                                        | 09–11 — Java connection plus complete HashMapExample                                                       |
| [x]  | 8             | Retrieval variable, containsKey branch, course deletion, printed output                        | 11 — line-by-line HashMapExample trace                                                                     |
| [x]  | 8–9           | Tree Map definition, sorted keys, Map<K,V> syntax                                              | 10–11 — same products, insertion-order controls, complete TreeMapExample                                   |
| [x]  | 9             | Linked Hash Map: hashing + linked list, insertion order, efficient operations                  | 10–11 — shared mappings, rebuild in chosen order, complete LinkedHashMapExample                            |
| [x]  | 8–9           | banana/20, apple/10, grape/30; exact sorted and insertion-order outputs                        | 10–11 — interactive comparison and both original Java programs                                             |

## Explicit clarifications retained with the source concepts

- Page 2's `k = 2` is inconsistent with `h(27)`; the calculation uses 27. Raw hash codes and final bucket indexes are distinct stages.
- Page 3's prime-number claim is preserved alongside its limits: some patterns improve; collisions are not universally prevented. Modern Java HashMap uses power-of-two capacities.
- Page 4's low-load-factor growth statement is distinguished from the corrected explanation: spare capacity alone is not a reason to grow.
- Page 5's randomized insertion wording is preserved in the excerpt, then clarified as no guaranteed Java HashSet iteration order. Page 6's “most common” label is not a universal usage guarantee.
- Page 7's constant-time Hash Map wording is preserved, then qualified as average-case under suitable distribution.
- The added Java illustration draws a target 16-bucket table, explains lazy allocation, reaches threshold 12, pauses inside the 13th distinct put, and redistributes 13 entries into 32 buckets. It is labeled separately from the conceptual modulo rehashing model and from a live Java runtime.

## Preservation and validation

- The six original Java programs remain in `src/data/hashingJava.js`; the six existing JDK compile/output tests are retained.
- The 13 existing sections, routes, Default/Slides modes, progress/completion, collision methods, search/deletion, and previously requested security examples remain available.
- Definitions precede simple explanations and visualizations. Java connection excerpts follow the activities, with complete programs in section 11.
- New pure-model tests cover record traces, prime/non-prime allocation, invalid input, bounded computation, the 12/13-entry resize boundary, preservation during transfer, and insertion-order rebuilding.
