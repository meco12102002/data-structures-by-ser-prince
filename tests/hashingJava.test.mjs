import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { javaPrograms } from "../src/data/hashingJava.js";

test("handout traces highlight source statements and preserve console history", () => {
  assert.equal(javaPrograms.length, 6);
  assert.equal(
    new Set(javaPrograms.map((program) => program.className)).size,
    6,
  );
  for (const program of javaPrograms) {
    assert.equal(program.frames[0].console.length, 0);
    for (const frame of program.frames) {
      assert.ok(frame.line >= 0 && frame.line < program.lines.length);
      assert.ok(program.lines[frame.line].trim());
      assert.ok(frame.explanation);
    }
    const output = program.frames.at(-1).console;
    assert.equal(output.length, program.allowedOutputs.length);
    output.forEach((line, index) =>
      assert.ok(program.allowedOutputs[index].includes(line)),
    );
  }
  const hashTable = javaPrograms.find(
    (program) => program.className === "HashTableExample",
  );
  assert.ok(
    hashTable.frames.some((frame) => frame.explanation.includes("false")),
  );
  assert.ok(
    !hashTable.frames.some((frame) => frame.console.includes("cherry: null")),
  );
});

const compiler = spawnSync("javac", ["-version"], {
  encoding: "utf8",
  timeout: 10000,
});
const runtime = spawnSync("java", ["-version"], {
  encoding: "utf8",
  timeout: 10000,
});
for (const program of javaPrograms) {
  test(
    `${program.className} compiles and matches the handout trace`,
    {
      skip:
        compiler.status !== 0 || runtime.status !== 0
          ? "A local JDK is required for Java compilation checks."
          : false,
    },
    () => {
      const directory = mkdtempSync(join(tmpdir(), "hashing-java-test-"));
      try {
        const source = join(directory, `${program.className}.java`);
        writeFileSync(source, program.lines.join("\n"));
        const compiled = spawnSync("javac", ["-d", directory, source], {
          encoding: "utf8",
          timeout: 20000,
        });
        assert.equal(compiled.status, 0, compiled.stderr);
        const execution = spawnSync(
          "java",
          ["-cp", directory, program.className],
          { encoding: "utf8", timeout: 10000 },
        );
        assert.equal(execution.status, 0, execution.stderr);
        const output = execution.stdout.trim().split(/\r?\n/);
        assert.equal(output.length, program.allowedOutputs.length);
        output.forEach((line, index) =>
          assert.ok(
            program.allowedOutputs[index].includes(line),
            `Unexpected output: ${line}`,
          ),
        );
      } finally {
        rmSync(join(directory, `${program.className}.java`), { force: true });
        rmSync(join(directory, `${program.className}.class`), { force: true });
        rmdirSync(directory);
      }
    },
  );
}
