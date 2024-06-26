import React, { useId } from 'react'
import './Initial.css'
import { Picker } from '../Picker/Picker.jsx'

export function Initial(props) {
    return (
        <main className='container'>
            <h1 className='title'>Quizzical</h1>
            <h3 className='description'> Answer correctly 5 questions to win!</h3>
            <div className='picker--container'>
                <div className='picker--items--container'>
                    <h4 className='picker--text'>Categories</h4>
                    <Picker 
                        key={useId()} // Genera un identificador único para el componente.
                        params={props.params.categories} // Array de objetos con las categorías.
                        value={props.category}  // La categoría seleccionada.
                        changeValue={props.changeCategory} // Función para cambiar la categoría.
                    />
                </div>
                <div className='picker--items--container'>
                    <h4 className='picker--text'>Difficulty</h4>
                    <Picker 
                        key={useId()} // Genera un identificador único para el componente.
                        params={props.params.difficulties} // Array de objetos con las dificultades.
                        value={props.difficulty} // La dificultad seleccionada.
                        changeValue={props.changeDifficulty} // Función para cambiar la dificultad.
                    />
                </div>
            </div>
            <button className='button' onClick={props.startQuiz}>Start Quiz</button>
        </main>
    )
}
