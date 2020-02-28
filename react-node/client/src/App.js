import React , {Component, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar'
import Background from './components/Background'
import Sidebar from './components/Sidebar'
import {
  BrowserRouter as Router,
  Route
} from  'react-router-dom'
import Employees from './components/Employees'
import Home from './components/Home'
import EmployeeDetails from './components/EmployeeDetails'


function App() {

  const routes = [
    {
      path:'/',
      exact:true,
      main:() =><Home/>
    },
    {
      path:'/getEmployees',
      exact:true,
      main:() =><Employees/>
    },
    {
      path:'employeeDetails',
      exact:true,
      main:() =><EmployeeDetails/>
    },
    {
      path:'/test',
      exact:true,
      main:() =><h1> Test Page</h1>
    },

  ]
  const [isOpened, setIsOpened] = useState(false);
  return (
        <>
        <Router>
        <div style ={{flex:1, padding :'90px'}}>

        {routes.map((route, index)=> (
        
        <Route 
          key={index}
          path={route.path}
          exact={route.exact}
          component={route.main}
          />
          ))}

        </div>

        </Router>
   <Background setIsOpened = {setIsOpened} show={isOpened}/>
    <Navbar toggleMenu={setIsOpened}/>
    <Sidebar show ={isOpened} setIsOpened={setIsOpened}/>
   </>
  )
}

export default App;
