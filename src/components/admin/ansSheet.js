import { faDownload, faSheetPlastic } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { allUserDetailsUrl, assignQpToStudentsUrl, fetchAllStudentsUrl, getAllAnswerSheetByQPIdUrl } from '../../urls'
import ResultPaper from '../student/resultSheet'
import ResultSheetPDF from '../resultSheetPdf'

const user = JSON.parse(localStorage.getItem("user2"))||JSON.parse(localStorage.getItem("user"))

const AnsSheetForStudent = ({allQuestionPaper,setAllQuestionPaper,currentlySelectedQpId,setCurrentlyClickedQpId}) => {

const [allAnswerSheetsOfAQuestion,setAllAnswerSheetsOfAQuestion] = useState([])
const [selectedAnswerSheet,setSelectedAnswerSheet] = useState("")
const [downLoadId,setdownLoadId] = useState("")
// const [selectedUsers,setSelectedUsers] = useState([])
  useEffect(() => {
    

    getAnswerSheetBasedOnQpId(currentlySelectedQpId,setAllAnswerSheetsOfAQuestion)
  },[currentlySelectedQpId])

  return (
    
    <div className='flex flex-col items-center w-[80%] mx-2'>
    <div className='h-96 w-full  bg-white overflow-auto flex flex-col  items-center'>
      {
        
        allAnswerSheetsOfAQuestion?.length>0?allAnswerSheetsOfAQuestion.map((answerSheet)=>answerSheet.studentId.userType=="student"&&<div  key={answerSheet._id} className='flex p-4 rounded-md justify-between bg-purple-300 m-2 w-[50%] items-center'> 
         <h1 className='text-xl'>{answerSheet.studentId.userName}</h1>
         <div className='flex justify-end'>
         <FontAwesomeIcon icon={faSheetPlastic} onClick={()=>{
           if(!currentlySelectedQpId){
            alert("select a Question paper")
          return}
          setSelectedAnswerSheet(answerSheet._id)
       
        }} size='xl' className='mx-2 p-2 cursor-pointer'/>
         <FontAwesomeIcon  icon={faDownload} onClick={()=>{
          if(!currentlySelectedQpId){
            alert("select a Question paper")
          return}
          setSelectedAnswerSheet(answerSheet._id)
        setdownLoadId(answerSheet._id)}}  className='mx-2 p-2 cursor-pointer'/>
        
         </div>
       
         </div>
        ):
        <h1>No one submitted the answer sheets!</h1>
      }
      {selectedAnswerSheet && <div className='fixed top-5 left-5 w-[90%] h-[90%] bg-white z-10 shadow-lg shadow-black'>
        
       {!downLoadId ?<ResultPaper questionPaper={currentQuestionPaper(currentlySelectedQpId,allQuestionPaper)} answerSheet={returncurrentlySelectedAnswerSheet(selectedAnswerSheet,allAnswerSheetsOfAQuestion)} setSelectedQPId={setSelectedAnswerSheet}/>
                    : <ResultSheetPDF  questionPaper={currentQuestionPaper(currentlySelectedQpId,allQuestionPaper)} answerSheet={returncurrentlySelectedAnswerSheet(selectedAnswerSheet,allAnswerSheetsOfAQuestion)} setdownLoadId={setdownLoadId} setSelectedQPId={setSelectedAnswerSheet}/>
      }

      </div>
}
    </div>
    </div>
  
  )
  
}


async function getAnswerSheetBasedOnQpId(qpId,setAllAnswerSheetsOfAQuestion)
  {
    
    if(!qpId) return
    try{
      let assignQpToStudents = await fetch(getAllAnswerSheetByQPIdUrl+qpId,{
        method:"POST",
        mode:"cors",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({
          token:user.token
        })
      })
      let assignQpToStudentsJson = await assignQpToStudents.json()
      if(assignQpToStudents.status==200){
        console.log("answerSheets recieved",assignQpToStudentsJson.message)
        setAllAnswerSheetsOfAQuestion(assignQpToStudentsJson.message)
        console.log(assignQpToStudents,assignQpToStudentsJson)
      }
      else{
        return alert("Errorr,retry")
      }
    }
    catch (err) {
      console.error("Error:", err);
      // alert("Internal serv err")
  }
}
function currentQuestionPaper(qpId,allQuestionPaper){
  let qp 
  allQuestionPaper.map((questionPaper)=>{
    if(questionPaper._id == qpId)
    qp = questionPaper
  })
  console.log("1pqp",qp)
  return qp
}


function returncurrentlySelectedAnswerSheet(answerSheetId,allAnswerSheets){
  let answerSheets
  allAnswerSheets.map((answerSheet)=>{
    if(answerSheet._id === answerSheetId) answerSheets=answerSheet;
  })
  return answerSheets
}


export default AnsSheetForStudent