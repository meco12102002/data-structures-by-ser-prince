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
        keywords={[
          "learn data structures",
          "learn algorithms",
          "interactive DSA lessons",
          "computer science lessons",
          "data structures visualization",
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Data Structures with Ser Prince",
          url: "https://data-structures-by-ser-prince.vercel.app/",
          description:
            "Interactive data structures and algorithms lessons for students.",
        }}
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
