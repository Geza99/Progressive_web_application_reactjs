import React from 'react';
import { getTodoList } from './util';
import { Link } from "react-router-dom";
import './Summary.css';

export default function Summary() {
    const todoItems = getTodoList()
        .filter(todo => !todo.done)
        .map((todo) => {
            return (
                <li key={todo.id}>
                    <span>{todo.text}</span>
                </li>
            );
        });

    return (
        <div className="main-container">
            <h3>Your unfinished tasks:</h3>
            <ul>
                {todoItems}
            </ul>
            <Link to="/">Edit your tasks</Link>
        </div>
    );
}
