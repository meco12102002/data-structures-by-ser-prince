# Hashing, Sets, and Maps

Route: `/learn/hashing-sets-and-maps`. Listed as lesson 11 on `/learn`.

The 13 sections use the existing lesson layout and React/Vite stack, including the shared hero, section headings, back navigation, and Default/Slides switch used by the binary-tree and heap lessons. Both views retain each lab's state in memory. Full-lesson scrolling records section visits; slides use section navigation. Playback timers pause outside the active section and clean up when the page unmounts. Progress and answers reset on page reload; there is no backend or account requirement.

## Content provenance

The implementation was compared against all nine pages of the supplied `05_Handout_1(34).pdf`, IT2503 — 05 Handout 1: Hashing, Sets, and Maps. The handout is the primary course source. Each lesson section displays its source pages; the interactive labs and practice extend those examples.

The first section also includes requested supplemental examples of directory lookup, application caches, password verification, and file integrity, plus a hashing-versus-encryption comparison and two practice questions. It explicitly distinguishes hash-table bucket functions from cryptographic hashes. Security explanations reference the linked OWASP Password Storage and Security Terminology cheat sheets; they are additional context beyond the handout.

| Handout pages | Coverage                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| 1–2           | Hashing, the library analogy, key-value records, raw hash values, bucket indexes, storage, and retrieval |
| 2–3           | Fruit-count HashMap program: insertion, retrieval, missing-key check, deletion, and display              |
| 3–5           | Table design, function selection, bucket structures, load factor, collision handling, and rehashing      |
| 5–7           | Sets, HashSet fruit duplicates, and TreeSet number ordering                                              |
| 7–8           | Map properties and the name/course HashMap example using the Map interface                               |
| 8–9           | TreeMap sorted keys and LinkedHashMap insertion order                                                    |

The six Java walkthroughs preserve the handout's operations, identifiers, values, branches, class names, and output labels; comments and whitespace are condensed. HashMap and HashSet console panels explicitly show one possible iteration order rather than a guaranteed ordering. Map examples retain the `Map<K, V>` interface syntax from the handout.

The [topic-by-topic coverage checklist](hashing-content-coverage.md) maps every handout topic to the existing sections. Relevant sections follow the sequence: original concept, simple explanation, visualization and interaction, Java connection, and understanding check. Source excerpts remain distinct from technical clarifications.

The opening record lookup follows name/Kimmy, age/32, and city/Tacloban through key, hash function, index, bucket, and value. Numeric modulo calculations update immediately when the key or capacity changes. Section 06 retains conceptual rehashing and adds separate activities for allocation, deterministic/uniform/fast functions, and Java's 16-bucket, 0.75-load-factor resize illustration. Section 10 can rebuild the same mappings in a different insertion order to compare the three Map implementations.

Concise handout clarifications are included beside the relevant concepts:

- Page 2's `k = 2` beside `h(27)` is inconsistent; that example uses `k = 27`. Raw hash codes are distinguished from the bucket index after modulo.
- Page 4's statement that a low load factor requires growth is corrected: low occupancy indicates spare capacity. The lab grows after its configured threshold is exceeded.
- Page 5's description of unordered insertion as randomized is clarified: Java HashSet makes no iteration-order guarantee; it does not promise random reshuffling.
- Prime sizes help some division-based schemes, but do not guarantee uniform distribution. Hash-table constant-time access is an average-case expectation under good distribution.

Java collection ordering and API behavior were checked against Oracle's Java SE 25 documentation, linked in the final review. Complete Java programs live in `src/data/hashingJava.js`. They are authored execution traces, not a browser Java runtime. The diagrams intentionally model simplified algorithms and never predict a fixed Java HashMap or HashSet iteration order.

## Maintenance

- `src/data/hashingLesson.js`: lesson text, terminology, practice, and final questions.
- `src/data/hashingCurriculum.js`: original handout concept excerpts and section-level Java connections.
- `src/utils/hashing.js`: pure algorithms; no React or DOM dependencies.
- `src/utils/hashDesign.js`: record traces, allocation comparisons, bounded computation, Java resize snapshots, and immutable insertion-order rebuilding.
- `src/utils/collisionGuide.js`: short insertion traces derived from those same algorithms, showing the incoming key, original bucket, occupied/empty checks, and storage separately.
- `src/data/collisionLesson.js`: plain-language rules, analogies, formulas, and takeaways for the four collision methods.
- `src/hooks/useLessonPlayback.js`: cancellable playback with manual stepping and speed controls.
- `src/components/learning/hashing/`: reusable UI, simulators, collection comparisons, walkthroughs, and practice.
- `src/pages/HashingLesson.jsx`: route layout, section navigation, exploration progress, and completion.
- Existing `binary-tree.css` and `heaps.css` rules also expose neutral `lesson-page`, `lesson-panel`, `lesson-controls`, `lesson-field`, and `lesson-callout` classes, so the lesson reuses their styling without changing existing lessons.
- `src/styles/legacy/hashing.css`: hashing diagrams, code traces, and responsive simulator layout. Imported through the existing legacy stylesheet alongside the other lessons; there is no separate page theme.

`npm test` checks modulo normalization, collision preservation, replacement, deletion markers, bounded probe sequences, rehash snapshots, Set uniqueness, and Map updates. `npm run build` builds the site; `npm run lint` checks the repository. Existing unrelated tree/heap lint findings are outside this lesson's scope.

Open addressing limits each operation to at most m probes. Quadratic probing explicitly reports unreachable free slots. The selectable double-hashing table sizes are prime; `1 + normalizedMod(k, m - 1)` therefore gives a step coprime to m. Chaining counts bucket visits and key comparisons; probing counts slot inspections, with the difference explained beside the comparison table.

The collision-handling lab introduces two choices first: share a bucket (chaining) or find another bucket (open addressing). The default example follows 12, 27, and 32 one key at a time, with plain-language feedback before each insertion. Linear probing is the first open-addressing method to try. Formulas, custom inputs, searching/deletion, and the four-method results table are available in expandable sections so the initial explanation stays focused. Existing playback, speed, reset, and advanced methods remain available.

The UI retains the shared dark/lime palette, page width, headings, and square edges. Reading text and controls use the site's sans-serif font; code, formulas, and indices use monospace. Table-design activities use visible selection buttons with retained panel state and keyboard access. Chaining uses compact indexed rows; open addressing uses individual cells. Large allocation examples show a numbered capacity overview with an expandable full table. Entries/capacity/load factor are grouped above secondary allocation statistics. Nested panels use dividers and spacing, playback has a clear primary action, and feedback is labeled beside the demonstration. On phones, process diagrams become vertical sequences and section navigation keeps previous/next together.

To complete the lesson, visit all sections and correctly answer each final question, then choose **Complete lesson**. Practice tracks mastery per question, permits retries, and provides a reset.

## Verification

- Twenty-two tests cover the core algorithms (including 1,440 mixed open-addressing operations checked against a reference Map), guided collision traces, allocation and resize preservation, Java trace integrity, and six Java compilation/output checks.
- All six handout Java examples compile with JDK 25, and actual console output matches the trace's allowed outputs. `npm test` includes these checks and skips compilation only when no local JDK is available.
- Headless Edge checks pass for search counters, playback, invalid and negative inputs, table operations, collisions, all four handling methods, exhausted/full tables, threshold pauses, rehash preservation, Set uniqueness, Map replacement/ordering, walkthrough reversal, practice resets, and completion.
- Automated axe WCAG A/AA checks report no violations across all 13 sections. This is an automated audit, not a substitute for assistive-technology testing.
- All sections were checked for page overflow at 1440, 768, 390, and 320 pixels; desktop and mobile screenshots were reviewed.
- The landing page, lesson catalog, and existing binary-tree and heap routes load without browser runtime errors.
- Production build and lint of changed JavaScript files pass. Repository-wide lint still reports nine existing errors and one warning in unrelated tree/heap components. Vite also reports the existing main application chunk above 500 kB; the new lesson loads as a separate chunk.
- After handout alignment, production-preview checks pass for all six walkthroughs, active source-line synchronization, both conditional branches, console history, reverse/restart, handout clarifications, source-page references, keyboard labels, and code-panel overflow at tablet and phone widths. The empty-tree semantic role is corrected, and the 13-section automated accessibility scan reports no violations.
- Shared-style checks confirm that the hashing page matches the binary-tree lesson's page width and heading typography. Default/Slides switching retains simulator state; full-lesson scrolling updates section navigation. Both views pass accessibility checks, all sections fit desktop/tablet/phone widths, and existing lesson routes still load without runtime errors.
- The guided collision lab passes browser checks for before/after insertion states, all four methods, reverse/play/pause/restart/speed controls, advanced search after deletion, custom/invalid/negative keys, full and exhausted tables, expandable formulas/results, both lesson views, mobile overflow, and automated accessibility. Desktop and mobile screenshots were reviewed.
- Content-enhancement browser checks pass for all three record lookups, live modulo input, small/large/spare-capacity allocation, prime/non-prime distribution, each hash-function property, conceptual rehashing, Java's 12/13-entry threshold and 32-bucket transfer, and insertion-order rebuilding. All 13 sections pass automated accessibility checks; the new activities fit 1440, 768, 390, and 320 pixel viewports.
- Additional accessibility scans pass for every table-design activity and hash-function property panel, including expanded prime comparisons. Playback pauses and retains its place when switching activities or collapsing the search comparison, and resumes when reopened.
- UI-refinement checks pass for keyboard activity selection, 47/97-bucket overviews and expanded entries, compact prime comparisons, all collision methods, preserved hidden-panel playback, both lesson views, and every section at 1440/768/390/320 pixels. Automated accessibility scans pass across all sections and activity variants, including the large-capacity and resize-transfer views. Desktop and phone screenshots were reviewed.
