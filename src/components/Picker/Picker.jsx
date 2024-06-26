import React from 'react'
import './Picker.css'

export function Picker(props) {
    const elements = props.params || [] // Array de objetos con las categorías o dificultades.

    // Genera un Array de <option> con las propiedades necesarias.
    const options = elements.map((element, index) => (
        <option key={index} value={element.value}> 
            {element.label} 
        </option>
    ))

    // Cambia el valor seleccionado y lo pasa a la función en App.jsx que lo cambia.
    const handleSelectChange = (event) => { 
        const selectedValue = {
            value: event.target.value,
            label: event.target.options[event.target.selectedIndex].text
        }
        props.changeValue(selectedValue)
    }

    return (
        <select className='selector' onChange={handleSelectChange}> 
        {/* El valor del label es dirigdo por el useState Category / Difficulty de App.jsx */}
            {options}
        </select>
    )
}
