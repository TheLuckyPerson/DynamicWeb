import ReactDOM from 'react-dom'
import React from 'react';
import WebHeader from './WebHeader';
import DiceMenu from './DiceMenu';

function App(props) {

  return (
    <main className="m-0 p-0">
      <WebHeader></WebHeader>
      <div className="flex justify-center items-start h-auto mt-4">
        <DiceMenu />
      </div>
    </main>
  );
}

export default App;