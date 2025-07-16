import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Import your components (you would have these as separate files)
import HLAWebsite from "./hla-architecture-website.jsx"; // Your main homepage component
import HLAProjectsPage from "./hla-projects-page.jsx"; // Your projects page component
import Test from "./api/test.js";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HLAWebsite />} />
        <Route path="/projects" element={<HLAProjectsPage />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;
