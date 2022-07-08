import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { Notes } from './components';

import './App.scss';

function App() {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route exact path='/' element ={<Notes/>}/>
          <Route path='/list/' element ={<Notes/>}/>
          <Route path='/list/:listId' element ={<Notes/>}/>
        </Routes>
      </Router>
    </div>
    
  );
}

export default App;
