import React, { useEffect, useState } from 'react'
import AnswerPaper from "../student/answerPaper"
import { useNavigate } from 'react-router-dom'
import ResultSheetPDF from "../resultSheetPdf"
import StudentQuesPaper from '../student/questionPapers'
import {getStudentQuestionPapersUrl} from "../../urls"
import ResultPaper from '../student/resultSheet'


let user = JSON.parse(localStorage.getItem("user2"))?JSON.parse(localStorage.getItem("user2")):JSON.parse(localStorage.getItem("user"))
    



const StudentDataForAdmin = () => {
    const [allQuestionPaper,setAllQuestionPaper] = useState([])
    const [isLoading,setIsLoading]  = useState(false)
    const [selectedQPId,setSelectedQPId] = useState("")
    const [allUserData,setAllUserData] = useState([])
    const [downLoadId, setdownLoadId] = useState("")
    const navigate = useNavigate()
    console.log("downLoadId",downLoadId)
    useEffect(()=>{
        // if(!selectedQPId) return
        setIsLoading(true)
        getAllQuestionPaper(setAllQuestionPaper,setIsLoading,setAllUserData)
    },[selectedQPId])
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
    
    return(
                <div className='w-full'>
                <div className='flex w-full align-middle items-center bg-white h-[80%]'>
                
                <StudentQuesPaper allQuestionPaper={allQuestionPaper} isLoading={isLoading} setSelectedQPId={setSelectedQPId} allUserDetail={allUserData} setdownLoadId={setdownLoadId}/>
            </div>

            {selectedQPId&&
            <div className='fixed top-2 left-10 h-[95%] w-[95%] shadow-lg shadow-black z-10 bg-white'>

                {!answerPaper?<AnswerPaper questions={selectedQuestionPaper.questionPaper} setSelectedQPId={setSelectedQPId} selectedQpId={selectedQPId}/>:
                
                !downLoadId&&  <ResultPaper setSelectedQPId={setSelectedQPId} questionPaper={selectedQuestionPaper} answerSheet={answerPaper}/>
            
                }
            {downLoadId&& <ResultSheetPDF questionPaper={selectedQuestionPaper} answerSheet={answerPaper} setdownLoadId={setdownLoadId} setSelectedQPId={setSelectedQPId}/>}

            
            </div>

}
    
    
</div>)
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


export default StudentDataForAdmin