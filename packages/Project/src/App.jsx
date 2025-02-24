import ReactDOM from 'react-dom'
import React from 'react';
import WebHeader from './WebHeader';
import DiceMenu from './DiceMenu';
import ProjectHeader from './ProjectHeader';
import About from "./About";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App(props) {

  return (
    <Router>
      <ProjectHeader></ProjectHeader>
      <Routes>
        <Route path="/" element={<DiceMenu />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {/* <About></About>
      <div className="flex justify-center items-start h-auto mt-4">
        <DiceMenu />
      </div> */}
    </Router>
  );
}

export default App;