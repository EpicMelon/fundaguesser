import React, {useState, useCallback} from 'react';

import { useForm } from "react-hook-form";

function Input({currentGuess, makeGuess}) {
    const { register, handleSubmit, watch, errors, reset } = useForm();

    const submit = useCallback((form) => {
        makeGuess(form.amount);

        reset();
    })

    return (
        <div>
            <p> Current Guess: {currentGuess}</p>

            <form onSubmit={handleSubmit(submit)}>
                <div className="bigWriteDiv">
                    <input name="amount" ref={
                        register({required: true, minLength: 1})}
                    placeholder={"100 000"} type="number" autoComplete="off"
                    className=""/>
                    <input type="submit" value="Submit Guess" className="blueButton bigWriteButton"/>
                </div>
            </form>
        </div>
    )
}

export default Input
