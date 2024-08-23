import React from 'react';
import {BrowserRouter as Router , Route , Routes} from 'react-router-dom';
import Home from "./Home";
import DeleteAccount from "./DeleteAccount";
import logo from './logo.svg';
import './main.css';

function App() {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/delete-account' element={<DeleteAccount />}></Route>
        </Routes>
    </Router>
  );
}

export default App;
