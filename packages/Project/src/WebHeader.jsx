import React, { useState, useEffect } from "react";

function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setIsDarkMode(savedMode === "true");
    } else {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDarkMode);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDarkMode]);

  return (
    <div className="p-4">
      <button
        onClick={() => setIsDarkMode((prevMode) => !prevMode)}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Toggle Dark Mode
      </button>
    </div>
  );
}

function WebHeader() {
  return (
    <header>
      <DarkModeToggle></DarkModeToggle>
      <div className="container m-0 p-0 flex justify-space-between items-center">
        <nav>
          <ul className="flex flex-wrap flex-col">
            <li className="headerButton"><a href="#" className="block hover:underline">InstaDice</a></li>
            <li className="headerButton"><a href="#" className="block hover:underline">Roll</a></li>
            <li className="headerButton"><a href="#" className="block hover:underline">Make</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default WebHeader;
