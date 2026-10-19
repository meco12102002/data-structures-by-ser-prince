import {
  hashingEncryptionComparison,
  hashingEncryptionQuestions,
  hashingRealLifeExamples,
} from "../../../data/hashingLesson";
import { PracticeQuestion } from "./LessonUI";

export default function HashingApplications() {
  return (
    <div className="hash-concept">
      <span className="section-label">HASHING BEYOND THE CLASSROOM</span>
      <div className="hash-panel lesson-panel hash-concept">
        <h3>Where is hashing used in real life?</h3>
        <p>
          The same broad idea—turning input into a hash value—serves different
          purposes. Hash tables focus on locating data; cryptographic hashes
          focus on secure verification.
        </p>
        <div className="hash-grid-two">
          {hashingRealLifeExamples.map((example) => (
            <article className="hash-panel lesson-panel" key={example.title}>
              <span className="section-label">{example.type}</span>
              <h3>{example.title}</h3>
              <p>{example.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="hash-panel lesson-panel hash-concept">
        <h3>Hashing vs Encryption</h3>
        <p>
          Do you need to check a match, or recover the original message? This
          comparison uses <strong>cryptographic hashing</strong>.
        </p>
        <div
          className="hash-table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Hashing versus encryption comparison"
        >
          <table>
            <caption>Different tools for different jobs</caption>
            <thead>
              <tr>
                <th scope="col">Question</th>
                <th scope="col">Cryptographic hashing</th>
                <th scope="col">Encryption</th>
              </tr>
            </thead>
            <tbody>
              {hashingEncryptionComparison.map(
                ([label, hashing, encryption]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>{hashing}</td>
                    <td>{encryption}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        <div
          className="hash-summary-flow"
          role="group"
          aria-label="Hashing flow"
        >
          <span>INPUT</span>
          <b aria-hidden="true">→</b>
          <span>HASH</span>
          <b aria-hidden="true">→</b>
          <span>DIGEST · COMPARE TO VERIFY</span>
        </div>
        <div
          className="hash-summary-flow"
          role="group"
          aria-label="Encryption flow"
        >
          <span>MESSAGE</span>
          <b aria-hidden="true">→</b>
          <span>ENCRYPT</span>
          <b aria-hidden="true">→</b>
          <span>CIPHERTEXT</span>
          <b aria-hidden="true">→</b>
          <span>DECRYPT WITH KEY</span>
          <b aria-hidden="true">→</b>
          <span>MESSAGE</span>
        </div>
        <p>
          A hash is not encrypted text. Weak inputs can still be guessed and
          checked against a digest. The fast bucket calculation in this lesson
          is for organizing data; it does not provide cryptographic protection.
        </p>
        <p className="hash-small hash-reference-links">
          Further reading:{" "}
          <a
            href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#hashing-vs-encryption"
            target="_blank"
            rel="noreferrer"
          >
            OWASP · Hashing vs Encryption ↗
          </a>{" "}
          and{" "}
          <a
            href="https://cheatsheetseries.owasp.org/cheatsheets/Security_Terminology_Cheat_Sheet.html"
            target="_blank"
            rel="noreferrer"
          >
            Security Terminology ↗
          </a>
          .
        </p>
        {hashingEncryptionQuestions.map((question) => (
          <PracticeQuestion key={question.prompt} question={question} />
        ))}
      </div>
    </div>
  );
}
