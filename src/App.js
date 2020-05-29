import React from 'react';
import { Router, Route, NavLink } from 'react-router-dom';
import { createHashHistory } from 'history';
import './App.css';

import Home from './pages/home';
import About from './pages/about';
const customHistory = createHashHistory();
// 入口app
const App = () => {
  return (
    <Router history={customHistory}>
      <header className="header">
        <NavLink to="/">首页</NavLink>
        未更新
      </header>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </div>
    </Router>
  );
};

export default App;