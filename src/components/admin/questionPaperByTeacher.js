import React, { useEffect, useState } from 'react'
import { fetchAllQuestionPaperByTeacherUrl } from '../../urls'
import { faShare, faSheetPlastic } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AnsSheetForStudent from './ansSheet'


const user = JSON.parse(localStorage.getItem("user2"))||JSON.parse(localStorage.getItem("user"))

const QpSectionForAdmin = () => {
  const [isLoading,setIsLoading] = useState(false)
  const [allQuestionPaper,setAllQuestionPaper] =useState([])
  const [currentlySelectedQpId,setCurrentlyClickedQpId] = useState("")
  useEffect(()=>{
    setIsLoading(true)
     getAllQuestionPaperOfUser(setAllQuestionPaper,setIsLoading)
  },[])
  
  return (
    <div className='w-full flex h-96'>
    <div className='h-96 w-full max-w-[45%]  overflow-auto flex flex-col  items-center'>
      {
        !isLoading? (allQuestionPaper.length>0?
        allQuestionPaper.map((qp)=>{
          return <div key={qp._id} onClick={()=>setCurrentlyClickedQpId(qp._id)} className={`flex p-4 rounded-md justify-between bg-purple-300 hover:bg-purple-500 m-2 w-[50%] items-center ${currentlySelectedQpId==qp._id ? "border-white bg-purple-500 border-3":"none"} `}> 
          <h1 className='text-xl'>{qp.name}</h1>
          
        
          <FontAwesomeIcon  icon={faSheetPlastic} size='xl' className={`mx-2 p-2 cursor-pointer  ${currentlySelectedQpId==qp._id ? "bg-white ":"none" }`}/>
        
          </div>
        })
        :<h1>You've not yet posted a Question Paper.</h1>)
        :<h1>
          Loading...
        </h1>

      }
      
    </div>
    <AnsSheetForStudent allQuestionPaper={allQuestionPaper} currentlySelectedQpId={currentlySelectedQpId}/>
    </div>
  )
}


async function getAllQuestionPaperOfUser(setAllQuestionPaper,setIsLoading){
  try{
    
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

export default QpSectionForAdmin