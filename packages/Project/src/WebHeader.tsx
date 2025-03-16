import React, { useState, useEffect } from "react";

function WebHeader() {
  return (
    <header className="">
      {/* <my-cool-header></my-cool-header> */}
      <nav>
        <ul className="flex flex-wrap flex-col">
          <li className="headerButton"><a href="#" className="block hover:underline">InstaDice</a></li>
          <li className="headerButton"><a href="#" className="block hover:underline">Roll</a></li>
          <li className="headerButton"><a href="#" className="block hover:underline">Make</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default WebHeader;
