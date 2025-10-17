import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateUser from './pages/CreateUser';
import EditUser from './pages/EditUser';
import Navbar from './components/Navbar';

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/'; // show navbar on all pages except home

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/create-user' element={<CreateUser/>}/>
        <Route path='/edit-user/:id' element={<EditUser/>}/>
        {/* Add other routes here */}
      </Routes>
    </>
  );
}

export default App;
