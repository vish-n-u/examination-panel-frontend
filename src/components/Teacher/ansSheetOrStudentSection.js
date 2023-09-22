import { faDownload, faSheetPlastic } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { allUserDetailsUrl, assignQpToStudentsUrl, fetchAllStudentsUrl, getAllAnswerSheetByQPIdUrl } from '../../urls'
import ResultPaper from '../student/resultSheet'
import ResultSheetPDF from '../resultSheetPdf'

const user = JSON.parse(localStorage.getItem("user2"))||JSON.parse(localStorage.getItem("user"))

const AnsSheetOrStudentSection = ({setIsShareOrAnsSelected,allQuestionPaper,setAllQuestionPaper,currentlySelectedQpId,setCurrentlyClickedQpId,isShareOrAnsSelected}) => {
const [allUsersDetails,setAllUsersDetails] = useState([])
const [userSelectedToShareQp,setUserSelectedToShareQp] = useState([])
const [allAnswerSheetsOfAQuestion,setAllAnswerSheetsOfAQuestion] = useState([])
const [selectedAnswerSheet,setSelectedAnswerSheet] = useState("")
const [downLoadId,setdownLoadId] = useState("")
// const [selectedUsers,setSelectedUsers] = useState([])
  useEffect(() => {
    
if(isShareOrAnsSelected=="share")getAllUsersData(setAllUsersDetails)
 else   getAnswerSheetBasedOnQpId(currentlySelectedQpId,setAllAnswerSheetsOfAQuestion,isShareOrAnsSelected)
  },[isShareOrAnsSelected,currentlySelectedQpId])

  const handleSubmit = ()=>{
    submit(currentlySelectedQpId,userSelectedToShareQp)
  }
  console.log("allAnswerSheetsOfAQuestion",allAnswerSheetsOfAQuestion)
  return (
    currentlySelectedQpId?
    <div className='flex flex-col items-center w-[80%] mx-2'>
    <div className='h-96 w-full  bg-white overflow-auto flex flex-col  items-center'>
      {
        isShareOrAnsSelected=="share"? (allUsersDetails.length>0?
          allUsersDetails.map((user)=>{
          return <div  key={user._id} className='flex p-4 rounded-md justify-between bg-purple-400 m-2 w-[50%] items-center'> 
         <input
            type="checkbox"
            className="h-6 w-6"
            disabled = {checkIfAlreadySent(user._id,currentlySelectedQpId,allQuestionPaper)}
            onChange={(e) => {
              if (e.target.checked) {
                setUserSelectedToShareQp([...userSelectedToShareQp, user._id]);
              } else {
                let index = userSelectedToShareQp.indexOf(user._id);
                if (index !== -1) {
                  let newArr = [...userSelectedToShareQp];
                  newArr.splice(index, 1); // Corrected to use splice to remove the item
                  setUserSelectedToShareQp(newArr);
                }
              }
            }}
        />
          <h1 className='text-xl'>{user.userName}</h1>
          <div className='flex justify-end'>
          </div>
          </div>
        })
        :<h1>You've not yet posted a Question Paper.</h1>
        )
        :allAnswerSheetsOfAQuestion?.length>0?allAnswerSheetsOfAQuestion.map((answerSheet)=>answerSheet.studentId.userType=="student"&&<div  key={answerSheet._id} className='flex p-4 rounded-md justify-between bg-purple-300 m-2 w-[50%] items-center'> 
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
      {selectedAnswerSheet && <div className='absolute top-5 left-5 w-[90%] h-[90%] bg-white z-10 shadow-lg shadow-black'>
        
       {!downLoadId ?<ResultPaper questionPaper={currentQuestionPaper(currentlySelectedQpId,allQuestionPaper)} answerSheet={returncurrentlySelectedAnswerSheet(selectedAnswerSheet,allAnswerSheetsOfAQuestion)} setSelectedQPId={setSelectedAnswerSheet}/>
                    : <ResultSheetPDF  questionPaper={currentQuestionPaper(currentlySelectedQpId,allQuestionPaper)} answerSheet={returncurrentlySelectedAnswerSheet(selectedAnswerSheet,allAnswerSheetsOfAQuestion)} setdownLoadId={setdownLoadId} setSelectedQPId={setSelectedAnswerSheet} />
      }

      </div>
}
    </div>
    {isShareOrAnsSelected=="share"&&<button className="m-4 font-medium bg-purple-600 px-6 h-9 rounded-md text-white align-middle flex items-center" onClick={handleSubmit}>Submit</button>}
    </div>
  :
  <h1 className='text-lg font-semibold'> Select a question PAper</h1>
  )
  
}

async function getAllUsersData(setAllUserData)
{
  try{
  // let userDetail = await JSON.parse(localStorage.getItem("user"))
  const allStudentDetails = await fetch(fetchAllStudentsUrl, {
    method: "POST",
    mode:"cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({token:user.token}),
  });

  if (!allStudentDetails.ok) {
    console.error("Failed to fetch data:", allStudentDetails.statusText);
    return;
  }

  const allUserDetailsJson = await allStudentDetails.json();

  setAllUserData(allUserDetailsJson.message);
  console.log("allUserDetails", allUserDetailsJson.message);
} catch (err) {
  console.error("Error:", err);
}
}


function checkIfAlreadySent(userId,currentlySelectedQpId,allQuestionPaper){
  if(!currentlySelectedQpId) return
  let currQp 
  allQuestionPaper.map((qp)=>{
    if(qp._id==currentlySelectedQpId){
      currQp = qp;
    }
  })
console.log(currQp,"currentQuestionPaper",allQuestionPaper)
  if(currQp.studentIds&&currQp.studentIds.includes(userId)){
    console.log("returned true")
    return true
  }
  return false
}

async function submit(qpId,studentIds,setIsShareOrAnsSelected){
  console.log("qpId,studentIds",qpId,studentIds)
  if(!qpId) return
  try{
    let assignQpToStudents = await fetch(assignQpToStudentsUrl,{
      method:"PUT",
      mode:"cors",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({
        questionPaperId:qpId,
        studentIds:studentIds,
        token:user.token
      })
    })
    if(assignQpToStudents.status==200){
      alert("Successfully assigned question paper to students")
    }
    else{
      return alert("Errorr,retry")
    }
  }
  catch (err) {
    console.error("Error:", err);
    alert("Internal serv err")
}
}


async function getAnswerSheetBasedOnQpId(qpId,setAllAnswerSheetsOfAQuestion,isShareOrAnsSelected,setIsShareOrAnsSelected)
  {
    console.log("qpId,studentIds",qpId,isShareOrAnsSelected)
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

export default AnsSheetOrStudentSection