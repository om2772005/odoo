import SelectLogin from "./Pages/SelectLogin"
import { Routes, Route } from "react-router-dom";
import UserLoginPage from "./Pages/userlogin";
import UserRegisterPage from "./Pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserDashboard from "./Pages/Userdashboard";
import AgentLoginPage from "./Pages/Agentlogin";

import AgentDashboard from "./Pages/Agentdashboard";
import AdminLogin from "./Pages/Adminlogin";
import AdminDashboard from "./Pages/Admindashboard";
const App = ()=>{
  return(
    <>
    <Routes>
      <Route path='/' element = {<SelectLogin/>}/>
      <Route path='/user' element = {<UserLoginPage/>}/> 
      <Route path='/userregister' element={<UserRegisterPage/>}/>
      <Route path='userdashboard' element={<UserDashboard/>}/>
       <Route path='/agentlogin' element={<AgentLoginPage />}/>
      <Route path='/agentdashboard' element={<AgentDashboard/>}/>
      <Route path='/adminlogin' element={<AdminLogin/>}/>
      <Route path='/admindashboard' element={<AdminDashboard/>}/>
     
    

    </Routes>
    <ToastContainer position="top-center" autoClose={3000} />
    </>
  )
}
export default App;