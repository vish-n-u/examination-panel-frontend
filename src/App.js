import logo from './logo.svg';
import './App.css';
import { Navigate,Link} from "react-router-dom";
import { useEffect } from 'react';
import { userDetail } from './urls';
import { useNavigate } from 'react-router-dom';


function App() {
  let user = JSON.parse(localStorage.getItem('user'));
  const Navigate = useNavigate()
  useEffect(()=>{
    getUserDetail()
  },[])
  console.log("came")
  useEffect(()=>{
    console.log("user",user)
    if(user&&user.authorized){
      Navigate(`/${user.userType}/${user._id}`)
    }
  })
  
  return (
  <div className="w-screen h-screen ">
    <div className="h-1/6 bg-white flex justify-end mr-5 items-center">
    <Link to="login" className="m-4 font-medium bg-purple-600 px-6 h-9 rounded-md text-white align-middle flex items-center" >
      Login
    </Link>
    <Link to="/register" 
    onClick={()=>{ 
  console.log("clicked here")
  }}
    className="m-4 font-medium bg-purple-600 px-6 h-9 rounded-md text-white flex items-center">
      Signup
    </Link>

    </div>
    <div className='w-screen flex justify-center'>
    <h1 className='text-2xl font-bold'>Welcome!{user?.userName}</h1>
    </div>
   {user&&
   <div className='flex justify-center flex-col w-[100%] items-center'>
   <h1 className='font-semibold text-xl'>{user.userName}</h1>
   {!user.authorized&&<h1>You are not yet authorized to access content!</h1>}
   </div>
   }
  </div>)
}




async function getUserDetail(){
  if(!localStorage.getItem("user")) return
  console.log(localStorage.getItem("user"),"-----")
  let userJSON = localStorage.getItem("user")
  console.log(userJSON,"user",userJSON.token)
  let user = JSON.parse(userJSON)
  try{
    let updateUser = await fetch(userDetail,{
      method:"POST",
      mode:"cors",
      headers:{"content-type": "application/json"},
      body:JSON.stringify({token:user.token})
    })
    let updateUserJson = await updateUser.json()
    
   if(updateUserJson.authorized){
    updateUserJson.token = user.token 
    localStorage.setItem("user", updateUserJson)
   }
  }
  catch(e) {
    console.log(e)
    return
  }
}

export default App;
