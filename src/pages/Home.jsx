import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import LearningFeatures from "../components/home/LearningFeatures";
import About from "../components/home/About";
import Footer from "../components/layout/Footer";

function Home() {
  return (
    <div className="app">
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