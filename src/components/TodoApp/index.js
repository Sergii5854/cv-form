import React from "react";
import "./style.css"
import { createStore, createEvent } from 'effector'
import { useStore } from "effector-react";
// Simple stores
 const $todo = createStore("");
 const $todos = createStore([{ text: "Use Effector", completed: false }]);

// Use store.map(state => computedState)
// To create computed stores
const $todosCount = $todos.map(todos => todos.length)
const $completedTodos = $todos.map(todos => todos.filter(todo => todo.completed))

//events
// Create events
const inputChanged = createEvent('Input changed')
const todoAdded = createEvent('Todo added')
const todoRemoved = createEvent('Todo removed')
const todoToggled = createEvent('Todo toggled')
const submitPressed = createEvent("Submit pressed");
// Stores have .on method
// store.on(event, (state, payload) => newState)
$todo
    .on(inputChanged, (state, value) => value)
    .on(todoAdded, () => '')


$todo.on(inputChanged, (state, value) => value).on(todoAdded, () => "");
$todos
    .on(todoAdded, (todos, text) => [...todos, { text, completed: false }])
    .on(todoRemoved, (todos, idx) => todos.filter((_, curIdx) => curIdx !== idx))
    .on(todoToggled, (todos, idx) => {
        return todos.map((todo, curIdx) => {
            if (curIdx === idx) {
                return { ...todo, completed: !todo.completed };
            } else {
                return todo;
            }
        });
    });


//end event


// Use event.watch(payload => ...) to do something on event call
// Also works for stores: store.watch(state => ...)
// Here we call "todoAdded" when form is submit
const TodoInput = () => {
    const todo = useStore($todo);
    console.log(todo);
    return (
        <input
            value={todo}
            onChange={evt => inputChanged(evt.target.value)}
            placeholder="Type something..."
        />
    );
};
const TodoForm = () => {
    return (
        <form className="form" onSubmit={submitPressed}>
            <TodoInput />
            <button>Add</button>
        </form>
    );
};

const TodoList = () => {
    const todos = useStore($todos);

    return (
        <div className="todos">
            {todos.map((todo, idx) => (
                <div key={idx} className={`todo${todo.completed ? " -completed" : ""}`}>
                    <input
                        type="checkbox"
                        value={todo.completed}
                        onChange={() => todoToggled(idx)}
                    />
                    <span>{todo.text}</span>
                    <button onClick={() => todoRemoved(idx)}>X</button>
                </div>
            ))}
        </div>
    );
};

const TodoApp = () => {
    return (
        <>
            <TodoForm/>
            <TodoList />
        </>
    )
}
submitPressed.watch(evt => {
    evt.preventDefault()
    // Stores have .getState() method to get current state
    todoAdded($todo.getState())
})

export default TodoApp