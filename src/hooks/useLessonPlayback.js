import { createContext, useContext, useEffect, useState } from "react";

export const LessonActiveContext = createContext(true);

export function useLessonPlayback(initialFrames) {
  const active = useContext(LessonActiveContext);
  const [state, setState] = useState({
    frames: initialFrames,
    step: 0,
    playing: false,
    speed: 1000,
  });
  const last = state.frames.length - 1;
  useEffect(() => {
    if (!active || !state.playing || state.step >= last) return;
    const timer = setTimeout(
      () =>
        setState((current) => {
          const step = Math.min(current.step + 1, current.frames.length - 1);
          return {
            ...current,
            step,
            playing: step < current.frames.length - 1,
          };
        }),
      state.speed,
    );
    return () => clearTimeout(timer);
  }, [active, state.playing, state.step, state.speed, state.frames, last]);
  return {
    frame: state.frames[state.step],
    step: state.step,
    last,
    playing: active && state.playing && state.step < last,
    speed: state.speed,
    replace: (frames, autoplay = false) =>
      setState((current) => ({
        ...current,
        frames,
        step: 0,
        playing:
          autoplay &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      })),
    play: () =>
      setState((current) => ({
        ...current,
        step: current.step >= last ? 0 : current.step,
        playing: true,
      })),
    pause: () => setState((current) => ({ ...current, playing: false })),
    next: () =>
      setState((current) => ({
        ...current,
        playing: false,
        step: Math.min(current.step + 1, last),
      })),
    previous: () =>
      setState((current) => ({
        ...current,
        playing: false,
        step: Math.max(0, current.step - 1),
      })),
    restart: () =>
      setState((current) => ({ ...current, playing: false, step: 0 })),
    setSpeed: (speed) =>
      setState((current) => ({ ...current, speed: Number(speed) })),
  };
}
