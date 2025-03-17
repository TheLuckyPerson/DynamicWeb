import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import WebHeader from './WebHeader';
import DiceMenu from './DiceMenu';
import ProjectHeader from './ProjectHeader';
import About from "./About";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from './auth/LoginPage';
import { RegisterPage } from './auth/RegisterPage';
import { useDiceFetching } from './dices/useDiceFetching';

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const { isLoading, fetchedDices } = useDiceFetching("", authToken as string);

  return (
    <Router>
      <ProjectHeader authToken={authToken as string}
        setAuthToken={setAuthToken as React.Dispatch<React.SetStateAction<string>>}></ProjectHeader>
      <Routes>
        <Route path="/" element={
          <DiceMenu
            authToken={authToken as string}
            fetchedDices={fetchedDices} 
            isLoading={isLoading}/>} />
        <Route path="/Project" element={
          <DiceMenu
            authToken={authToken as string}
            fetchedDices={fetchedDices} 
            isLoading={isLoading}/>} />
        <Route path="/about" element={<About />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage setAuthToken={setAuthToken} />} />      </Routes>

      {/* <About></About>
      <div className="flex justify-center items-start h-auto mt-4">
        <DiceMenu />
      </div> */}
    </Router>
  );
}

export default App;