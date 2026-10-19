export const collisionMethods = {
  chaining: {
    name: "Chaining",
    label: "Chaining · share the bucket",
    rule: "Keep the same bucket. Store colliding keys together in a list.",
    analogy:
      "Think of one shelf holding several labeled books. The shelf number stays the same, but each book keeps its own label.",
    formula: "h(k) = normalizedMod(k, m); keep a list in each bucket.",
    takeaway:
      "Chaining: one bucket can hold several keys. To find a key, check the list in that bucket.",
  },
  linear: {
    name: "Linear probing",
    label: "Linear probing · try the next bucket",
    rule: "One key per bucket. If a bucket is occupied, check the next one. Wrap to bucket 0 after the last bucket.",
    analogy:
      "Think of numbered parking spaces. If your space is taken, check the next space until you find an empty one.",
    formula: "pᵢ(k) = (h(k) + i) mod m",
    takeaway:
      "Linear probing: colliding keys stay in separate buckets. Search checks the same sequence used during insertion.",
  },
  quadratic: {
    name: "Quadratic probing",
    label: "Quadratic probing · use square-number offsets",
    rule: "One key per bucket. Try offsets 0, 1, 4, 9, … from the original bucket, wrapping around the table.",
    analogy:
      "Instead of checking neighboring spaces, use a planned sequence of bigger offsets. Each offset starts from the original bucket, not the last one checked.",
    formula: "pᵢ(k) = (h(k) + i²) mod m",
    takeaway:
      "Quadratic probing: use square-number offsets from the original bucket. This sequence may miss empty buckets, so attempts are limited.",
  },
  double: {
    name: "Double hashing",
    label: "Double hashing · calculate a jump size",
    rule: "One key per bucket. A second hash calculation gives this key’s jump size. Keep using that jump, wrapping around the table.",
    analogy:
      "Each key gets its own step size. A key with a jump of 2 checks every second bucket in its sequence.",
    formula:
      "h₁(k) = normalizedMod(k, m); h₂(k) = 1 + normalizedMod(k, m − 1); pᵢ(k) = (h₁(k) + i × h₂(k)) mod m",
    takeaway:
      "Double hashing: a second hash function chooses the jump size. Our prime table sizes make this sequence reach every bucket.",
  },
};
