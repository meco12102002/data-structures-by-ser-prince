export const lessons = [
  {
    number: "01",
    slug: "introduction-to-data-structures",
    title: "Introduction to Data Structures",
    description:
      "Understand what data structures are, why they matter, and how they help organize data.",
    topic: "FOUNDATIONS",
    isAvailable: false,
  },
  {
    number: "02",
    slug: "arrays",
    title: "Arrays",
    description:
      "Learn how arrays store elements and how accessing, inserting, and removing data works.",
    topic: "LINEAR",
    isAvailable: false,
  },
  {
    number: "03",
    slug: "linked-lists",
    title: "Linked Lists",
    description:
      "Explore how nodes connect to one another and how linked lists differ from arrays.",
    topic: "LINEAR",
    isAvailable: false,
  },
  {
    number: "04",
    slug: "stacks",
    title: "Stacks",
    description:
      "Understand the Last-In, First-Out principle through interactive operations.",
    topic: "LINEAR",
    isAvailable: false,
  },
  {
    number: "05",
    slug: "queues",
    title: "Queues",
    description:
      "Explore the First-In, First-Out principle and how queues manage data.",
    topic: "LINEAR",
    isAvailable: false,
  },
  {
    number: "06",
    slug: "binary-trees",
    title: "Binary Trees",
    description:
      "Understand nodes, relationships, and traversal through interactive exploration.",
    topic: "NON-LINEAR",
    isAvailable: true,
  },
  {
    number: "07",
    slug: "heaps-and-priority-queues",
    title: "Heaps and Priority Queues",
    description:
      "See how heaps maintain priority, map to arrays, and power priority queues.",
    topic: "NON-LINEAR",
    isAvailable: true,
  },
  {
    number: "08",
    slug: "graphs",
    title: "Graphs",
    description:
      "Learn how vertices and edges represent relationships between connected data.",
    topic: "NON-LINEAR",
    isAvailable: false,
  },
  {
    number: "09",
    slug: "searching",
    title: "Searching",
    description:
      "Explore different ways algorithms locate data inside a structure.",
    topic: "ALGORITHMS",
    isAvailable: false,
  },
  {
    number: "10",
    slug: "sorting",
    title: "Sorting",
    description:
      "Understand how sorting algorithms rearrange data into a desired order.",
    topic: "ALGORITHMS",
    isAvailable: false,
  },
];

export function getLessonPath(lesson) {
  return `/learn/${lesson.slug}`;
}
