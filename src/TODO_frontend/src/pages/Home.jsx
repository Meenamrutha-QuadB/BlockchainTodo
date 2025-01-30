import { motion } from 'framer-motion';
import { FiCheck, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { BiBlock, BiLock, BiCube } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { TODO_backend } from 'declarations/TODO_backend';


function Home() {
  const [todos, setTodos] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    getall_tasks();
    localStorage.removeItem("UpdateId");
  }, []);

  async function getall_tasks() {
    var result= await TODO_backend.get_task();
    console.log("all tasks", result);
    setTodos(result);
    
  }

  const deleteTodo = async(todo) => {
    var deleted = await TODO_backend.delete_task_by_id(BigInt(todo.todo_id));
    console.log("deleted", deleted);
    await getall_tasks();
    toast.error('Todo deleted!');
  };

  const toggleTodo = async (todo) => {
    console.log(todo.status);
    if(todo.status == true){
      toast.success("you already completed this task")
    }else{
      const update= await TODO_backend.completed_task(BigInt(todo.todo_id));
      console.log("updated", update);
        await getall_tasks();
       toast.success('Todo status updated!');
    }
   
  };

  function updatefun(todo){
    if(todo.status == true){
      toast.warning("you already completed this task")
    }
    else{
      localStorage.setItem("UpdateId",todo.todo_id);
      navigate('/add')
    }
    
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="hero">
        <div className="container">
          <motion.h1
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            Decentralized Todo Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Secure, transparent, and immutable todo tracking powered by blockchain technology
          </motion.p>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Blockchain Features</h2>
          <div className="features-grid">
            <motion.div
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BiBlock className="feature-icon" />
              <h3>Immutable Records</h3>
              <p>Every todo is permanently recorded and cannot be tampered with</p>
            </motion.div>
            <motion.div
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BiLock className="feature-icon" />
              <h3>Secure Storage</h3>
              <p>Your todos are encrypted and stored securely</p>
            </motion.div>
            <motion.div
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BiCube className="feature-icon" />
              <h3>Distributed System</h3>
              <p>Todos are distributed across the network for reliability</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="todo-section">
        <div className="container">
          <div className="todo-list">
            {todos.map(todo => (
              <motion.div
                key={Number(todo.id).toString()}
                className="todo-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <h3 className="todo-title" style={{ 
                  textDecoration: todo.status ? 'line-through' : 'none' 
                }}>
                  {todo.title}
                </h3>
                <p className="todo-description">{todo.description}</p>
                <div className="todo-actions">
                  <button 
                    className="action-button"
                    onClick={() => toggleTodo(todo)}
                  >
                    <FiCheck />
                  </button>
                  <button 
                    className="action-button"
                    // onClick={() => navigate(`/add?edit=${todo}`)}
                    onClick={()=> updatefun(todo) }
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => deleteTodo(todo)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default Home;