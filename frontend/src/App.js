import React from 'react';
import {BrowserRouter as Router , Route , Routes} from 'react-router-dom';
import Home from "./Home";
import logo from './logo.svg';
import './main.css';

function App() {
  return (
    <Router>
        <Routes>
            <Route path='/' element={<Home />}></Route>
        </Routes>
    </Router>
  );
}

export default App;
