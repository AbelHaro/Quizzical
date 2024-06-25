import React from 'react'
import './Question.css'

export function Question(props) {
  const buttons = Array.isArray(props.answers) && props.answers.length >= 4
    ? props.answers.slice(0, 4).map((answer, index) => (
        <button 
          key={index} 
          className={`
            question--button 
            ${answer.isHeld && !props.checked ? "question--button--held" : "question--button--normal"}
            ${answer.isHeld && props.checked && answer.text === props.correct_answer ? "question--button--correct" : ""}
            ${answer.isHeld && props.checked && answer.text !== props.correct_answer ? "question--button--incorrect" : ""}
          `} 
          onClick={() => !props.checked ? props.changeHeld(index): null}>{answer.text}
        </button>
      ))
    : null

  return (
    <div className='question--container'>
      <h2 className='question--text'>{props.question}</h2>
      <main className={`question--button--container`}>
        {buttons}
      </main>
      <hr className='question--separator'/>
    </div>
  );
}
