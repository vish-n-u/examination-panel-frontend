import React, { useEffect, useState } from 'react'
import { faCheck, faDownload, faShare, faSheetPlastic } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const user = JSON.parse(localStorage.getItem("user2"))||JSON.parse(localStorage.getItem("user"))

const StudentQuesPaper = ({allQuestionPaper,isLoading,setSelectedQPId,allUserDetail,downLoadId, setdownLoadId}) => {
  


  return (
    <div className='h-96 w-[65%]  bg-white overflow-auto flex flex-col  items-center'>
    <h1 className='text-xl font-semibold py-2 my-3'>{user.userName} Papers</h1>
    <div className='overflow-auto w-full h-full flex flex-col  items-center'>
      {
       !isLoading?  (allQuestionPaper.length>0&&
        allQuestionPaper.map((qp)=>{
          return <div key={qp._id}  className={`flex p-4 rounded-md justify-between bg-purple-400 m-2 w-[50%] items-center `}> 
          <h1 className='text-xl'>{qp.name}</h1>
          <div className='flex justify-end'>
         {!checkIfAnswerSheetContainsQuesPaperId(qp._id,allUserDetail)? (checkDateIsGreater(qp.examDate)?<h1>Upcoming</h1>:<FontAwesomeIcon  onClick={()=>setSelectedQPId(qp._id)} icon={faSheetPlastic} size='xl' className='mx-2 p-2 cursor-pointer'/>)
        :
        <>
        <FontAwesomeIcon icon={faCheck} onClick={()=>setSelectedQPId(qp._id)} size='xl' className='mx-2 p-2 cursor-pointer'/> 
        <FontAwesomeIcon onClick={()=>{setSelectedQPId(qp._id)
          setdownLoadId(qp._id)}} icon={faDownload}  className='mx-2 p-2 cursor-pointer'/>
        </>
        }
          </div>
          </div>
        })
         )
         :<h1>Loading...</h1>
        

      }
        </div>
      
    </div>
  )
}

function checkIfAnswerSheetContainsQuesPaperId(id,allUserData){
  console.log("All",allUserData,id)
  for(let x =0;x<allUserData?.answerSheetIds?.length;x++){
    if(allUserData.answerSheetIds[x].questionPaperId==id) {
      console.log("All","true")
      return true}
  }
  return false

}


function checkDateIsGreater(date){
  console.log("reached here")
  let newDate = new Date(date)
  let today = new Date()
  console.log(newDate,today,newDate.getTime(),today.getTime())
  if(newDate.getTime()>today.getTime()) return true
  return false
}
export default StudentQuesPaper