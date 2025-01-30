import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Principal } from '@dfinity/principal';
// import { TODO_backend } from '/home/meenamrutha/QuadB/TODO/src/TODO_backend';
import { TODO_backend } from 'declarations/TODO_backend';



function TodoForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  // useEffect(() => {
  //   if ((localStorage.getItem("UpdateId"))) {
  //     // const todos = JSON.parse(localStorage.getItem('todos') || '[]');
  //     // const todoToEdit = todos.find(todo => todo.id === editId);
  //     console.log("editid",editId)
  //     if (todoToEdit) {
  //       setTitle(todoToEdit.title);
  //       setDescription(todoToEdit.description);
  //     }
  //   }
  // }, []);

async function handleSubmit() {
  

  event.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (localStorage.getItem("UpdateId")) {
      var updation = await TODO_backend.update_task(BigInt(localStorage.getItem("UpdateId")), title, description);
      console.log("updation",updation);
      toast.success('Todo updated successfully!');
    } else if(!(localStorage.getItem("UpdateId"))){
      const Todo= {
        title: title,
        description: description,
        prin: Principal.fromText(localStorage.getItem("principal") ),
    }
      console.log("before sending to backend", Todo);
      var result= await TODO_backend.set_task(title, description);
      console.log(result);
      toast.success('Todo added successfully!');
    }

    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container"
    >
      <div className="todo-form-container">
        <h2>{editId ? 'Edit Todo' : 'Add New Todo'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter todo title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              className="form-input form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter todo description"
            />
          </div>
          <motion.button
            type="submit"
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {editId ? 'Update Todo' : 'Add Todo'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}

export default TodoForm;