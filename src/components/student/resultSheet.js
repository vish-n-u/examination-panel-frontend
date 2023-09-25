import React from 'react';

const ResultPaper = ({ questionPaper, answerSheet,setSelectedQPId }) => {
  // Calculate the total marks
  console.log("quwstion[pae",questionPaper,answerSheet)
  const calculateTotalMarks = () => {
    let totalMarks = 0;
    for (let i = 0; i < questionPaper.questionPaper.length; i++) {
      const correctAnswer = questionPaper.questionPaper[i].correctAnswer;
      const userAnswer = answerSheet.answers[i];
      if (correctAnswer === userAnswer) {
        totalMarks += parseInt(questionPaper.questionPaper[i].marks);
      }
    }
    return totalMarks;
  };

  return (
    <div className="w-full z-10 bg-white shadow-md h-full p-4">
        <h1 className='absolute top-3 right-4 text-xl cursor-pointer' onClick={()=>{
        setSelectedQPId(0)
      }}>X</h1>
      <h2 className="text-xl font-bold mb-4">Answer Paper</h2>
      <div className='w-full flex justify-center items-center flex-col'>
        <h1 className='text-lg font-semibold'>Question Paper:{questionPaper.name}</h1>
        <h1 className='text-lg font-semibold'>Candidate Name:{answerSheet.studentId.userName}</h1>
      </div>
      {questionPaper.questionPaper.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-4">
          <p className="font-bold">Question {questionIndex + 1}:</p>
          <p>{question.question}</p>
          <div className="mt-2">
            <p>Correct Answer: {question.options[question.correctAnswer]}</p>
            <p>User's Answer: {question.options[answerSheet[questionIndex]]}</p>
            <p>Marks: {parseInt(question.marks)}</p>
          </div>
        </div>
      ))}
      <p className="font-bold">Total Marks: {calculateTotalMarks()}</p>
    </div>
  );
};

export default ResultPaper;
