import React from 'react';
import {BrowserRouter as Router , Route , Routes} from 'react-router-dom';
import Home from "./Home";
import DeleteAccount from "./DeleteAccount";
import Policy from './Policy';
import Dashboard from './Dashboard';
import logo from './logo.svg';
import './main.css';

function App() {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/delete-account' element={<DeleteAccount />}></Route>
            <Route path='/privacy-policy' element={<Policy />}></Route>
            <Route path='/dashboard' element={<Dashboard />}></Route>
        </Routes>
    </Router>
  );
}

export default App;
