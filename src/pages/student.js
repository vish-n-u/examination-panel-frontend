import React, { useEffect, useState } from 'react'
import StudentQuesPaper from '../components/student/questionPapers'
import { getStudentQuestionPapersUrl } from '../urls'
import AnswerPaper from '../components/student/answerPaper'
import ResultPaper from '../components/student/resultSheet'
import { useNavigate } from 'react-router-dom'
import ResultSheetPDF from '../components/resultSheetPdf'

let user = JSON.parse(localStorage.getItem("user2"))?JSON.parse(localStorage.getItem("user2")):JSON.parse(localStorage.getItem("user"))
    

const Student = () => {
    const [allQuestionPaper,setAllQuestionPaper] = useState([])
    const [isLoading,setIsLoading]  = useState(false)
    const [selectedQPId,setSelectedQPId] = useState("")
    const [allUserData,setAllUserData] = useState([])
    const [downLoadId, setdownLoadId] = useState("")
    const navigate = useNavigate()
    console.log("downLoadId",downLoadId)
    useEffect(()=>{
        setIsLoading(true)
        getAllQuestionPaper(setAllQuestionPaper,setIsLoading,setAllUserData)
    },[])
   
    let selectedQuestionPaper 
    let answerPaper 
if(allQuestionPaper.length>0){
    allQuestionPaper.map((qp)=>{
        if(qp._id == selectedQPId) selectedQuestionPaper =qp
        
    })
}
answerPaper =undefined
   
       for (let x =0;x<allUserData?.answerSheetIds?.length;x++){

        if(allUserData.answerSheetIds[x].questionPaperId==selectedQPId) {
          answerPaper = allUserData.answerSheetIds[x]
        break}
       }
    

    
  return (
    <div className='w-screen h-screen flex flex-col  p-4'>
        <div className='flex justify-between w-full'>
    <h1 className='text-xl font-semibold py-2 '>Welcome {user.userName}</h1>
    <button onClick={()=>{
            localStorage.removeItem("user")
            navigate("/")
        }}  className="m-4 font-medium bg-purple-600 px-6 h-9 rounded-md text-white align-middle flex items-center">Logout</button>
    </div>
    <div className='flex flex-col  w-full items-end pr-8'>
       
      <h1 className='text-xl font-semibold py-2 '>{user.userName}</h1>
      <h1 className='text-xl font-semibold '>{user.email}</h1>
    </div>
    <div className='flex w-screen align-middle items-center bg-white h-[80%]'>
    
        <StudentQuesPaper allQuestionPaper={allQuestionPaper} isLoading={isLoading} setSelectedQPId={setSelectedQPId} allUserDetail={allUserData} setdownLoadId={setdownLoadId}/>
    </div>
    
    {selectedQPId&&
    <div className='absolute top-2 left-10 h-[95%] w-[95%] shadow-lg shadow-black z-10 bg-white'>
    
        {!answerPaper?<AnswerPaper questions={selectedQuestionPaper.questionPaper} setSelectedQPId={setSelectedQPId} selectedQpId={selectedQPId}/>:
        
        !downLoadId&&  <ResultPaper setSelectedQPId={setSelectedQPId} questionPaper={selectedQuestionPaper} answerSheet={answerPaper}/>
       
        }
     {downLoadId&& <ResultSheetPDF questionPaper={selectedQuestionPaper} answerSheet={answerPaper} setdownLoadId={setdownLoadId} setSelectedQPId={setSelectedQPId}/>}

       
    </div>
  
    }
        
        
    </div>
    )
}
async function getAllQuestionPaper(setAllQuestionPaper,setIsLoading,setAllUserData){
    try{
        let allQuestionPaper = await fetch(getStudentQuestionPapersUrl,{
            method:"POST",
            mode:"cors",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify({
                token:user.token,
            })
        })
        let allQuestionPaperJson =await allQuestionPaper.json()
        setIsLoading(false)
        if(allQuestionPaper.status===200){
            setAllUserData(allQuestionPaperJson.message)
             setAllQuestionPaper(allQuestionPaperJson.message.questionPaperIds)
             console.log("allQuestionPaperJson.message",allQuestionPaperJson.message.questionPaperIds)
            
             return

        }
    }
    catch(err){
        console.log(err)
        // return alert("INternal err")
    }
}
export default Student