import React, { useState } from 'react';
import { creatAnswerPapersUrl } from '../../urls';
const user = JSON.parse(localStorage.getItem("user2"))||JSON.parse(localStorage.getItem("user"))


const AnswerPaper = ({ questions,setSelectedQPId,selectedQpId }) => {
  const [answers, setAnswers] = useState(new Array(questions.length).fill(-1)); // Initialize with -1 indicating no answer selected
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Check if all questions have been answered
    if (answers.includes(-1)) {
      alert('Please answer all questions before submitting.');
      return;
    }
    submit(selectedQpId,answers)
    console.log("answers: " + answers)

    // You can submit the answers to the server or perform further actions here
    // For this example, we'll just display the selected answers
    alert('Answers submitted: ' + answers.join(', '));
    setIsSubmitted(true);
  };

  return (
    <div className="w-full h-full bg-white z-10 shadow-md shadow-black p-4">
      <h1 className='absolute top-3 right-2 taxt-xl cursor-pointer' onClick={()=>{
        setSelectedQPId(0)
      }}>X</h1>
      <h2 className="text-xl font-bold mb-4">Answer Paper</h2>
      {questions.map((q, questionIndex) => (
        <div key={questionIndex} className="mb-4">
          <p className="font-bold">Question {questionIndex + 1}:</p>
          <p>{q.question}</p>
          <div className="mt-2">
            {q.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center mt-2">
                <input
                  type="radio"
                  name={`answer-${questionIndex}`}
                  value={optionIndex}
                  checked={answers[questionIndex] === optionIndex}
                  onChange={() => handleAnswerChange(questionIndex, optionIndex)}
                  disabled={isSubmitted}
                />
                <label className="ml-2">{option}</label>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        disabled={isSubmitted}
      >
        {isSubmitted ? 'Answers Submitted' : 'Submit Answers'}
      </button>
    </div>
  );
};

export default AnswerPaper;


async function submit(questionPaperId,answers){
  console.log("answers",questionPaperId,answers)
  try{
    let newAnswersheet = await fetch(creatAnswerPapersUrl,{
      method: 'POST',
      mode:"cors",
      headers:{"Content-Type": "application/json"},
      body:JSON.stringify({token:user.token,answers,questionPaperId})
    })
    if(newAnswersheet.status==201){
      alert("Answersheet successfully submitted")
    }
    else{
      alert("Internal Server err")
    }
  }
  catch(e){
    console.log(e)
    // return alert("Internal Error")
  }
}