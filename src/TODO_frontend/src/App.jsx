import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import TodoForm from './pages/TodoForm';
import { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import Footer from './pages/Footer';






function App() {
  const [principal , setPrincipal] = useState("");
  const [connectbtn , setconnectbtn] = useState("")
  useEffect(() =>{
    var check = localStorage.getItem("principal");
    if(!check){
      setconnectbtn("connect");
    }else{
      setconnectbtn("logout");
    }
  })

  async function connectfun(){
    
      const authClient = await AuthClient.create();
      authClient.login({
         maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
         identityProvider: "https://identity.ic0.app/#authorize",
         onSuccess: async () => {
            const identity = await authClient.getIdentity();
            const principal = identity.getPrincipal().toText(); // Extract principal as text
            setPrincipal(principal);
            localStorage.setItem("principal", principal);

         },
      });
   

  }

  useEffect(() => {
    async function init() {
       const authClient = await AuthClient.create();
       if (await authClient.isAuthenticated()) {
          const identity = await authClient.getIdentity();
          const principal = identity.getPrincipal().toText(); // Extract principal as text
          setPrincipal(principal);
          localStorage.setItem("principal", principal);

       }
    }
    init();
 }, []);


  return (
    <Router>
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo">BlockchainTodo</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/add" className="nav-link">Add Todo</Link>
            {/* <div onClick={connectfun}> 
              {setconnectbtn ? <button>
                {connectbtn}
              </button>: <button>
              {connectbtn}
              </button>
              }  
            </div> */}
            <button className='connectbtn' onClick={connectfun}>Connect</button>

          </div>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<TodoForm />} />
        </Routes>
      </AnimatePresence>

      <Footer/>
      {/* <footer className="footer">
        <div className="container footer-content">
          <p>&copy; 2024 BlockchainTodo. All rights reserved.</p>
        </div>
      </footer> */}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;