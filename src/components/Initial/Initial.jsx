import React from 'react'
import './Initial.css'

export function Initial(props) {
    return (
        <main className='container'>
            <h1 className='title'>Quizzical</h1>
            <h3 className='description'> Answer correctly 5 questions to win!</h3>
            <button className='button' onClick={props.startQuiz}>Start Quiz</button>
        </main>
    )
}