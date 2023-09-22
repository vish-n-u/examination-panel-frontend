import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

import { registerUrl } from "../urls";

const Register = () => {
const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "student", // Default user type
  });

  const [err,setErr] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e)=>{
            e.preventDefault()
            handleSubmit(formData,setFormData,err,setErr,navigate)}}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
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
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${err.email&&"border-red-400"}`}
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
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="userType" className="sr-only">
                User Type
              </label>
              <select
                id="userType"
                name="userType"
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


async function handleSubmit(formData,setFormData,err,setErr,navigate){
    console.log("formData",formData);
    setErr({})
    try{
   

        let registerUser = await fetch(registerUrl,{
            method: "POST",
            headers:{"Content-Type": "application/json",},
            mode:"cors",
            body: JSON.stringify({
                userName:formData.username,
                password:formData.password,
                email:formData.email,
                userType:formData.userType 
            })
        })
        let registerUserJson =await registerUser.json()
        console.log("registerUserJson==",registerUserJson)
        if(registerUser.status==400){
            if(registerUserJson.message.email){
                setFormData({...formData,email:""})
                setErr({...err,email:"Email already exists!"})
                
                return 
            }
        }
        if(registerUser.status==500){
            // show a toast
            return
        }
        if(registerUser.status===201){
            // show toast
            localStorage.setItem("user",JSON.stringify(registerUserJson.message))
            navigate("/")
            return
        }

    
}
catch(err){
    console.log(err)
    // toast
    return
}

}

export default Register;
