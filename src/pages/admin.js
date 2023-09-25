import React, { useEffect, useState } from 'react'
import { allUserDetails, allUserDetailsUrl, authenticateUSer, authenticateUser, authenticateUserUrl, authorizeAdminUrl } from '../urls'
import SearchBar from '../components/searchBar'
import { useNavigate } from 'react-router-dom'
import QpSectionForAdmin from '../components/admin/questionPaperByTeacher'
import StudentDataForAdmin from '../components/admin/studentPapers'
const user = JSON.parse(localStorage.getItem('user') )
const user1 = JSON.parse(localStorage.getItem('user2'))

const Admin = () => {
    const [allUserData,setAllUserData] = useState([])
    const [allUnAuthorizedTeacher,setAllUnAuthorizedTeacher] = useState([])
    const [allUnAuthorizedStudent,setAllUnAuthorizedStudent] = useState([])
    const [allFilteredTeachers,setAllFilteredTeachers] = useState([])
    const [allFilteredStudents,setAllFilteredStudents] = useState([])
    const [updateAllData,setUpdateData] = useState(true)
    const navigate = useNavigate()
    const [currentlySelectedTeacherId, setCurrentlySelectedTeacherId] = useState(''); // State to store the selected option

  // Function to handle the change event when an option is selected
  

    useEffect(()=>{
      if(!updateAllData) return
      
        getAllUsersData(setAllUserData,setAllUnAuthorizedTeacher,setAllUnAuthorizedStudent,setAllFilteredTeachers,
            setAllFilteredStudents )
            setUpdateData(false)
    },[updateAllData])
    
  return (
    <div className='w-screen h-auto min-h-screen  items-center flex flex-col'>
       <div className='flex justify-between w-full'>
    <h1 className='text-xl font-semibold py-2 '>Welcome {user.userName}</h1>
    <button onClick={()=>{
            localStorage.removeItem("user")
            localStorage.removeItem("user2")
            navigate("/")
        }}  className="m-4 font-medium bg-purple-600 px-6 h-9 rounded-md text-white align-middle flex items-center">Logout</button>
    </div>
      
        <h1 className='text-xl font-semibold py-2 my-3'>UnAuthorized Users</h1>
        <div className='flex w-full my-8 h-96 justify-around'>
        <div className='w-[45%]  bg-slate-200 overflow-auto rounded-md p-4'>
          {
            allUnAuthorizedTeacher.length>0?allUnAuthorizedTeacher.map((userDetail)=>{
                    return <div key={userDetail._id}  className='my-3 py-2 p-4 bg-purple-400 hover:bg-purple-500 w-[40%] rounded-md text-lg font-semibold'
                    onClick={()=>{
                      console.log("useDateap",userDetail)
                      /* eslint-disable no-restricted-globals */
                    let result =confirm("Do you want to authorize this user")
                    if(result) authorizeUser(userDetail._id,setUpdateData)
                    return
                    /* eslint-enable no-restricted-globals */
                  }
            }>
                    {userDetail.userName}
                    </div>
            }):
            "No unauthorized teachers"
          }
        </div>
        <div className='w-[45%] overflow-auto  bg-slate-200 rounded-md p-4'>
          {
            allUnAuthorizedStudent.length>0?allUnAuthorizedStudent.map((userDetail)=>{
                return <div key={userDetail._id} className='my-3 text-lg font-semibold py-2 p-4 bg-purple-400 hover:bg-purple-500 w-[40%] rounded-md' onClick={()=>{
                  console.log("useDateap",userDetail)
                  /* eslint-disable no-restricted-globals */
                let result =confirm("Do you want to authorize this user")
                if(result){
                  authorizeUser(userDetail._id,setUpdateData)
                }
                /* eslint-enable no-restricted-globals */}}>
                  {userDetail.userName}
                </div>
            }):
            "No unauthorized student found"
          }
        </div>
        </div>
        <h1 className='my-8 text-lg font-semibold'>All Authorized user</h1>
       
        <div className='flex w-full my-8 m-2 ml-10  justify-around flex-col'>
        <h1 className='ml-5 p-2 text-2xl font-bold'>Teachers</h1>
          <div className='flex w-full'>
          
        <div className='w-[25%] mb-8   bg-slate-200 overflow-auto rounded-md p-4 flex flex-col '>
          <SearchBar setUsers={setAllFilteredTeachers} allUsers={allUserData} userType={"teacher"}/>
          {
         allFilteredTeachers.length>0?   allFilteredTeachers.map((teacher)=>{
              return <div key={teacher._id} className={`${user1?._id==teacher._id?"bg-purple-600":""} my-3 py-2 p-4 bg-purple-400 hover:bg-purple-500 w-[40%] rounded-md`} onClick={()=>{
                setCurrentlySelectedTeacherId(teacher._id)
                authorizeAdmin(teacher._id,navigate)}}>
                {teacher.userName}
              </div>
            }):
            <h1>No Teacher found.</h1>
          }
        </div>
       {user1?.userType=="teacher"&& <QpSectionForAdmin/>}
        </div>
        <h1 className='ml-5 p-2 text-2xl font-bold'>Students</h1>
        <div className="flex w-screen">
        <div className='w-[35%] bg-slate-200 overflow-auto rounded-md p-4 flex flex-col'>
        <SearchBar setUsers={setAllFilteredStudents} allUsers={allUserData} userType={"student"}/>
          {
        allFilteredStudents.length>0?    allFilteredStudents.map((users)=>{
              return <div key={users._id} className={`${user1?._id==user._id?"bg-purple-600":"bg-purple-400"} my-3 py-2 p-4  hover:bg-purple-500 w-[40%] rounded-md`} onClick={()=>authorizeAdmin(users._id,navigate)}>
                {users.userName}
              </div>
            }) :
            <h1>No student found</h1>
          }
       
        </div>
        {user1?.userType==="student" &&<StudentDataForAdmin/>}
        </div>


        </div>
   </div>
  )
}

async function getAllUsersData(setAllUserData,setAllUnAuthorizedTeacher,setAllUnAuthorizedStudent,setAllFilteredTeachers,setAllFilteredStudents )
{
  try{
  let userDetail = JSON.parse(localStorage.getItem("user"))
  console.log(userDetail,)
    let allUserDetails = await fetch(allUserDetailsUrl,{
      method:"POST",
      mode:"cors",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({token:userDetail.token})
    })
    let allUserDetailsJson = await allUserDetails.json()
    setAllUserData(allUserDetailsJson.message)
    if(allUserDetails.status!==200) return 
    let allAuthorizedStudent = []
    let allAuthorizedTeacher = []
    let allUnAuthorizedTeacher = []
    let allUnAuthorizedStudent = []
    allUserDetailsJson.message.map((userDetail)=>{
      if(userDetail.authorized){
        if(userDetail.userType === "student"){
          allAuthorizedStudent.push(userDetail)
        }
        else if(userDetail.userType === "teacher"){
          allAuthorizedTeacher.push(userDetail)
        }
      }
      else{
        if(userDetail.userType === "student"){
          allUnAuthorizedStudent.push(userDetail)
        }
        else if(userDetail.userType === "teacher"){
          allUnAuthorizedTeacher.push(userDetail)
        }
      }
    })

    setAllFilteredStudents(allAuthorizedStudent)
    setAllFilteredTeachers(allAuthorizedTeacher)
    setAllUnAuthorizedStudent(allUnAuthorizedStudent)
    setAllUnAuthorizedTeacher(allUnAuthorizedTeacher)
  }
  catch(err){
    console.log(err)
  }

    
}

async function authorizeUser(objectId,setUpdateData){
  console.log("objectId",objectId)
  let userDetail = JSON.parse(localStorage.getItem("user"))
  try{
    let aunthenticateUser = await fetch(authenticateUserUrl+objectId,{
      method:"PUT",
      mode:"cors",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({token:userDetail.token})
    })
    if(aunthenticateUser.status!==200){
      console.log("here 3")
      return
    }
    else{
      console.log("success")
      alert("user Successfully authenticated")
      setUpdateData(true)
    }
  }
  catch(err){
    return
  }
}

async function authorizeAdmin(userId,navigate){
  try{
    let aunthenticateAdminAndGetUser= await fetch(authorizeAdminUrl,{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({token:user.token,userId})
    })
    if(aunthenticateAdminAndGetUser.status!==200){
      console.log("here 3")
      return
    }
    else{
      let aunthenticateAdminAndGetUserJson = await aunthenticateAdminAndGetUser.json()
      localStorage.setItem("user2",JSON.stringify(aunthenticateAdminAndGetUserJson.message))
      // navigate(`/${aunthenticateAdminAndGetUserJson.message.userType}/${aunthenticateAdminAndGetUserJson.message._id}`)
      window.location.reload();
    }
  }
  catch(err){
    return
  }
}

export default Admin