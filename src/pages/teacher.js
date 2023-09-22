import React, { useEffect, useState } from 'react'
import QuizQuestion from '../components/quizQuestion'
import QpSection from '../components/Teacher/questionPaperSection'
import AnsSheetOrStudentSection from '../components/Teacher/ansSheetOrStudentSection'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
let user = JSON.parse(localStorage.getItem("user2"))?JSON.parse(localStorage.getItem("user2")):JSON.parse(localStorage.getItem("user"))

const Teacher = () => {
    const [isNewQpClicked,setIsNewQpClicked] = useState(false)
    const [allQuestionPaper,setAllQuestionPaper] = useState([])
    const [isShareOrAnsSelected,setIsShareOrAnsSelected] = useState("share")
    const [currentlySelectedQpId,setCurrentlyClickedQpId] = useState("")
    const navigate = useNavigate()

  
    
  return (
    <div className='w-screen h-screen flex flex-col justify-center align-middle'>
      <div className='flex justify-between w-full'>
    <h1 className='text-xl font-semibold py-2 '>Welcome {user.userName}</h1>
    <button onClick={()=>{
            localStorage.removeItem("user")
            navigate("/")
        }}  className="m-4 font-medium bg-purple-600 px-6 h-9 rounded-md text-white align-middle flex items-center">Logout</button>
    </div>
        <div  className='flex p-4 w-screen justify-between my-5'>
        <FontAwesomeIcon onClick={()=>setIsNewQpClicked(true)} icon={faFileCirclePlus} size={"2xl"} />
       
        <div className='flex flex-col p-4'>
          <h1 className='text-xl font-semibold '>{user.userName}</h1>
          <h1 className='text-xl font-semibold'>{user.email}</h1>
        </div>
        </div>
        <div className='flex w-screen justify-around bg-white h-[80%]'>
          <div className='flex flex-col w-full h-full justify-center items-center border-2 border-black'> 
            <h1>Question Papers Set by {user.userName}</h1>
        <QpSection setIsShareOrAnsSelected={setIsShareOrAnsSelected} allQuestionPaper={allQuestionPaper} setAllQuestionPaper={setAllQuestionPaper} currentlySelectedQpId={currentlySelectedQpId} setCurrentlyClickedQpId={setCurrentlyClickedQpId} isShareOrAnsSelected={isShareOrAnsSelected}/>
        </div>
        <div className='flex flex-col w-full h-full justify-center items-center'> 
        <h1>Student Section</h1>
         <AnsSheetOrStudentSection isShareOrAnsSelected={isShareOrAnsSelected} allQuestionPaper={allQuestionPaper} setAllQuestionPaper={setAllQuestionPaper} currentlySelectedQpId={currentlySelectedQpId} setCurrentlyClickedQpId={setCurrentlyClickedQpId} />
         </div>
        </div>
        {isNewQpClicked&&<QuizQuestion setIsNewQpClicked={setIsNewQpClicked} />}

    </div>
  )
}

export default Teacher