import React from "react";
import Background from "./Components/Background";
import Navbar from "./Components/Navbar";
import Manager from "./Components/Manager";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import About from "./Components/About";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";


function App() {
  return (
    <>

      <Navbar />
      <Background />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vault" element={<Manager />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
