import { useEffect, useState } from 'react'
import './App.css'
import { Initial } from '../Initial/Initial.jsx'
import { Question } from '../Question/Question.jsx'
import { decode } from 'html-entities'

export function App() {
  const [initialState, setInitialState] = useState(true) // Variable para el renderizado condicional, true se situa en la página de inicio
  const [data, setData] = useState([]) // Guarda el array de las preguntas con las respuestas
  const [error, setError] = useState(null) // Guarda el mensaje de error
  const [check, setCheck] = useState(false) // Variable para el renderizado condicional, true se situa tras analizar las respuestas
  const [correctCount, setCorrectCount] = useState(0)
  const [playAgainCount, setPlayAgainCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple")

        if (response.status === 429) {
          throw new Error("Too many requests. Please wait 5 seconds.")
        }

        const data = await response.json()

        const newData = data.results.map((item, index) => {
          const allAnswers = [...item.incorrect_answers, item.correct_answer]
          return {
            id: index, 
            question: decode(item.question),
            correct_answer: decode(item.correct_answer),
            answers: allAnswers.map(answer => ({ text: decode(answer), isHeld: false})).sort(() => Math.random() - 0.5),
            checked: false
          }
        })

        setData(newData)

      } catch (error) {
        setError(error.message)
        console.error("Error fetching data:", error)
        setTimeout(fetchData, 5000)
        setTimeout(() => setError(null), 5000)
        
      }
    }

    fetchData()
  }, [playAgainCount])

  function changeInitialState() {
    setInitialState(false)
  }

  function changeHeld(answerIndex, id) {
    setData(prevData => { 
      return prevData.map(item => { // Para cada ítem del array donde se guardan las preguntas
        if (item.id === id) { // si es la pregunta donde se ha hecho click
          return {
            ...item,
            answers: item.answers.map((answer, index) => { // Buscar que respuesta es la seleccionada
              if (index === answerIndex) {
                return { ...answer, isHeld: !answer.isHeld } // Cambiar el isHeld a la respuesta seleccionada
              }
              return { ...answer, isHeld: false } // Poner todas las demás a falsi
            })
          }
        }
        return item
      })
    })
  }

  function checkAnswers() {
    data.forEach((question) => {
      question.checked = true
      const selectedAnswer = question.answers.find((answer) => answer.isHeld)
      if (selectedAnswer && selectedAnswer.text === question.correct_answer) {
        setCorrectCount(correctCount + 1)
      }
    })
    setCheck(true)
  }

  function playAgain() {
    setPlayAgainCount(playAgainCount + 1)
    setError(null)
    setCheck(false)
    setCorrectCount(0)
  }

  const questions = data.map((question) => (
    <Question 
      key={question.id} 
      question={question.question} 
      answers={question.answers}
      changeHeld={(answerIndex) => changeHeld(answerIndex, question.id)}
      checked={question.checked}
      correct_answer={question.correct_answer}
    />
  ))

  return (
    <>
      {initialState && <Initial startQuiz={changeInitialState} />}
      
      {!initialState &&
       <main className='app--main'>
        {error && <p className="app--error-message">{error}</p>}
        {!error && questions}
        {!error && !check && <button className='app--check--button' onClick={checkAnswers}>Check answers</button>}
        {check &&
        <footer className='app--footer'>
          <h4>{`You scored ${correctCount}/5 correct anwers`}</h4>
          <button className='app--playagain--button' onClick={playAgain}>Play Again</button>
        </footer>
        }
      </main>
      }
    </>
  )
}
