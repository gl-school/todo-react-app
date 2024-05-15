
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useReducer } from 'react';
import TodoForm from './TodoForm';

const initialState = {
  todoItems: [], 
  newTodo: '',
  editIndex: '',
  editedTodo: '',
};

const types = {
  CREATE: 'create',
  ADD: 'add',
  DELETE: 'delete',
  EDIT: 'edit',
  SET_EDIT: 'setEdit',
  SAVE_EDIT: 'saveEdit',
  LOAD: 'load'
}


/*
Action.type, defined in the types object
Payload, variables and such

*/
function reducer(state, action) {
  switch (action.type) {
    case 'create':
      return createTodo(state, action.payload);
    case 'add':
      return addTodo(state, action.payload);
    case 'delete':
      return deleteTodo(state, action.payload);
    case 'edit':
      return setEditIndex(state, action.payload);
    case 'setEdit':
      return setEdit(state, action.payload);
    case 'saveEdit':
      return saveEdit(state);
    case 'load':
      return loadTodos(state, action.payload);
    default:
      console.warn('Attention');
      return state;
  }
}

/*
...state is the full original array of todoItems
Most of these functions return the array + new/edited entries.

*/

function addTodo(state) {
  if (state.newTodo !== '') {
    const newTodoItems = [...state.todoItems, { id: state.newTodo, date: createDateObject()}];
    localStorage.setItem('todoStorage', JSON.stringify(newTodoItems));
    return { ...state, todoItems: newTodoItems, newTodo: '' };
  }
  return state;
}

function createTodo(state, payload) {
  return { ...state, newTodo: payload };
}

function setEditIndex(state, payload) {
  return { ...state, editIndex: payload, editedTodo: state.todoItems[payload].id };
}

function setEdit(state, payload) {
  return { ...state, editedTodo: payload };
}

function saveEdit(state) {
  const updatedTodoItems = [...state.todoItems];
  updatedTodoItems[state.editIndex].id = state.editedTodo;
  localStorage.setItem('todoStorage', JSON.stringify(updatedTodoItems));
  return { ...state, todoItems: updatedTodoItems, editIndex: "" };
}

function deleteTodo(state, index) {
  const filteredTodoItems = state.todoItems.filter((event, i) => i !== index);
  localStorage.setItem('todoStorage', JSON.stringify(filteredTodoItems));
  return { ...state, todoItems: filteredTodoItems };
}

function loadTodos(state, todoItems) {
  return { ...state, todoItems };
}

//Create and Return a Date Object in D/M/Y format
function createDateObject(){
  let date =  new Date().toLocaleDateString();
  return date;
}

export default function TodoList() {
  /*
  Dispatch is a function that update state
  Calls the function reducer.
  The "action" from func reducer is the task/function we want completed
  State is the state of whatever we want to manipulate.
  */
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todoItems, newTodo, editIndex, editedTodo } = state;


  //Retriving Local Storage
  useEffect(() => {
    const storedTodos= JSON.parse(localStorage.getItem('todoStorage'));
    if (storedTodos) {
      dispatch({ type: types.LOAD, payload: storedTodos });
      }
    }, []);


  //types: types.WHATEVER is the case for the reducer function
  //Payload are all the variables and such we need.
  //In this case the text input.
  // So action and variables
  function textInput(event) {
    dispatch({ type: types.CREATE, payload: event.target.value });
  };

  function addClick() {
    dispatch({ type: types.ADD });
  };

  //To Do
  // function enterPress(event) {
  //   console.log(event);
  //   dispatch({ type: types.ADD });
  // };

  function editTodoEntry(index) {
    dispatch({ type: types.EDIT, payload: index });
  };

  function saveEdit() {
    dispatch({ type: types.SAVE_EDIT });
  };

  function deleteTodoEntry(index) {
    dispatch({ type: types.DELETE, payload: index });
  };


  return (
    <div>
      <TodoForm
        newTodo={newTodo}
        textInput={textInput}
        addClick={addClick}
       ></TodoForm>

      <ul>
        {todoItems.map((todoObject, index) => (
          <li key={index}>
            {/* Conditional Rendering of the edit box 
                If the edit index is the same as the current index, show the edit box
                Otherwise show the normal todo box
                Much help from GPT
            */}
            {editIndex === index ? (
              <div>
                <input className='input-edit'
                  type="text"
                  value={editedTodo}
                  onChange={(event) => dispatch({ type: types.SET_EDIT, payload: event.target.value })}
                ></input>
                <button className='save' 
                  onClick={saveEdit}
                  >Save
                </button>
              </div>
            ) : (

              //To Do Entry
              <div className='todo-box'>
                <input type="checkbox"></input>
                <div className='todo-text'>
                  <h2>{todoObject.id}</h2>
                  <p>{todoObject.date}</p>
                </div>
                <div className='todo-icons'>
                  <button className='edit' 
                    onClick={() => editTodoEntry(index)}>
                    <FontAwesomeIcon className="icon edit" icon={faPen}></FontAwesomeIcon> 
                  </button>
                  <button className='trash' 
                     onClick={() => deleteTodoEntry(index)}>
                    <FontAwesomeIcon className="icon trash" icon={faTrash}></FontAwesomeIcon> 
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


