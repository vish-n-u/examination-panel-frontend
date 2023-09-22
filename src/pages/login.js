import React, { useState } from "react";
import { loginUrl } from "../urls";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/userSlice";

const Login = () => {
  const navigate = useNavigate()
  const Dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [err,setErr] = useState({})
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle login logic here
    handleLogin(formData,setFormData,err,setErr,navigate,Dispatch)
    console.log(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Log In
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${err.email&&"border-red-500"}`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${err.password&&"border-red-500"}`}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


async function handleLogin(formData,setFormData,err,setErr,navigate,Dispatch){
  console.log("formData",formData);
  setErr({})
  try{
 

      let loginUser = await fetch(loginUrl,{
          method: "POST",
          headers:{"Content-Type": "application/json",},
          mode:"cors",
          body: JSON.stringify({
            
              password:formData.password,
              email:formData.email,
             
          })
      })
      let loginUserJson =await loginUser.json()
      console.log("loginUserJson==",loginUserJson)
      if(loginUser.status==400){
          if(loginUserJson.message.email){
              setFormData({...formData,email:""})
              setErr({...err,email:"Incorrect email!"})
              return 
          }
          else{
            setFormData({...formData,password:""})
              setErr({...err,password:"Incorrect password!"})
          }
      }
      if(loginUser.status==500){
        //  Toast("Successful","success")
          return
      }
      if(loginUser.status===200){
          // show toast
        localStorage.setItem("user",JSON.stringify(loginUserJson.message))
          navigate("/")
          window.location.reload()
          return
      }

  
}
catch(err){
  console.log(err)
  // toast
  return
}

}

export default Login;