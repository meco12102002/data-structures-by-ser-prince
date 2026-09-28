import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="relative z-10 w-full border-b border-border bg-background/90">
      <div className="mx-auto flex min-h-[76px] w-[min(1200px,calc(100%-48px))] items-center justify-between gap-10">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
        >
          <span className="flex size-[38px] items-center justify-center border border-accent font-mono text-[13px] font-bold tracking-normal text-accent">
            DS.
          </span>

          <span className="flex flex-col text-[10px] font-bold leading-tight tracking-[0.08em] text-[#ddd]">
            DATA STRUCTURES
            <small className="mt-1 font-mono text-[7px] font-normal tracking-[0.14em] text-accent">
              WITH SER PRINCE
            </small>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-[34px] max-[700px]:hidden">
          <Link
            to="/"
            className="relative py-7 font-mono text-[9px] tracking-[0.1em] text-[#666] transition-colors after:absolute after:bottom-[19px] after:left-0 after:h-px after:w-0 after:bg-accent after:transition-[width] hover:text-[#ddd] hover:after:w-full"
          >
            HOME
          </Link>

          <Link
            to="/learn"
            className="relative py-7 font-mono text-[9px] tracking-[0.1em] text-accent after:absolute after:bottom-[19px] after:left-0 after:h-px after:w-full after:bg-accent"
          >
            LEARN
          </Link>

          <a
            href="/#about"
            className="relative py-7 font-mono text-[9px] tracking-[0.1em] text-[#666] transition-colors after:absolute after:bottom-[19px] after:left-0 after:h-px after:w-0 after:bg-accent after:transition-[width] hover:text-[#ddd] hover:after:w-full"
          >
            ABOUT
          </a>
        </nav>

        <div className="shrink-0">
          <Link
            to="/learn"
            className="group inline-flex items-center gap-3 border border-[#303530] px-[15px] py-[11px] font-mono text-[8px] font-bold tracking-[0.08em] text-[#bbb] transition-colors hover:border-accent hover:bg-accent/5 hover:text-foreground"
          >
            START LEARNING
            <span className="text-[13px] text-accent transition-transform group-hover:translate-x-[3px]">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
