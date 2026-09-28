export const binaryTreeTraversals = [
  {
    number: "05",
    type: "PREORDER",
    rule: "ROOT -> LEFT -> RIGHT",
    title: "Preorder Traversal: Visit the Root First",
    description:
      "In preorder traversal, we visit the current node first, then traverse its left subtree, followed by its right subtree.",
  },
  {
    number: "06",
    type: "INORDER",
    rule: "LEFT -> ROOT -> RIGHT",
    title: "Inorder Traversal: Visit the Root Between Subtrees",
    description:
      "In inorder traversal, we traverse the left subtree first, visit the current node, and then traverse the right subtree.",
  },
  {
    number: "07",
    type: "POSTORDER",
    rule: "LEFT -> RIGHT -> ROOT",
    title: "Postorder Traversal: Visit the Root Last",
    description:
      "In postorder traversal, we traverse the left subtree first, then the right subtree, and visit the current node last.",
  },
  {
    number: "08",
    type: "LEVEL ORDER",
    rule: "TOP -> BOTTOM, LEFT -> RIGHT",
    title: "Level Order Traversal: Visit Each Level",
    description:
      "In level order traversal, we visit nodes one level at a time, starting at the root and moving from left to right.",
  },
];

export const binaryTreeSummaryItems = [
  {
    number: "01",
    title: "Binary Tree Structure",
    description:
      "A binary tree organizes data through nodes and relationships, with each node having at most two children.",
  },
  {
    number: "02",
    title: "Binary Search Tree Rules",
    description:
      "A Binary Search Tree organizes values so smaller values go to the left and larger values go to the right.",
  },
  {
    number: "03",
    title: "AVL Trees",
    description:
      "An AVL tree is a self-balancing BST that uses a balance factor to maintain height balance.",
  },
  {
    number: "04",
    title: "Tree Traversal",
    description:
      "Traversal defines the order in which nodes are visited when processing a tree.",
  },
  {
    number: "05",
    title: "Traversal Algorithms",
    description:
      "Preorder, inorder, postorder, and level order traversal each follow a different strategy for visiting nodes.",
  },
];
