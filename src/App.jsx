import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Learning from "./pages/Learning";
import BinaryTreeLesson from "./pages/BinaryTreeLesson";
import HeapLesson from "./pages/HeapLesson";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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
