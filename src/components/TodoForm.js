
export default function TodoForm(props) {
  return (
    <div className="todo-form">
      <h1>Todo List</h1>

      <div className="form-items">
        <input className="form-input"
          type="text"
          placeholder="To Do"
          value={props.newTodo}
          onChange={props.textInput}
          // onKeyDown={props.enterPress}
        ></input>
        <button className="form-btn" 
          onClick={props.addClick}
        >Add</button>
      </div>
    </div>
  );
}
