import { useState } from "react";
import { submitQuestionUrl } from "../urls";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
let user = JSON.parse(localStorage.getItem("user2"))||JSON.parse(localStorage.getItem("user"))

const QuizQuestion = ({setIsNewQpClicked}) => {
    const [questions, setQuestions] = useState([
      { question: "", marks:5, options: ["", "", "", ""], correctAnswer: 0 },
    ]);
    const [isLoading,setIsLoading] = useState(false)
    const [name,setName] = useState("")
    const [selectedDate, setSelectedDate] = useState(null);
    const today = new Date() // get today's date
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1) 
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
    

    const handleSubmit = ()=>{
      submit(questions,setQuestions,setIsNewQpClicked,setIsLoading,name,selectedDate)
    }
  
    const handleQuestionChange = (e, questionIndex) => {
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex].question = e.target.value;
      setQuestions(updatedQuestions);
    };
  
    const handleOptionChange = (e, questionIndex, optionIndex) => {
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
      setQuestions(updatedQuestions);
    };
  
    const handleCorrectAnswerChange = (e, questionIndex) => {
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex].correctAnswer = parseInt(e.target.value, 10);
      setQuestions(updatedQuestions);
    };
    const  handleMarksChange= (e, questionIndex) =>{
        const updatedQuestion = [...questions]
        updatedQuestion[questionIndex].marks  = e.target.value
        setQuestions(updatedQuestion);
    }
  
    const addQuestion = () => {
        let isAnythingEmpty = false;
        if(!name) isAnythingEmpty = true;
        questions.forEach((obj)=>{
            if(!obj.question) isAnythingEmpty = true;
            obj.options.map((option)=>{
                if(!option) isAnythingEmpty = true
            })
        })
        if(isAnythingEmpty){
            alert("Some of your fields are  not filled")
            return
        }

      setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
      console.log(questions)
    };
  
    return (
      <div className="absolute top-5 left-10 w-[95%] h-[95%] z-10 shadow-lg shadow-black bg-slate-100 overflow-auto p-5">
        <div className="w-full flex justify-end cursor-pointer">
            <div onClick={()=>setIsNewQpClicked(false)}>
                X
            </div>
        </div>
        <div className='flex w-full justify-between'>
          
        <input className="border-2 w-[50%]" type="text" placeholder="name" value={name} onChange={(e)=>setName(e.target.value)}/>
          <div className="flex">
          <h1>Pick a Date!</h1>
          <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="yyyy-MM-dd" // Specify your desired date format
        isClearable // Add a clear button to reset the date
        minDate={today}
      />
         </div>
          </div>
        {questions.map((q, questionIndex) => (
          <div key={questionIndex} className="mb-4">
            <label className="block font-bold text-lg mb-2">Question {questionIndex + 1} {"    (select the right answer)"} </label>
             <input
              type="text"
              className="border rounded w-full p-2"
              placeholder="Enter question"
              value={q.question}
              required
              onChange={(e) => handleQuestionChange(e, questionIndex)}
            />                      
             <label className="block font-bold text-lg mb-2"> Select the marks for this question</label>
             <input
              type="number"
              className="border rounded w-20 p-2"
              placeholder="Enter marks"
              value={q.marks}
              required
              min="1"
              max="10"
              onChange={(e) => handleMarksChange(e, questionIndex)}
            />                  
            <div className="mt-2">
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center mt-2">
                  <input
                    type="radio"
                    name={`correctAnswer-${questionIndex}`}
                    value={optionIndex}
                    checked={q.correctAnswer === optionIndex}
                    onChange={(e) => handleCorrectAnswerChange(e, questionIndex)}
                  />
                  <input
                    type="text"
                    className="ml-2 border rounded p-2 flex-1"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(e, questionIndex, optionIndex)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex flex-col">
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-[20%]"  onClick={addQuestion}>
          Add Question
        </button>
        <div className="flex justify-center">
        <button onClick={handleSubmit} className="bg-purple-500 w-[20%] p-4 py-2 text-white hover:bg-purple-600 rounded">Submit</button>
        </div>
        </div>
      </div>
    );
  };



  async function submit(questions,setQuestions,setIsNewQpClicked,setIsLoading,name,selectedDate){
    let isAnythingEmpty = false;
        if(!name) isAnythingEmpty = true;
        if(!selectedDate) isAnythingEmpty = true;
        questions.forEach((obj)=>{
            if(!obj.question) isAnythingEmpty = true;
            obj.options.map((option)=>{
                if(!option) isAnythingEmpty = true
            })
        })
        if(isAnythingEmpty){
            alert("Some of your fields are  not filled")
            return
        }

    setIsLoading(true)
    try{
      let newQp =await fetch(submitQuestionUrl,{
        method: 'POST',
        mode: 'cors',
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token:user.token,
          questionPaper:questions,
          name:name,
          examDate:selectedDate,
        })
      })
      setIsLoading(false)
        if(newQp.status==400){
          alert("You are not authorized to make this action")
          return
        }
        else if(newQp.status==500){
          return alert("Internal Error, Refresh and retry")
        }
        else{
           alert("Successsfully created")
           setIsNewQpClicked(false)
        }
    }
    catch(err){
      setIsLoading(false)
      console.log(err)
      return alert("Internal Error, Refresh and retry")
    }

  }
  
  export default QuizQuestion;