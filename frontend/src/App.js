import React, {useEffect} from 'react'
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from './Pages/HomePage/HomePage';
import ChatPage from './Pages/ChatsPage/ChatPage';
import {useDispatch, useSelector} from 'react-redux'
import { loadUser } from './Actions/userAction';

function App() {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((state) => state.user);

  useEffect(() => {
      dispatch(loadUser());
    }, [dispatch]);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path = "/" element = {isAuthenticated ? <ChatPage/> : <HomePage/>}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
