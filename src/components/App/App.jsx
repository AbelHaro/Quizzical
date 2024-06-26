import { useEffect, useState } from 'react'
import './App.css'
import { Initial } from '../Initial/Initial.jsx'
import { Question } from '../Question/Question.jsx'
import { decode } from 'html-entities'
import { params } from '../../../api_params.js'

export function App() {
  // Estado para el renderizado condicional, true renderiza la página de inicio, false renderiza la página con las preguntas.
  const [initialState, setInitialState] = useState(true) 

  // Estado para guardar el array de las preguntas con las respuestas.
  const [data, setData] = useState([])

  // Estado para el mensaje de error.
  const [error, setError] = useState(null)

  // Estado para el renderizado condicional, true se situa tras analizar las respuestas.
  const [check, setCheck] = useState(false) 
  
  // Estado para almacenar el número de respuestas correctas tras comprobar las respuestas.
  const [correctCount, setCorrectCount] = useState(0)

  // Estado para forzar la petición a la API mediante useEffect.
  const [playAgainCount, setPlayAgainCount] = useState(0)

  // Estado para saber la categoria de las preguntas.
  const [category, setCategory] = useState(params.categories[0])

  // Estado para saber la dificultad de las preguntas.
  const [difficulty, setDifficulty] = useState(params.difficulties[0])

  // Estado para mostrar el botón de 'Check Answers'.
  const [showCheckAnswers, setShowCheckAnswers] = useState(false)

  // Efecto para obtener los datos de la API cuando el se presiona el botón de 'Star Quiz' o 'Play Again'.
  useEffect(() => {
    if (!initialState) {
      const fetchData = async () => {
        try {
          console.log(category, difficulty)
          const response = await fetch(`https://opentdb.com/api.php?amount=5&category=${category.value}&difficulty=${difficulty.value}&type=multiple`)
          //const response = await fetch("https://opentdb.com/api.php?amount=5&category=18&difficulty=medium&type=multiple")

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
              answers: allAnswers.map(answer => ({ text: decode(answer), isHeld: false })).sort(() => Math.random() - 0.5),
              checked: false
            }
          })

          console.log(newData)
          setData(newData)
          setShowCheckAnswers(true)

        } catch (error) {
          setError(error.message)
          setTimeout(fetchData, 5000)
          setTimeout(() => setError(null), 5000)
        }
      }

      fetchData()
    }
  }, [playAgainCount, initialState, category, difficulty])

  /* Modifica el estado inicial, se activa al presionar el botón 'Start Quiz' del componente Inital. */
  function changeInitialState() { 
    setInitialState(false)
  }

  /**
   * Maneja el estado de 'isHeld' de las cada respuesta en cada pregunta.
   * La función se activa al presionar el botón correspondiente en <Question/>.
   * @param {number} answerIndex - El índice de la respuesta seleccionada.
   * @param {number} id - El id de la pregunta correspondiente.
   * */
  function changeHeld(answerIndex, id) {
    setData(prevData => { 
      return prevData.map(item => { // Para cada ítem del array donde se guardan las preguntas.
        if (item.id === id) { // si es la pregunta donde se ha hecho click.
          return {
            ...item,
            answers: item.answers.map((answer, index) => { // Buscar que respuesta es la seleccionada.
              if (index === answerIndex) {
                return { ...answer, isHeld: !answer.isHeld } // Cambiar el isHeld a la respuesta seleccionada.
              }
              return { ...answer, isHeld: false } // Poner todas las demás a false.
            })
          }
        }
        return item
      })
    })
  }

  /* Modifica el objeto que se pasa a <Question /> para que el componente muestre
     las respuestas correctas y cuenta el número de respuestas correctas */
  function checkAnswers() {
    let count = 0
    data.forEach((question) => {
      question.checked = true
      const selectedAnswer = question.answers.find((answer) => answer.isHeld)
      if (selectedAnswer && selectedAnswer.text === question.correct_answer) {
        count++
      }
    })
    setCorrectCount(count)
    setCheck(true)
  }

  /* Resetea todos los estados a sus valores iniciales para renderizar otras preguntas */
  function playAgain() {
    setPlayAgainCount(playAgainCount + 1)
    setError(null)
    setCheck(false)
    setCorrectCount(0)
  }

  // Genera un Array de <Question /> con las propiedades necesarias.
  const questions = data.map((question) => (
    <Question 
      key={question.id}                 // Identificador único para cada pregunta.
      question={question.question}      // El texto de la pregunta.
      answers={question.answers}        // Array de objetos de respuestas.
      changeHeld={(answerIndex) => changeHeld(answerIndex, question.id)} // Función para cambiar el estado de 'isHeld' de una respuesta.
      checked={question.checked}        // Indica si las respuestas ya han sido verificadas.
      correct_answer={question.correct_answer} // La respuesta correcta para la pregunta.
    />
  ))

  return (
    <>
      {initialState && <Initial 
                        startQuiz={changeInitialState} // Función para cambiar el estado inicial.
                        params={params}                // Objeto con las categorías y dificultades.
                        category={category}            // La categoría seleccionada.
                        changeCategory={(pickerCategory) => {return setCategory(pickerCategory)}} // Función para cambiar la categoría.
                        difficulty={difficulty}        // La dificultad seleccionada.
                        changeDifficulty={(pickerDifficulty) => setDifficulty(pickerDifficulty)}  // Función para cambiar la dificultad.
                       />
      }
      
      {!initialState && (
        <main className='app--main'>
          {error && <p className="app--error--message">{error}</p>}
          {/* Muestra las preguntas solo si no hay error */}
          {!error && questions}
          {/* Muestra el botón de verificar respuestas si no hay error y no se han verificado las respuestas aún */}
          {!error && !check && showCheckAnswers && (
            <button className='app--check--button' onClick={checkAnswers}>
              Check answers
            </button>
            )}
          {/* Muestra el footer con los resultados si se han verificado las respuestas */}
          {check && (
            <footer className='app--footer'>
              <h4>{`You scored ${correctCount}/5 correct answers`}</h4>
              <button className='app--playagain--button' onClick={playAgain}>
                Play Again
              </button>
              <button className='app--playagain--button' onClick={() => {playAgain();setInitialState(true)}}>
                Go Back
              </button>
            </footer>
          )}
        </main>
      )}
    </>
  )
  
}
