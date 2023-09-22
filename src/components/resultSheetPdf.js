import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
const user = JSON.parse(localStorage.getItem("user2"))||JSON.parse(localStorage.getItem("user"))


const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    margin: 10,
  },
  header: {
    marginBottom: 10,
  },
  question: {
    marginBottom: 5,
  },
  answer: {
    marginBottom: 5,
  },
  details:{
    display:"flex",
    width:"100%",
    justifyContent:"flex-start",
    marginBottom:10
  }
});

const ResultSheetPDF = ({ questionPaper, answerSheet,setdownLoadId,setSelectedQPId }) => {
    console.log("quesp",questionPaper,answerSheet)
  return (
    <>
    <div className='w-full justify-end items-end flex'>
      <h1 className='text-2xl rounded-full w-7 bg-black text-center text-white' onClick={()=>{setdownLoadId("")
    setSelectedQPId("")
    }}>X</h1>

    </div>
    <PDFViewer width="1000" height="600">
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text>Result Sheet</Text>
            
          </View>
          <View style={styles.details}>
            <Text>Question Paper:{questionPaper.name}</Text>
          <Text>Candidate Name:{answerSheet.studentId.userName}</Text>
          </View>
          
          {questionPaper.questionPaper.map((question, questionIndex) => (
            <View key={questionIndex} style={styles.question}>
              <Text>Question {questionIndex + 1}:</Text>
              <Text>{question.question}</Text>
              <View style={styles.answer}>
                <Text>Correct Answer: {question.options[question.correctAnswer]}</Text>
                <Text>User's Answer: {question.options[answerSheet.answers[questionIndex]]}</Text>
                <Text>Marks: {parseInt(question.marks)}</Text>
              </View>
            </View>
          ))}
        </Page>
      </Document>
    </PDFViewer>
    </>
  );
};

export default ResultSheetPDF;