import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import React from 'react';
import { useRef } from "react";
import { nanoid } from "nanoid";
import { GroceryPanel } from './GroceryPanel';

// lab 13 - 14

function Modal(props)
{
  if(!props.isOpen) {
    return null;
  }

  const innerModalRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (innerModalRef.current && !innerModalRef.current.contains(e.target)) {
      props.onCloseRequested(); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center"
      onClick={handleOverlayClick}
      >
      <div 
      className="bg-white p-6 rounded-lg shadow-lg relative"
      ref={innerModalRef}
      >
        <h1 className="text-lg font-bold">{props.headerLabel}</h1>
        <button 
          onClick={props.onCloseRequested} 
          aria-label="Close" 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >X
        </button>        
        {props.children}
      </div>
    </div>
  );
}

function CloseRequestHandle()
{

}

// lab 11 - 12

function AddTaskForm(props)
{
  const [name, setName] = React.useState("");
  function handleChange(event)
  {
    setName(event.target.value);
  }

  function handleButtonClicked(event) {
    props.onNewTask(name); // onNewTask is from props
    setName("");
  }

  return (          
  <div className="flex gap-2"> {/* Unfortunately comments in JSX have to be done like this */}
      <input placeholder="New task name" className="p-2 border border-gray-1000 rounded-lg" onChange={handleChange} value={name}/>
      <button className="bg-blue-600 text-white px-2 py-0 rounded" onClick={handleButtonClicked}>
      Add task</button>
  </div>);
}

function TodoItems(props) {
  return (
    <li className="p-2">
      <label htmlFor={props.id}>
          <input type="checkbox"
          onChange={() => props.toggleTaskCompleted(props.id)}/> {props.name}
      </label>
      <button id={props.id}><FontAwesomeIcon icon={faTrashCan} className="text-gray-500 mx-8" title="Delete"
      onClick={()=>props.deleteTask(props.id)}/></button>
  </li>
  );
}

function App(props) {
  const [taskList, setTaskList] = React.useState(props.tasks); // Might have to import react

  function toggleTaskCompleted(id) {
    const updatedTasks = taskList?.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTaskList(updatedTasks);
  }

  function deleteTask(id)
  {
    const updatedTasks = taskList.filter(a=>a.id !==id);
    setTaskList(updatedTasks)
  }

  const taskListC = taskList?.map((task) => (
    <TodoItems
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
    />
  ));

  function addTask(name) {
    const newTask = {id: `todo-${nanoid()}`, name: name, completed: false};
    setTaskList([...taskList, newTask])
  }

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
      <main className="m-4"> {/* Tailwind: margin level 4 on all sides */}
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            New Task
          </button>
          <Modal
            headerLabel="New Task"
            isOpen={isModalOpen}
            onCloseRequested={()=>setIsModalOpen(false)}>
            <AddTaskForm onNewTask={addTask}/>
          </Modal>
          <section>
              <h1 className="text-xl font-bold">To do</h1>
              <ul
              role="list"
              className="todo-list stack-large stack-exception"
              aria-labelledby="list-heading">
              {taskListC}
            </ul>
          </section>
          <GroceryPanel onAddTodo={addTask}/>
      </main>
  );
}

export default App;