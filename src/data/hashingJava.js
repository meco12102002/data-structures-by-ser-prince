// Authored handout traces: no Java is evaluated in the browser.
// Unordered printouts show one valid order, with alternatives for verification.
function program({
  type,
  generic,
  name,
  className,
  title,
  pages,
  useMapInterface = false,
  statements,
}) {
  const lines = [
    ...(useMapInterface ? ["import java.util.Map;"] : []),
    `import java.util.${type};`,
    "",
    `public class ${className} {`,
    "  public static void main(String[] args) {",
    `    ${useMapInterface ? "Map" : type}<${generic}> ${name} = new ${type}<>();`,
  ];
  let items = [];
  let console = [];
  const allowedOutputs = [];
  const frames = [
    {
      line: 0,
      items: [],
      console: [],
      explanation: `Import ${useMapInterface ? `the Map interface and ${type} implementation` : type} from java.util.`,
    },
    {
      line: lines.length - 1,
      items: [],
      console: [],
      explanation: `Create an empty ${type}${useMapInterface ? " using a Map interface variable" : ""}.`,
    },
  ];
  for (const statement of statements) {
    const line = lines.length;
    lines.push(...statement.code.split("\n").map((code) => `    ${code}`));
    if (statement.skip) continue;
    if (statement.items) items = statement.items;
    if (statement.output !== undefined) {
      const alternatives = Array.isArray(statement.output)
        ? statement.output
        : [statement.output];
      console = [...console, alternatives[0]];
      allowedOutputs.push(alternatives);
    }
    frames.push({
      line,
      items,
      console: [...console],
      explanation: statement.explanation,
    });
  }
  lines.push("  }", "}");
  return {
    type,
    className,
    title,
    pages,
    lines,
    frames,
    allowedOutputs,
    unordered: type === "HashMap" || type === "HashSet",
  };
}

const fruits = [
  { key: "apple", value: "10" },
  { key: "banana", value: "20" },
  { key: "grape", value: "30" },
];
const student = [
  { key: "name", value: "Kimmy" },
  { key: "course", value: "BSIT" },
];
const sortedProducts = [
  { key: "apple", value: "10" },
  { key: "banana", value: "20" },
  { key: "grape", value: "30" },
];
const arrivalProducts = [
  sortedProducts[1],
  sortedProducts[0],
  sortedProducts[2],
];

export const javaPrograms = [
  program({
    type: "HashMap",
    generic: "String, Integer",
    name: "hashTable",
    className: "HashTableExample",
    title: "Hash table · fruit counts",
    pages: "2–3",
    statements: [
      {
        code: 'hashTable.put("apple", 10);',
        items: fruits.slice(0, 1),
        explanation:
          "Insert apple → 10, as in the handout’s hash-table example.",
      },
      {
        code: 'hashTable.put("banana", 20);',
        items: fruits.slice(0, 2),
        explanation: "Insert a second unique key, banana.",
      },
      {
        code: 'hashTable.put("grape", 30);',
        items: fruits,
        explanation:
          "Insert grape. Display positions show contents, not a Java iteration-order guarantee.",
      },
      {
        code: 'System.out.println("apple: " + hashTable.get("apple"));',
        output: "apple: 10",
        explanation: "Retrieve the value 10 using key apple.",
      },
      {
        code: 'System.out.println("banana: " + hashTable.get("banana"));',
        output: "banana: 20",
        explanation: "Retrieve the value 20 using key banana.",
      },
      {
        code: 'if (hashTable.containsKey("cherry")) {',
        explanation:
          'containsKey("cherry") is false. Skip the first branch and take the else branch.',
      },
      {
        code: '  System.out.println("cherry: " + hashTable.get("cherry"));',
        skip: true,
      },
      { code: "} else {", skip: true },
      {
        code: '  System.out.println("cherry not found!");',
        output: "cherry not found!",
        explanation: "The absent key is reported without changing the table.",
      },
      { code: "}", skip: true },
      {
        code: 'hashTable.remove("grape");',
        items: fruits.slice(0, 2),
        explanation: "Delete grape; apple and banana remain retrievable.",
      },
      {
        code: 'System.out.println("Hash table contents: " + hashTable);',
        output: [
          "Hash table contents: {apple=10, banana=20}",
          "Hash table contents: {banana=20, apple=10}",
        ],
        explanation:
          "Print the remaining mappings. This console shows one valid order; HashMap does not guarantee that order.",
      },
    ],
  }),
  program({
    type: "HashSet",
    generic: "String",
    name: "fruits",
    className: "HashSetExample",
    title: "HashSet · unique fruits",
    pages: "6",
    statements: [
      {
        code: 'fruits.add("Apple");',
        items: ["Apple"],
        explanation: "Add the first unique fruit.",
      },
      {
        code: 'fruits.add("Banana");',
        items: ["Apple", "Banana"],
        explanation: "Banana is distinct, so the size becomes 2.",
      },
      {
        code: 'fruits.add("Apple"); // Duplicate, ignored',
        explanation:
          "Apple is already present. The duplicate addition leaves the size unchanged.",
      },
      {
        code: "System.out.println(fruits);",
        output: ["[Apple, Banana]", "[Banana, Apple]"],
        explanation:
          "Both fruits appear once. The handout shows two possible orders; neither is guaranteed by HashSet.",
      },
    ],
  }),
  program({
    type: "TreeSet",
    generic: "Integer",
    name: "numbers",
    className: "TreeSetExample",
    title: "TreeSet · sorted numbers",
    pages: "6–7",
    statements: [
      { code: "numbers.add(50);", items: [50], explanation: "Add 50." },
      {
        code: "numbers.add(10);",
        items: [10, 50],
        explanation: "Natural integer order places 10 before 50.",
      },
      {
        code: "numbers.add(30);",
        items: [10, 30, 50],
        explanation: "30 belongs between 10 and 50.",
      },
      {
        code: "System.out.println(numbers);",
        output: "[10, 30, 50]",
        explanation:
          "TreeSet iterates in ascending natural order by default, matching the handout.",
      },
    ],
  }),
  program({
    type: "HashMap",
    generic: "String, String",
    name: "map",
    useMapInterface: true,
    className: "HashMapExample",
    title: "HashMap · student record",
    pages: "7–8",
    statements: [
      {
        code: 'map.put("name", "Kimmy");',
        items: student.slice(0, 1),
        explanation: "Associate the key name with Kimmy.",
      },
      {
        code: 'map.put("course", "BSIT");',
        items: student,
        explanation:
          "Add course → BSIT. The Map interface describes the operations; HashMap supplies the implementation.",
      },
      {
        code: 'System.out.println("HashMap contents: " + map);',
        output: [
          "HashMap contents: {course=BSIT, name=Kimmy}",
          "HashMap contents: {name=Kimmy, course=BSIT}",
        ],
        explanation:
          "Print both mappings. The handout’s order is one possible output, not a guarantee.",
      },
      {
        code: 'String studentName = map.get("name");',
        explanation:
          "Read Kimmy into the studentName variable. Reading does not remove the mapping.",
      },
      {
        code: "System.out.println(\"Retrieved value for 'name': \" + studentName);",
        output: "Retrieved value for 'name': Kimmy",
        explanation: "Print the retrieved name, Kimmy.",
      },
      {
        code: 'if (map.containsKey("course")) {',
        explanation:
          "course is present, so this condition is true and its branch runs.",
      },
      {
        code: '  System.out.println("\'course\' key exists with value: " + map.get("course"));',
        output: "'course' key exists with value: BSIT",
        explanation: "Retrieve and print BSIT after checking membership.",
      },
      { code: "}", skip: true },
      {
        code: 'map.remove("course");',
        items: student.slice(0, 1),
        explanation: "Delete the course mapping while retaining name → Kimmy.",
      },
      {
        code: "System.out.println(\"HashMap after removing 'course': \" + map);",
        output: "HashMap after removing 'course': {name=Kimmy}",
        explanation: "Only the name mapping remains.",
      },
    ],
  }),
  program({
    type: "TreeMap",
    generic: "String, Integer",
    name: "treeMap",
    useMapInterface: true,
    className: "TreeMapExample",
    title: "TreeMap · sorted product keys",
    pages: "8–9",
    statements: [
      {
        code: 'treeMap.put("banana", 20);',
        items: [sortedProducts[1]],
        explanation: "Insert banana → 20.",
      },
      {
        code: 'treeMap.put("apple", 10);',
        items: sortedProducts.slice(0, 2),
        explanation: "TreeMap sorts keys, so apple appears before banana.",
      },
      {
        code: 'treeMap.put("grape", 30);',
        items: sortedProducts,
        explanation: "grape follows banana in natural string order.",
      },
      {
        code: 'System.out.println("TreeMap contents: " + treeMap);',
        output: "TreeMap contents: {apple=10, banana=20, grape=30}",
        explanation:
          "Keys print in sorted order regardless of their insertion order.",
      },
    ],
  }),
  program({
    type: "LinkedHashMap",
    generic: "String, Integer",
    name: "linkedMap",
    useMapInterface: true,
    className: "LinkedHashMapExample",
    title: "LinkedHashMap · arrival order",
    pages: "9",
    statements: [
      {
        code: 'linkedMap.put("banana", 20);',
        items: arrivalProducts.slice(0, 1),
        explanation: "banana arrives first.",
      },
      {
        code: 'linkedMap.put("apple", 10);',
        items: arrivalProducts.slice(0, 2),
        explanation: "apple follows banana in insertion order.",
      },
      {
        code: 'linkedMap.put("grape", 30);',
        items: arrivalProducts,
        explanation: "grape arrives third.",
      },
      {
        code: 'System.out.println("LinkedHashMap contents: " + linkedMap);',
        output: "LinkedHashMap contents: {banana=20, apple=10, grape=30}",
        explanation:
          "A linked list records insertion order while hashing supports keyed access. The output matches the handout.",
      },
    ],
  }),
];
