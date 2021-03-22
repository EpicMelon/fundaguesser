import React, {useState, useCallback, useEffect} from 'react';

import { useForm } from "react-hook-form";

function Input({currentGuess, makeGuess}) {
    const { register, handleSubmit, watch, errors, reset } = useForm();

    const submit = useCallback((form) => {

        reset();
    })

    const [test, setTest] = useState(0);

    function handleChange(event) {
        var amount = event.target.value * 1000;

        makeGuess(amount);
    };

    const DEFAULT_GUESS = 1100;

    useEffect(() => {
        makeGuess(DEFAULT_GUESS * 1000)
        return () => {
            
        }
    }, [])

    return (
        <div className="inputDiv">
            <p className="inputGuess"><b>{currentGuess}</b></p>

            <input 
                id="typeinp"
                type="range" 
                min="1" max="2200"
                onChange={handleChange}
                step="1"
                defaultValue={DEFAULT_GUESS}
                className="inputSlider"/>
        </div>
    )
}

export default Input
