import { useState } from "react";

function InfoPopover({ title = "Why?", children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="info-popover"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="info-popover-trigger"
        aria-label={title}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        !
      </button>

      {isOpen && (
        <div className="info-popover-panel" role="dialog" aria-label={title}>
          <button
            type="button"
            className="info-popover-close"
            aria-label="Close explanation"
            onClick={() => setIsOpen(false)}
          >
            x
          </button>

          <strong>{title}</strong>
          <p>{children}</p>
        </div>
      )}
    </div>
  );
}

export default InfoPopover;
