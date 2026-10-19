import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Home from "./pages/Home";
import Learning from "./pages/Learning";
import BinaryTreeLesson from "./pages/BinaryTreeLesson";
import HeapLesson from "./pages/HeapLesson";
const HashingLesson = lazy(() => import("./pages/HashingLesson"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/learn/hashing-sets-and-maps"
          element={
            <Suspense
              fallback={
                <main role="status" style={{ padding: "3rem" }}>
                  Loading lesson…
                </main>
              }
            >
              <HashingLesson />
            </Suspense>
          }
        />
        <Route path="/" element={<Home />} />

        <Route
          path="/learn"
          element={<Learning />}
        />

        <Route
          path="/learn/binary-trees"
          element={<BinaryTreeLesson />}
        />

        <Route
          path="/learn/heaps-and-priority-queues"
          element={<HeapLesson />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
