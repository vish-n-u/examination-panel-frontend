import React, { useEffect, useState } from 'react'
import { fetchAllQuestionPaperByTeacherUrl } from '../../urls'
import { faShare, faSheetPlastic } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const user = JSON.parse(localStorage.getItem("user2"))||JSON.parse(localStorage.getItem("user"))

const QpSection = ({setIsShareOrAnsSelected,allQuestionPaper,setAllQuestionPaper,currentlySelectedQpId,setCurrentlyClickedQpId,isShareOrAnsSelected}) => {
  const [isLoading,setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null);
  useEffect(()=>{
    setIsLoading(true)
     getAllQuestionPaperOfUser(setAllQuestionPaper,setIsLoading)
  },[])
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  return (
    <div className='h-96 w-full max-w-[65%]  overflow-auto flex flex-col  items-center'>
      {
        !isLoading? (allQuestionPaper.length>0?
        allQuestionPaper.map((qp)=>{
          return <div key={qp._id} onClick={()=>setCurrentlyClickedQpId(qp._id)} className={`flex p-4 rounded-md justify-between bg-purple-300 hover:bg-purple-500 m-2 w-[50%] items-center ${currentlySelectedQpId==qp._id ? "border-white bg-purple-500 border-3":"none"} `}> 
          <h1 className='text-xl'>{qp.name}</h1>
          
        
          <div className='flex justify-end'>
          <FontAwesomeIcon onClick={()=>setIsShareOrAnsSelected("share")} icon={faShare} size='xl' className={`mx-2 p-2 cursor-pointer  ${currentlySelectedQpId==qp._id && isShareOrAnsSelected=="share"? "bg-white":"none" }`}/>
          <FontAwesomeIcon onClick={()=>setIsShareOrAnsSelected("ans")} icon={faSheetPlastic} size='xl' className={`mx-2 p-2 cursor-pointer  ${currentlySelectedQpId==qp._id && isShareOrAnsSelected=="ans"? "bg-white ":"none" }`}/>
          </div>
          </div>
        })
        :<h1>You've not yet posted a Question Paper.</h1>)
        :<h1>
          Loading...
        </h1>

      }
      
    </div>
  )
}


async function getAllQuestionPaperOfUser(setAllQuestionPaper,setIsLoading){
  try{
    console.log("called this")
    let questionPapers = await fetch(fetchAllQuestionPaperByTeacherUrl,{
      method:"POST",
      mode:"cors",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({
        token:user.token
      })
    })
    let questionpaperJson = await questionPapers.json()
    console.log(questionpaperJson,questionPapers)
    setIsLoading(false)
    if(questionPapers.status==200){
      setAllQuestionPaper(questionpaperJson.message.questionPaperIds)
    }
    else if(questionPapers.status==400){
      alert("You are not authorized to make this request")
      return 
    }
    else{
      alert("internal server error")
    }
  }
  catch(err){
    console.log(err)
    return alert("internal server error")
  }
}
export default QpSection