import React from 'react';
import './App.css';
import Form from "./components/Form";
import TodoApp from "./components/TodoApp";

function App() {
  return (
    <div className="App">
        <Form/>
        <hr/>
        <TodoApp/>
    </div>
  );
}

export default App;
