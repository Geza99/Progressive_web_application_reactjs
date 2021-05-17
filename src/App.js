import React, { useState, useEffect } from 'react';
import './App.css';
import Summary from './Summary.js';
import logo from './logo.svg';
import { saveToDoList, getTodoList, syncTodos, installPwa, onServiceWorkerMessage, onPwaInstallAvailable } from './util';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import * as vanillaNotifications from './notification.js';


function App() {

  const [newTodoText, setNewTodoText] = useState('');
  const [todos, setTodos] = useState(getTodoList());
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  function saveTodos(list) {
    setTodos(list);
    saveToDoList(list);
  }

  function addToDo() {
    saveTodos([...todos,
    { id: Math.random(), text: newTodoText, done: false }
    ]);
  };

  function removeTodo(index) {
    if (index === -1) {
      return;
    }

    saveTodos(
      [...todos.slice(0, index), ...todos.slice(index + 1)]
    );
  };

  const todoChecked = async (index) => {
    const todo = todos[index];
    todo.done = !todo.done;
    saveTodos(
      [...todos.slice(0, index), todo, ...todos.slice(index + 1)]
    );

    if (todo.done) {
      await vanillaNotifications.displayNotification(todo);
    }

  };

  useEffect(() => {
    console.log('effect tirggered');
    const interval = setInterval(() => {
      syncTodos(() => {
        const now = new Date();
        setLastSyncTime(now);
      });
    }, 60000);

    onPwaInstallAvailable(() => {
      setShowInstallButton(true);
    });

    onServiceWorkerMessage((msg) => {
      console.log(msg);
      const deleteId = msg.data.deleteId;
      if (deleteId) {
        const index = todos.findIndex(x => x.id === deleteId);
        console.log('Service worker message to delete todo. Data:', deleteId, todos, index);

        removeTodo(index);
      }
    });

    return function cleanup() {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [todos]);


  const todoItems = todos.map((todo, index) => {
    return (
      <li key={todo.id}>
        <label>
          <input checked={todo.done} onChange={() => todoChecked(index)} type="checkbox" />
          <span>{todo.text}</span>
          <button onClick={() => removeTodo(index)}>Remove</button>
        </label>
      </li>
    );
  });

  return (
    <Router>
      <Switch>
        <Route path="/summary">
          <Summary></Summary>
        </Route>

        <Route path="/">
          <nav>
            <h3>Service worker PWA demo</h3>
            <img src={logo} alt="logo" />
          </nav>
          <main>
            {showInstallButton &&
              <div>
                <button id="install-button" className="pretty-button" onClick={installPwa}>Install app</button>
              </div>
            }

            {lastSyncTime &&
              <p id="last-sync">Last sync: {lastSyncTime.toISOString()}</p>
            }

            <input id="new-todo-input"
              value={newTodoText}
              onChange={e => setNewTodoText(e.target.value)} type="text" />
            <button className="pretty-button" onClick={addToDo}>Add to list</button>
            <ul id="todo-list">
              {todoItems}
            </ul>
          </main>
        </Route>
      </Switch>
    </Router>
  );
}


export default App;
