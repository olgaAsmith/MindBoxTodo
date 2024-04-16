import './App.css';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Todo {
  id: string;
  text: string;
  isDone: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [uncompleted, setUncompleted] = useState(0);
  const [inputError, setInputError] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all');

  const filteredTodos = () => {
    switch (filter) {
      case 'completed':
        return todos.filter((todo) => todo.isDone);
      case 'active':
        return todos.filter((todo) => !todo.isDone);
      default:
        return todos;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue) {
      setTodos([...todos, { id: uuidv4(), text: inputValue, isDone: false }]);
      setInputValue('');
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const handleCheckboxChange = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isDone: !todo.isDone,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  useEffect(() => {
    const unfinishedTasks = todos.filter((todo) => !todo.isDone);
    setUncompleted(unfinishedTasks.length);
  }, [todos]);

  const handleClearCompleted = () => {
    const clearTodos = todos.map((todo) => ({
      ...todo,
      isDone: false,
    }));
    setTodos(clearTodos);
  };

  return (
    <div className='page'>
      <h1>Todo List</h1>
      <form className='add-form' onSubmit={handleSubmit}>
        <div className='add-form__input-area'>
          <input
            className={`add-form__input ${
              inputError ? 'add-form__input--error' : ''
            }`}
            type='text'
            value={inputValue}
            onChange={handleChange}
            required
          />
          {inputError ? (
            <span className='add-form__input-area-error'>
              Введите название задачи
            </span>
          ) : (
            ''
          )}
        </div>
        <button className='add-form__button'>Add Todo Task</button>
      </form>
      <form className='checkboxes'>
        {filteredTodos().map((todo) => (
          <div className='checkboxes__area' key={todo.id}>
            <input
              className='checkboxes__input'
              id={todo.id}
              type='checkbox'
              checked={todo.isDone}
              onChange={() => handleCheckboxChange(todo.id)}
            />
            <label
              className={`checkboxes__label ${
                todo.isDone ? 'checkboxes__label--checked' : ''
              }`}
              htmlFor={todo.id}
            >
              {todo.text}
            </label>
          </div>
        ))}
      </form>

      <div className='statistics'>
        <span>{uncompleted} items left</span>
        <ul className='statisctics__list'>
          <li
            className={`statisctics__item ${
              filter === 'all' ? 'statisctics__item--active' : ''
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </li>
          <li
            className={`statisctics__item ${
              filter === 'active' ? 'statisctics__item--active' : ''
            }`}
            onClick={() => setFilter('active')}
          >
            Active
          </li>
          <li
            className={`statisctics__item ${
              filter === 'completed' ? 'statisctics__item--active' : ''
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </li>
        </ul>
        <button className='statisctics__button' onClick={handleClearCompleted}>
          Clear completed
        </button>
      </div>
    </div>
  );
}
export default App;
