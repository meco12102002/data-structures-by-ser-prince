import SEO from "../components/SEO";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import LearningFeatures from "../components/home/LearningFeatures";
import About from "../components/home/About";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <div className="app">
      <SEO
        title="Learn Data Structures & Algorithms | Interactive DSA Learning"
        description="Learn data structures and algorithms through interactive visualizations, step-by-step lessons, and hands-on practice. Explore arrays, linked lists, stacks, queues, trees, graphs, searching, and sorting."
        path="/"
      />

      <Navbar />

      <main>
        <Hero />
        <LearningFeatures />
        <About />
      </main>

      <Footer />
    </div>
  );
}

export default Home;